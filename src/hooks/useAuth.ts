
import { useEffect, useState } from 'react';
// Firebase User type is no longer imported as Firebase auth is removed.
// Define a minimal User type or use a more abstract one if integrating a new auth system.
interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  // Add other properties your app expects from a user object
}

const useAuth = () => {
  const [user, setUser] = useState<AppUser | null>(null); // Use AppUser or your new user type
  const [loading, setLoading] = useState(false); // Set to false as Firebase listener is gone

  useEffect(() => {
    // Firebase onAuthStateChanged listener is removed.
    // Authentication state would be managed by the new auth system.
    console.warn(
      "useAuth: Firebase Authentication has been removed. " +
      "This hook will always return a null user and loading as false. " +
      "Implement and integrate your new authentication system here."
    );
    setUser(null);
    setLoading(false);
  }, []);

  return {
    user,
    loading,
  };
};

export default useAuth;
