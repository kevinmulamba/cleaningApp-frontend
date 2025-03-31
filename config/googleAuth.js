const { google } = require('googleapis');
const { auth } = require('google-auth-library');
const path = require('path');

// Charger les credentials depuis le fichier JSON
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH;

const authClient = new google.auth.GoogleAuth({
  keyFile: CREDENTIALS_PATH,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

// Exporter l'authentification pour l'utiliser ailleurs
module.exports = authClient;

