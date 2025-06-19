
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## API Key Security Reminder

If you received a warning about an unrestricted API key, ensure you have followed these steps in the Google Cloud Console for your Firebase project's API key (typically named "Browser key (auto created by Firebase)" or similar):

1.  **Application restrictions**:
    *   Select "Websites".
    *   Click "ADD" for each website URL.
    *   Add your development URLs (e.g., `localhost:9003`, `http://localhost:9003`).
    *   Add your deployed Firebase Hosting URLs (e.g., `your-project-id.web.app`, `your-project-id.firebaseapp.com`).
    *   Add your custom domain if you have one (e.g., `yourcustomdomain.com`, `www.yourcustomdomain.com`). Ensure you include `https://` for live domains, e.g., `https://yourcustomdomain.com`.

2.  **API restrictions**:
    *   Select "Restrict key".
    *   Click the dropdown or "Select APIs" button.
    *   Choose only the necessary APIs for your client-side application. Typically these include:
        *   Identity Toolkit API (for Firebase Authentication)
        *   Cloud Firestore API (for Firestore client-side access)
        *   Cloud Storage for Firebase API (or Firebase Storage API, for Firebase Storage client-side access)
        *   Firebase Installations API
        *   Token Service API
    *   Deselect any other APIs not directly used by your client application to follow the principle of least privilege.

3.  **Save** the changes in the Google Cloud Console. It might take a few minutes for restrictions to propagate.

## OAuth 2.0 Client ID Configuration (for Google Sign-In etc.)

If using OAuth 2.0 providers like Google Sign-In with Firebase Authentication:

1.  **Google Cloud Console (Credentials -> OAuth 2.0 Client IDs -> Your Client ID for Web application):**
    *   **Authorized JavaScript origins:** These are the domains from which your web application is allowed to initiate an OAuth 2.0 flow with Google.
        *   Add your development URL: `http://localhost:9003`
        *   Add your deployed Firebase Hosting default URLs: `https://YOUR_PROJECT_ID.web.app`, `https://YOUR_PROJECT_ID.firebaseapp.com` (replace `YOUR_PROJECT_ID` with `pollitgo`).
        *   Add your custom domain (even if hosted externally): `https://yourcustomdomain.com` (e.g., `https://pollitago.com`) and `https://www.yourcustomdomain.com` if applicable.
    *   **Authorized redirect URIs:** This is where Google will send the user back *after* they have successfully authenticated with Google.
        *   For Firebase Authentication, the primary redirect URI is: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler` (e.g., `https://pollitgo.firebaseapp.com/__/auth/handler`). This URL is used by Firebase to handle the token exchange and complete the sign-in process, even if your main application is hosted on a custom domain elsewhere.

2.  **Firebase Console (Authentication -> Settings -> Authorized domains):**
    *   Ensure your custom domain (e.g., `yourcustomdomain.com` or `pollitago.com`) is listed here. This is crucial for Firebase to recognize authentication requests originating from your custom domain, regardless of where it's hosted.
    *   Also, ensure `localhost` is listed for development.
    *   Firebase uses this list to correctly manage the authentication flow and often populates the necessary Google Cloud OAuth client settings based on these domains.

By correctly configuring these settings, you ensure that your API key is not misused and that authentication flows (like Google Sign-In) work correctly and securely from all your intended environments (local, Firebase hosting, and your custom domain).

