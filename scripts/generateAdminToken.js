const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connecté à MongoDB");

  // 🔎 Trouve un utilisateur admin (ou modifie avec ton email admin)
  const admin = await User.findOne({ role: 'admin' });

  if (!admin) {
    console.log("❌ Aucun utilisateur admin trouvé");
    return process.exit(1);
  }

  const token = jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  console.log("🎫 Token JWT admin :\n");
  console.log(token);

  process.exit();
};

run().catch(err => {
  console.error("❌ Erreur :", err);
  process.exit(1);
});

