
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions
// TODO: Add SDKs for Firebase products that you want to use
import { UserProfile } from '@/types'; // Assuming you have a UserProfile type defined
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

// **ADD THIS FUNCTION**
async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) {
    console.warn("fetchUserProfile called with null or empty userId");
    return null;
  }
  try {
    // Assuming your user profiles are in a collection named 'users'
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Cast the data to your UserProfile type
      return userDoc.data() as UserProfile;
    } else {
      console.warn(`No user profile found in Firestore for ID: ${userId}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    throw error; // Re-throw the error to be caught by the calling code
  }
}
// **END OF FUNCTION TO ADD**

export { app, auth, db, storage, fetchUserProfile }; // Export the new function
