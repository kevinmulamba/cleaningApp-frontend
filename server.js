// server.js
require("dotenv").config({ path: ".env" });

const express = require("express");
const app = express(); // D'abord définir `app`

// 👉 Centralisation des middlewares
require("./config/server")(app);

const passport = require("passport");
require("./config/passportGoogle");

// 📦 Sentry
const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://71419f0293f8284fa4c180ef7ef96233@o4509081573916672.ingest.de.sentry.io/4509084279504976",
  integrations: [
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

console.log("🔍 Chemin du fichier .env :", require("path").resolve(".env"));
console.log("🔍 Vérification des variables d'environnement...");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Défini ✅" : "Non défini ❌");

const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const { Server: EngineIOServer } = require("engine.io");
const cron = require("node-cron");
const relaunchAbandonedReservations = require("./cron/relaunchAbandonedReservations");

const server = http.createServer(app);

// ⚙️ Websocket fix
if (EngineIOServer.prototype && EngineIOServer.prototype.opts) {
  EngineIOServer.prototype.opts.wsEngine = require("ws").Server;
} else {
  console.warn("⚠️ EngineIOServer.prototype.opts est indéfini. Vérifie tes dépendances.");
}

// ✅ CORS personnalisé
const corsOptions = {
  origin: function (origin, callback) {
    const allowedLocalhost = /^http:\/\/localhost:\d+$/;
    if (!origin || allowedLocalhost.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
};

app.use(cors(corsOptions));

// 📌 Connexion MongoDB
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connecté !");
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
}
connectDatabase();

async function closeDatabase() {
  console.log("📌 Fermeture de MongoDB...");
  await mongoose.connection.close();
  console.log("📌 MongoDB déconnecté après les tests.");
}

// 📌 Importation des routes
const stripeWebhook = require("./routes/stripeWebhook"); // Import spécial pour Webhook
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const providerRoutes = require("./routes/providerRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const trajetsRoutes = require("./routes/trajets");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const adminRoutes = require("./routes/adminRoutes");
const suggestionsRoutes = require("./routes/suggestionsRoutes");
const couponRoutes = require("./routes/couponRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const reportRoutes = require("./routes/reportRoutes");
const logsRoutes = require("./routes/logsRoutes");
const verificationRoutes = require("./routes/verificationRoutes");
const estimateRoutes = require("./routes/estimateRoutes");
const configRoutes = require("./routes/configRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const testRoutes = require('./routes/testRoutes');

// 📌 Stripe Webhook : doit être AVANT express.json()
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// 📌 Middlewares globaux après le webhook
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

// 📌 Déclaration des autres routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/trajets", trajetsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/suggestions", suggestionsRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/logs", logsRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/estimate-from-photo", estimateRoutes);
app.use("/api/config", configRoutes);
app.use("/api/stripe", stripeRoutes); // checkout et paiement normaux
app.use('/api/test', testRoutes);

// ✅ Route parrainages
const User = require("./models/User");
app.get("/api/users/:id/referrals", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const referredUsers = await User.find({ referredBy: user.referralCode }).select("email createdAt");

    res.json({
      referralsCount: user.referralsCount,
      referralRewards: user.referralRewards,
      referredUsers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ✅ Route test Sentry
app.get("/sentry-test", function mainHandler(req, res) {
  throw new Error("🧨 Erreur test volontaire pour Sentry !");
});

// ✅ Route santé
app.get("/test", (req, res) => {
  res.status(200).json({ message: "✅ Serveur opérationnel" });
});

// 📌 Middleware 404
app.use((req, res) => {
  res.status(404).json({ message: "❌ Route introuvable" });
});

// 📌 Middleware erreurs personnalisées
app.use((err, req, res, next) => {
  console.error("❌ Erreur interne du serveur :", err.stack);
  res.status(500).json({ message: "❌ Erreur interne du serveur" });
});

// 👇 Middleware Sentry pour capturer les erreurs
app.use(Sentry.Handlers.errorHandler());

// 📌 Websockets
const io = new Server(server, { cors: corsOptions });
app.set("io", io);

const ML_API_URL = "http://localhost:5001/predict-trajet";
io.on("connection", (socket) => {
  console.log("🟢 Un utilisateur s’est connecté :", socket.id);

  socket.on("demande-trajet", async (data) => {
    try {
      const response = await axios.post(ML_API_URL, data);
      socket.emit("trajet-optimisé", response.data);
    } catch (error) {
      console.error("❌ Erreur API ML :", error.message);
      socket.emit("trajet-optimisé", { erreur: "Erreur API ML" });
    }
  });

  socket.on("send-message", (messageData) => {
    socket.broadcast.emit("receive-message", messageData);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Un utilisateur s’est déconnecté");
  });
});

// ✅ Route de test pour vérifier que le serveur fonctionne
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "✅ Serveur fonctionnel avec middlewares" });
});

// ✅ Démarrage serveur
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
  });
}

module.exports = { app, server, closeDatabase };

