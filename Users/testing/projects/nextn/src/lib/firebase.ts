
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Uncomment if you need Analytics

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
// let analytics: Analytics; // Uncomment if you need Analytics

if (typeof window !== 'undefined' && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // if (firebaseConfig.measurementId) { // Uncomment if you need Analytics
    //   analytics = getAnalytics(app);
    // }
    console.log('Firebase initialized successfully.');
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Fallback to mock or null objects if initialization fails
    // This helps prevent the app from crashing if Firebase config is missing
    // but it's better to ensure config is always present.
    app = null as any; 
    auth = null as any;
    db = null as any;
    storage = null as any;
    // analytics = null as any;
  }
} else if (typeof window !== 'undefined' && getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  // if (firebaseConfig.measurementId) { // Uncomment if you need Analytics
  //   analytics = getAnalytics(app);
  // }
} else {
  // Handle server-side or non-browser environments if necessary,
  // though client-side initialization is most common for direct SDK use.
  // For now, initializing to null to avoid errors during SSR if not careful.
  app = null as any;
  auth = null as any;
  db = null as any;
  storage = null as any;
  // analytics = null as any;
}

export { app, auth, db, storage /*, analytics */ }; // Uncomment analytics if used

// Example function to fetch user profile (if you were using Firestore for profiles)
// This is just an example and is not actively used unless you implement it.
export const fetchUserProfile = async (userId: string) => {
  if (!db) {
    console.warn("fetchUserProfile: Firestore is not initialized.");
    return null;
  }
  // This is a placeholder. You'd need to define your Firestore structure.
  // const userDocRef = doc(db, "users", userId);
  // const userDoc = await getDoc(userDocRef);
  // if (userDoc.exists()) {
  //   return userDoc.data();
  // } else {
  //   console.log("No such user profile!");
  //   return null;
  // }
  console.warn("fetchUserProfile: Functionality not fully implemented. Needs Firestore data structure.");
  return null;
};

// Important: Ensure all NEXT_PUBLIC_FIREBASE_... environment variables are set
// in your .env.local file for local development and in your deployment environment (e.g., Vercel, Google Cloud Build).
// Missing variables will cause Firebase initialization to fail.
if (typeof window !== 'undefined') {
  if (!firebaseConfig.apiKey) console.error("Firebase Error: NEXT_PUBLIC_FIREBASE_API_KEY is not set.");
  if (!firebaseConfig.projectId) console.error("Firebase Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set.");
  if (!firebaseConfig.storageBucket) console.error("Firebase Error: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is not set.");
}
