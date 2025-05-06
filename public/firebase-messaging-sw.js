// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB4qjpHOjEvrkOzgVDMmP8yXX-P8BTiJpg",
  authDomain: "cleaningapp-cd040.firebaseapp.com",
  projectId: "cleaningapp-cd040",
  storageBucket: "cleaningapp-cd040.firebasestorage.app",
  messagingSenderId: "1069923600823",
  appId: "1:1069923600823:web:04ffa06b99510f077a4032",
  measurementId: "G-MRBTR07VXC"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] 🔔 Message reçu en arrière-plan : ', payload);

  const notificationTitle = payload.notification.title || 'Notification';
  const notificationOptions = {
    body: payload.notification.body || '',
    icon: '/favicon.ico',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

