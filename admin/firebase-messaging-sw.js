import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getMessaging } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-messaging-sw.js';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

const app = initializeApp({
    apiKey: "AIzaSyAouFNelqNEZXCnylVxloPWPVErl5sbN1g",
  authDomain: "clubcheck-9e904.firebaseapp.com",
  projectId: "clubcheck-9e904",
  storageBucket: "clubcheck-9e904.firebasestorage.app",
  messagingSenderId: "498360094294",
  appId: "1:498360094294:web:6ad8fdb4215bd2ce7575f7"
});


getMessaging(app);
