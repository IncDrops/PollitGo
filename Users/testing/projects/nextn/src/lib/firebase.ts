
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Uncomment if you need Analytics

// Explicitly fetch all required environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID; // Optional

const allRequiredFirebaseKeysPresent =
  apiKey &&
  authDomain &&
  projectId &&
  storageBucket &&
  messagingSenderId &&
  appId;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
// let analytics: Analytics | null = null; // Uncomment if you need Analytics

if (typeof window !== 'undefined') {
  if (!getApps().length) {
    if (allRequiredFirebaseKeysPresent) {
      const firebaseConfig = {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        measurementId: measurementId || undefined, // Ensure measurementId is explicitly undefined if not present
      };
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
        // app, auth, db, storage remain null
      }
    } else {
      console.error(
        'CRITICAL FIREBASE INIT ERROR: Firebase initialization skipped. ' +
        'One or more NEXT_PUBLIC_FIREBASE_ environment variables are missing or undefined. ' +
        'Please ensure the following are set in your environment for client-side Firebase to work: ' +
        `NEXT_PUBLIC_FIREBASE_API_KEY (is ${apiKey ? 'set' : 'MISSING'}), ` +
        `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN (is ${authDomain ? 'set' : 'MISSING'}), ` +
        `NEXT_PUBLIC_FIREBASE_PROJECT_ID (is ${projectId ? 'set' : 'MISSING'}), ` +
        `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET (is ${storageBucket ? 'set' : 'MISSING'}), ` +
        `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID (is ${messagingSenderId ? 'set' : 'MISSING'}), ` +
        `NEXT_PUBLIC_FIREBASE_APP_ID (is ${appId ? 'set' : 'MISSING'}). ` +
        'These are critical for Firebase services like Storage if you are using them. ' +
        'Check your .env.local file (for local development) AND your Google Cloud Build trigger "Substitution variables" (for deployed prototypes, prefixed with _ e.g., _NEXT_PUBLIC_FIREBASE_API_KEY).'
      );
      // app, auth, db, storage remain null
    }
  } else if (getApps().length > 0) { // Already initialized
    app = getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    // if (measurementId) { // Uncomment if you need Analytics
    //   analytics = getAnalytics(app);
    // }
  }
  // On the server, or if keys are missing and window is defined but init failed, app/auth/db/storage will be null.
}


export { app, auth, db, storage /*, analytics */ }; // Uncomment analytics if used

// Example function (not actively used unless you implement it)
export const fetchUserProfile = async (userId: string) => {
  if (!db) {
    console.warn("fetchUserProfile: Firestore is not initialized or Firebase config is missing.");
    return null;
  }
  console.warn("fetchUserProfile: Functionality not fully implemented. Needs Firestore data structure.");
  return null;
};
