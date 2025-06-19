
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCw3asW3W4__cYzWG6DBxUyaWtgCUhIbVs",
  authDomain: "pollitgo.firebaseapp.com",
  projectId: "pollitgo",
  storageBucket: "pollitgo.firebasestorage.app",
  messagingSenderId: "1078455480838",
  appId: "1:1078455480838:web:bb4f5f16e70a3ccf3c0987"
};

// Check if the API key is provided. This is crucial for Firebase services to work.
if (!firebaseConfig.apiKey) {
  console.error(
    "Firebase API Key is missing or undefined. " +
    "Please ensure that NEXT_PUBLIC_FIREBASE_API_KEY is set in your environment variables. " +
    "For local development, this is typically set in a .env.local file in the project root. " +
    "If deploying, check your hosting provider's environment variable settings. " +
    "After adding/updating .env.local, restart your development server."
  );
}

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
