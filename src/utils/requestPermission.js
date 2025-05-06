// src/utils/requestPermission.js
import { messaging, getToken } from './firebase';

export const requestNotificationPermission = async () => {
  console.log('🔔 Demande de permission pour les notifications...');
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BMMNW6J2LlW4eUZk5_o35fCc8vJ9VTIgyiJwpsXSolf4RptjKL60poEmwPx60PMG3AtK8FsjuzU7Oqa8N4jgbs0',
      });
      console.log('✅ Token FCM :', token);
      return token;
    } else {
      console.warn('❌ Permission refusée pour les notifications');
      return null;
    }
  } catch (err) {
    console.error('Erreur lors de la récupération du token FCM', err);
    return null;
  }
};

