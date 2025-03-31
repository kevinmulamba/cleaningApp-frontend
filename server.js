// server.js
require("dotenv").config({ path: ".env" });

console.log("🔍 Chemin du fichier .env :", require("path").resolve(".env"));
console.log("🔍 Vérification des variables d'environnement...");
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "Défini ✅" : "Non défini ❌");

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const { Server: EngineIOServer } = require("engine.io");

if (EngineIOServer.prototype && EngineIOServer.prototype.opts) {
    EngineIOServer.prototype.opts.wsEngine = require("ws").Server;
} else {
    console.warn("⚠️ EngineIOServer.prototype.opts est indéfini. Vérifie tes dépendances.");
}

const app = express();
let server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

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

// 📌 Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// 📌 Importation des routes
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const providerRoutes = require('./routes/providerRoutes'); // ✅ Important
const reservationRoutes = require('./routes/reservationRoutes');
const trajetsRoutes = require('./routes/trajets');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 📌 Déclaration des routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/providers', providerRoutes); // ✅ ATTENTION à l'import ici
app.use('/api/reservations', reservationRoutes);
app.use('/api/trajets', trajetsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Route parrainages
const User = require('./models/User');
app.get('/api/users/:id/referrals', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

        const referredUsers = await User.find({ referredBy: user.referralCode }).select('email createdAt');

        res.json({
            referralsCount: user.referralsCount,
            referralRewards: user.referralRewards,
            referredUsers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// ✅ Test serveur
app.get('/test', (req, res) => {
    res.status(200).json({ message: "✅ Serveur opérationnel" });
});

// 📌 Middleware 404
app.use((req, res) => {
    res.status(404).json({ message: '❌ Route introuvable' });
});

// 📌 Middleware erreurs serveur
app.use((err, req, res, next) => {
    console.error('❌ Erreur interne du serveur :', err.stack);
    res.status(500).json({ message: '❌ Erreur interne du serveur' });
});

// 📌 Websockets
const ML_API_URL = 'http://localhost:5000/predict-trajet';
io.on('connection', (socket) => {
    console.log('🟢 Un utilisateur s’est connecté :', socket.id);

    socket.on('demande-trajet', async (data) => {
        try {
            const response = await axios.post(ML_API_URL, data);
            socket.emit('trajet-optimisé', response.data);
        } catch (error) {
            console.error('❌ Erreur API ML :', error.message);
            socket.emit('trajet-optimisé', { erreur: 'Erreur API ML' });
        }
    });

    socket.on('send-message', (messageData) => {
        socket.broadcast.emit('receive-message', messageData);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Un utilisateur s’est déconnecté');
    });
});

// ✅ Démarrage serveur
if (require.main === module) {
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => {
        console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
}

module.exports = { app, server, closeDatabase };

