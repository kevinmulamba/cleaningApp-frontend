const mongoose = require('mongoose');
const Provider = require('./models/Provider'); // ✅ Vérifie bien le chemin si besoin

// ✅ Remplace cette URL si ta base est différente
mongoose.connect('mongodb://127.0.0.1:27017/cleaningApp-backend', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connexion à MongoDB établie');
})
.catch((err) => {
  console.error('❌ Erreur de connexion à MongoDB', err);
});

// ✅ Fonction pour ajouter un prestataire manuellement
const addProviderManuel = async () => {
  try {
    const newProvider = new Provider({
      name: 'Jean Dupont',
      service: 'Nettoyage maison',
      phoneNumber: '0601020304',
      email: 'jean.dupont@example.com',
      location: {
        lat: 48.8566,
        lng: 2.3522
      }
    });

    const savedProvider = await newProvider.save();
    console.log('✅ Prestataire ajouté avec succès :', savedProvider);

    mongoose.connection.close(); // ✅ Fermer la connexion proprement
  } catch (error) {
    console.error('❌ Erreur lors de l’ajout :', error);
    mongoose.connection.close(); // Ferme la connexion même en cas d’erreur
  }
};

addProviderManuel();

