const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require("../config/jwt");
const shortid = require('shortid');
const emailService = require('../services/emailService');
const ActivityLog = require("../models/ActivityLog");

// 👉 Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password, referralCodeUsed } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    let codeUnique, existe = true;
    while (existe) {
      codeUnique = shortid.generate();
      const codeCheck = await User.findOne({ referralCode: codeUnique });
      if (!codeCheck) existe = false;
    }
    newUser.referralCode = codeUnique;

    if (referralCodeUsed) {
      const referrer = await User.findOne({ referralCode: referralCodeUsed });
      if (referrer) {
        referrer.referralsCount += 1;
        referrer.referralRewards += 1;
        await referrer.save();
        newUser.referredBy = referralCodeUsed;
      }
    }

    await newUser.save();

    res.status(201).json({ message: "✅ Utilisateur inscrit avec succès" });
  } catch (error) {
    console.error("❌ Erreur à l’inscription :", error);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
};

// 🔐 Connexion (avec 2FA si prestataire)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Champs requis manquants" });
    }

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // ✅ 2FA obligatoire pour prestataire
    if (user.role === "prestataire") {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

      user.twoFactorCode = code;
      user.twoFactorExpires = expires;
      await user.save();

      await emailService.send2FACodeEmail(user.email, code);
      return res.status(200).json({
        message: "Code 2FA envoyé par e-mail",
        requires2FA: true,
        userId: user._id,
      });
    }

    // ✅ Génération du token
    const token = generateToken({
      id: user._id,
      role: user.role,
      isAdmin: user.isAdmin || false,
    });

    // ✅ Log d'activité
    await ActivityLog.create({
      user: user._id,
      action: "login",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // ✅ Réponse
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (err) {
    console.error("❌ Erreur lors du login :", err);
    res.status(500).json({ message: "❌ Erreur serveur" });
  }
};

// ✅ Vérification du code 2FA
exports.verify2FA = async (req, res) => {
  const { userId, code } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(400).json({ message: "Utilisateur introuvable" });

    if (!user.twoFactorCode || !user.twoFactorExpires) {
      return res.status(400).json({ message: "Aucune vérification 2FA en attente" });
    }

    const now = new Date();
    if (user.twoFactorExpires < now) {
      return res.status(400).json({ message: "Code expiré, veuillez vous reconnecter" });
    }

    if (user.twoFactorCode !== code) {
      return res.status(400).json({ message: "Code incorrect" });
    }

    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    await ActivityLog.create({
      user: user._id,
      action: "login",
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.isAdmin || false,
      },
    });

  } catch (err) {
    console.error("❌ Erreur vérification 2FA :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

