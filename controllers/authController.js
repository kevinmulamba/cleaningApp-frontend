const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const shortid = require('shortid'); // pour générer les codes de parrainage
const emailService = require('../services/emailService'); // pour envoyer le code 2FA

// 👉 Inscription
exports.register = async (req, res) => {
  try {
    const { email, password, referralCodeUsed } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: '❌ Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });

    // 🔁 Génère un code de parrainage unique
    let codeUnique, existe = true;
    while (existe) {
      codeUnique = shortid.generate();
      const codeCheck = await User.findOne({ referralCode: codeUnique });
      if (!codeCheck) existe = false;
    }
    newUser.referralCode = codeUnique;

    // 🎁 Si un code est utilisé
    if (referralCodeUsed) {
      const referrer = await User.findOne({ referralCode: referralCodeUsed });
      if (referrer) {
        referrer.referralsCount += 1;
        referrer.referralRewards += 1; // ou autre système
        await referrer.save();
        newUser.referredBy = referralCodeUsed;
      }
    }

    await newUser.save();
    res.status(201).json({ message: "✅ Utilisateur inscrit avec succès" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '❌ Erreur serveur' });
  }
};

// 🔐 Connexion avec 2FA pour les prestataires
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Utilisateur non trouvé' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mot de passe invalide' });

    // 👉 Si prestataire, déclencher 2FA
    if (user.role === 'prestataire') {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.twoFactorCode = code;
      user.twoFactorExpires = expires;
      await user.save();

      await emailService.send2FACodeEmail(user.email, code);

      return res.status(200).json({ message: 'Code 2FA envoyé par e-mail', requires2FA: true, userId: user._id });
    }

    // 🎟 Auth classique pour les autres
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
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

    // ✅ Code valide → Authentifier
    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

