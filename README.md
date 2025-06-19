# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## API Key Security Reminder

If you received a warning about an unrestricted API key, ensure you have followed these steps in the Google Cloud Console for your Firebase project's API key (typically named "Browser key (auto created by Firebase)" or similar):

1.  **Application restrictions**:
    *   Select "Websites".
    *   Add your development URLs (e.g., `localhost:9003`) and your deployed Firebase Hosting URLs (e.g., `your-project-id.web.app`, `your-project-id.firebaseapp.com`).

2.  **API restrictions**:
    *   Select "Restrict key".
    *   Choose only the necessary APIs for your client-side application. Typically these include:
        *   Identity Toolkit API (for Firebase Authentication)
        *   Cloud Firestore API (for Firestore)
        *   Cloud Storage for Firebase API (for Firebase Storage)
        *   Firebase Installations API
        *   Token Service API
    *   Deselect any other APIs not directly used by your client application.

3.  **Save** the changes in the Google Cloud Console.
