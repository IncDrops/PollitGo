
// src/lib/firebase.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
// Import other services only if they will be initialized and used
// import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage'; // Assuming storage might be used

// Explicitly fetch all required environment variables for Firebase
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
// measurementId is optional for core functionality
// const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

const allRequiredFirebaseKeysPresent =
  apiKey &&
  authDomain &&
  projectId &&
  // storageBucket, // storageBucket is now handled conditionally below for initialization
  messagingSenderId &&
  appId;

let app: FirebaseApp | null = null;
// let auth: Auth | null = null;
let storage: FirebaseStorage | null = null; // Only declare if storage is intended to be used
// let db: Firestore | null = null;

// Check if all required keys are present. This check can run on server or client.
if (!allRequiredFirebaseKeysPresent) {
  console.error(
    'CRITICAL FIREBASE CONFIG ERROR (Pre-check): Core Firebase initialization MAY BE SKIPPED or fail. ' +
    'One or more essential NEXT_PUBLIC_FIREBASE_ environment variables are missing or undefined. ' +
    'This check runs before attempting client-side initialization. ' +
    'Ensure these are set for client-side Firebase: ' +
    `API_KEY (is ${apiKey ? 'set' : 'MISSING'}), ` +
    `AUTH_DOMAIN (is ${authDomain ? 'set' : 'MISSING'}), ` +
    `PROJECT_ID (is ${projectId ? 'set' : 'MISSING'}), ` +
    // `STORAGE_BUCKET (is ${storageBucket ? 'set' : 'MISSING'}), ` + // No longer listed as essential for core init
    `MESSAGING_SENDER_ID (is ${messagingSenderId ? 'set' : 'MISSING'}), ` +
    `APP_ID (is ${appId ? 'set' : 'MISSING'}). ` +
    'These are critical if Firebase services are used. ' +
    'Check .env.local and Google Cloud Build trigger "Substitution variables".'
  );
}

// Initialize Firebase only on the client-side and if essential config is present
if (typeof window !== 'undefined' && allRequiredFirebaseKeysPresent) {
  if (!getApps().length) {
    const firebaseConfig: { [key: string]: string | undefined } = { // Define type for firebaseConfig
      apiKey,
      authDomain,
      projectId,
      messagingSenderId,
      appId,
      // measurementId: measurementId || undefined, // Optional
    };
    // Only add storageBucket to config if it's present
    if (storageBucket) {
      firebaseConfig.storageBucket = storageBucket;
    }

    try {
      app = initializeApp(firebaseConfig);
      // auth = getAuth(app); // Initialize only if auth features are used
      // db = getFirestore(app); // Initialize only if firestore features are used
      if (storageBucket) { // Conditionally initialize storage only if bucket is configured
          storage = getStorage(app);
      }
      console.log('Firebase SDK initialized (or attempted) on the client.');
    } catch (error) {
      console.error('Firebase client-side initialization error:', error);
      // app, auth, db, storage will remain null if client-side init fails
    }
  } else { // App already initialized, just get the instance
    app = getApp();
    // auth = getAuth(app);
    // db = getFirestore(app);
    if (storageBucket && !storage) { // Ensure storage is re-assigned if app was already init & bucket configured
        try {
            storage = getStorage(app);
        } catch (error) {
            console.error('Error getting storage instance from existing app:', error);
        }
    }
  }
} else if (typeof window !== 'undefined' && !allRequiredFirebaseKeysPresent) {
    console.error("Firebase SDK NOT initialized on client due to missing core configuration variables.");
}

// Export only what's intended to be used and initialized.
// If you only use storage, only export storage (and app).
export { app, storage };
// If using auth and db too, uncomment and export them:
// export { app, auth, db, storage };


// Example function (not actively used unless you implement it)
export const fetchUserProfile = async (userId: string) => {
  // if (!db) { // If using firestore
  //   console.warn("fetchUserProfile: Firestore is not initialized or Firebase config is missing.");
  //   return null;
  // }
  console.warn("fetchUserProfile: Functionality not fully implemented. Needs backend integration.");
  return null;
};

