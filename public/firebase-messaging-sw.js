importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAbz9z6IZ5DeXEd-Fmy-ubE8d604m9VXO4",
  authDomain: "djtech-655dd.firebaseapp.com",
  projectId: "djtech-655dd",
  storageBucket: "djtech-655dd.firebasestorage.app",
  messagingSenderId: "210205499554",
  appId: "1:210205499554:web:9dd165df1f793736f237fb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message: ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: payload.notification.icon,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
