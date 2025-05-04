// addUsersManuel.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose
  .connect("mongodb://127.0.0.1:27017/cleaningApp-backend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("✅ Connecté à MongoDB");

    // Supprimer tous les comptes existants
    await User.deleteMany({});
    console.log("🧹 Tous les utilisateurs supprimés.");

    const hashPassword = async (pwd) => await bcrypt.hash(pwd, 10);

    const users = [
      {
        name: "Client Test",
        email: "client@test.com",
        password: await hashPassword("pass1234"),
        role: "client",
        isAdmin: false,
        isProvider: false,
        referralCode: "CLIENT123",
      },
      {
        name: "Admin Client",
        email: "adminclient@test.com",
        password: await hashPassword("admin1234"),
        role: "client",
        isAdmin: true,
        isProvider: false,
        referralCode: "ADMINCLIENT123",
      },
      {
        name: "Prestataire Test",
        email: "prestataire@test.com",
        password: await hashPassword("pass1234"),
        role: "provider",
        isAdmin: false,
        isProvider: true,
        referralCode: "PROVIDER123",
      },
      {
        name: "Admin Prestataire",
        email: "adminprestataire@test.com",
        password: await hashPassword("admin1234"),
        role: "provider",
        isAdmin: true,
        isProvider: true,
        referralCode: "ADMINPRO123",
      },
    ];

    await User.insertMany(users);
    console.log("✅ Comptes créés avec succès.");
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Erreur MongoDB :", err);
    mongoose.disconnect();
  });

