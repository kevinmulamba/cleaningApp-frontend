const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect('mongodb://127.0.0.1:27017/cleaningApp-backend')
  .then(() => console.log("✅ Connexion MongoDB établie"))
  .catch(err => console.error("❌ Erreur connexion MongoDB :", err));

async function addUsers() {
  try {
    const users = [
      { name: 'Alice Dupont', email: 'alice.dupont@example.com', password: 'password123' },
      { name: 'Bob Martin', email: 'bob.martin@example.com', password: 'password123' },
      { name: 'Charlie Durand', email: 'charlie.durand@example.com', password: 'password123' },
    ];

    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = new User(user);
        await newUser.save();
        console.log("✅ Utilisateur ajouté :", newUser);
      } else {
        console.log("ℹ️ Utilisateur déjà existant :", existingUser.email);
      }
    }
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Erreur lors de l’ajout des utilisateurs :", error);
  }
}

addUsers();

