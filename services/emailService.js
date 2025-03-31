const nodemailer = require("nodemailer");

// Vérification des variables d'environnement
if ((!process.env.SMTP_USER || !process.env.SMTP_PASS) && process.env.NODE_ENV !== "test") {
    console.error("❌ Erreur: Variables d'environnement SMTP_USER ou SMTP_PASS non définies !");
    process.exit(1);
}

// Création du transporteur sécurisé
let transporter;

try {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    console.log("✅ Transporteur Nodemailer configuré avec succès !");
} catch (error) {
    console.error("❌ Erreur lors de la configuration du transporteur :", error);
}

// Fonction générique
const sendMail = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email envoyé avec succès :", subject);
        return true;
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi de l'email :", error);
        return false;
    }
};

// ✅ Fonction pour l'envoi du code 2FA
const send2FACodeEmail = async (userEmail, code) => {
    const html = `<h2>Code de vérification 2FA</h2>
        <p>Votre code est : <strong>${code}</strong></p>
        <p>⏳ Il expire dans 10 minutes.</p>`;
    return await sendMail(userEmail, "🔐 Votre code de vérification", html);
};

// Fonctions existantes
const sendReservationConfirmation = async (userEmail, reservation) => {
    const html = `<h2>Merci pour votre réservation !</h2>
        <p>📅 Date : ${reservation.date}</p>
        <p>🧹 Service : ${reservation.service}</p>
        <p>Votre réservation est en attente de confirmation.</p>`;
    return await sendMail(userEmail, "Confirmation de votre réservation 🏠", html);
};

const sendReminderEmail = async (userEmail, reservation) => {
    const html = `<h2>Rappel de votre réservation</h2>
        <p>📅 Date : ${reservation.date}</p>
        <p>🧹 Service : ${reservation.service}</p>
        <p>Assurez-vous d’être disponible à l’heure convenue.</p>`;
    return await sendMail(userEmail, "⏳ Rappel : Votre service de ménage approche !", html);
};

const sendCancellationEmail = async (userEmail, reservation) => {
    const html = `<h2>Votre réservation a été annulée ❌</h2>
        <p>📅 Date : ${reservation.date}</p>
        <p>🧹 Service : ${reservation.service}</p>
        <p>Nous sommes désolés de cette annulation.</p>`;
    return await sendMail(userEmail, "⚠️ Annulation de votre réservation", html);
};

const sendClientNotification = async (userEmail, reservation) => {
    const html = `<h2>Merci pour votre réservation</h2>
        <p>📅 Date : ${reservation.date}</p>
        <p>🧹 Service : ${reservation.service}</p>
        <p>👨‍🔧 Prestataire : ${reservation.providerName}</p>
        <p>📍 Adresse : ${reservation.location}</p>`;
    return await sendMail(userEmail, "✅ Votre réservation a été confirmée !", html);
};

const sendProviderNotification = async (providerEmail, reservation) => {
    const html = `<h2>Nouvelle mission !</h2>
        <p>📅 Date : ${reservation.date}</p>
        <p>📍 Localisation : ${reservation.location}</p>
        <p>🧹 Service : ${reservation.service}</p>`;
    return await sendMail(providerEmail, "📌 Nouvelle mission de ménage !", html);
};

// ✅ Exports
module.exports = {
    send2FACodeEmail,
    sendReservationConfirmation,
    sendReminderEmail,
    sendCancellationEmail,
    sendClientNotification,
    sendProviderNotification,
};

