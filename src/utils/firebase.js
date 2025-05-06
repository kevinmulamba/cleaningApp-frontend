// frontend/src/utils/firebase.js

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyB4qjpHOjEvrkOzgVDMmP8yXX-P8BTiJpg",
  authDomain: "cleaningapp-cd040.firebaseapp.com",
  projectId: "cleaningapp-cd040",
  storageBucket: "cleaningapp-cd040.firebasestorage.app",
  messagingSenderId: "1069923600823",
  appId: "1:1069923600823:web:04ffa06b99510f077a4032",
  measurementId: "G-MRBTR07VXC"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage }; // 👈 Bien exporter ces trois !

