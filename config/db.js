const mongoose = require("mongoose");

// Fonction pour se connecter à MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erreur MongoDB: ${error.message}`);
        process.exit(1); // Arrête le serveur en cas d’échec
    }
};

module.exports = connectDB;

