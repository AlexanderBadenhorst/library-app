// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Corrected import
import { getAuth } from "firebase/auth"; // Import getAuth
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwSo4awnfsZF6cTdCBQjxJryRh5f6RrIs",
  authDomain: "library-app-7b5d9.firebaseapp.com",
  projectId: "library-app-7b5d9",
  storageBucket: "library-app-7b5d9.firebasestorage.app",
  messagingSenderId: "496772156704",
  appId: "1:496772156704:web:6280015e6e62dc20c11b45",
  measurementId: "G-YNRJDYB40Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore

export { auth }; // Export the auth object
export { db }; // Export the db object