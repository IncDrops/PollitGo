
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## API Key Security Reminder

If you received a warning about an unrestricted API key, ensure you have followed these steps in the Google Cloud Console for your Firebase project's API key (typically named "Browser key (auto created by Firebase)" or similar):

1.  **Application restrictions**:
    *   Select "Websites".
    *   Click "ADD" for each website URL.
    *   Add your development URLs (e.g., `localhost:9003`, `http://localhost:9003`).
    *   Add your deployed Firebase Hosting URLs (e.g., `your-project-id.web.app`, `your-project-id.firebaseapp.com`). For this project: `pollitgo.web.app`, `pollitgo.firebaseapp.com`.
    *   Add your custom domain if you have one (e.g., `pollitago.com`, `www.pollitago.com`). Ensure you include `https://` for live domains, e.g., `https://pollitago.com`.

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
        *   Add your custom domain if it's hosted **externally** (e.g., on Vercel, Netlify): `https://pollitago.com` (and `https://www.pollitago.com` if applicable).
    *   **Authorized redirect URIs:** This is where Google will send the user back *after* they have successfully authenticated with Google.
        *   For Firebase Authentication, the primary redirect URI is: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler` (e.g., `https://pollitgo.firebaseapp.com/__/auth/handler`). This URL is used by Firebase to handle the token exchange and complete the sign-in process, *even if your main application is hosted on a custom domain elsewhere*.

2.  **Firebase Console (Authentication -> Settings -> Authorized domains):**
    *   Ensure your custom domain (e.g., `pollitago.com`) is listed here. This is crucial for Firebase to recognize authentication requests originating from your custom domain, regardless of where it's hosted.
    *   Also, ensure `localhost` is listed for development.
    *   Firebase uses this list to correctly manage the authentication flow and often populates the necessary Google Cloud OAuth client settings based on these domains.

By correctly configuring these settings, you ensure that your API key is not misused and that authentication flows (like Google Sign-In) work correctly and securely from all your intended environments (local, Firebase hosting, and your custom domain).

## Stripe Firebase Extension Configuration Notes

When configuring the "Run Payments with Stripe" Firebase Extension:

*   **Cloud Functions deployment location:** Choose a region close to your users/database (e.g., `us-central1`). Cannot be changed later.
*   **Products and pricing plans collection:** Default `products` is usually fine.
*   **Customer details and subscriptions collection:** Default `customers` is usually fine. This is where Stripe customer IDs and subscription data linked to your Firebase users will be stored.
*   **Sync new users to Stripe customers and Cloud Firestore:** Recommended: **Sync**. This automatically creates Stripe customer objects for new Firebase Auth users.
*   **Automatically delete Stripe customer objects:** Recommended: **Do not delete**. Retain Stripe data for history and reporting.
*   **Stripe API key with restricted access:** 
    1.  In your Stripe Dashboard (Developers > API keys), create a **new restricted API key**.
    2.  Grant it only the permissions required by the extension (refer to extension documentation).
    3.  In the Firebase Extension configuration, for the "Stripe API key" field, click the **"Create secret"** button.
    4.  In the "Create secret" dialog:
        *   **Secret name:** Give it a memorable name (e.g., `STRIPE_EXTENSION_RESTRICTED_KEY`).
        *   **Secret value:** Paste the restricted API key (`rk_test_...` or `rk_live_...`) from Stripe.
    5.  Click "Create secret".
    6.  Back in the extension configuration, select the newly created secret name from the dropdown list.
*   **Stripe webhook secret:** 
    1.  After the initial installation of the extension, go to its configuration page in the Firebase Console. It will provide a **Webhook URL**.
    2.  In your Stripe dashboard (Developers > Webhooks), click "Add endpoint".
    3.  Paste the Webhook URL from Firebase.
    4.  Select the events the extension should listen for (see "Events to listen for" below or extension documentation).
    5.  Stripe will then provide a **Signing secret** (`whsec_...`) for this endpoint.
    6.  Go back to the Firebase Console and **reconfigure** the Stripe extension.
    7.  For the "Stripe webhook secret" field, click **"Create secret"**.
    8.  In the "Create secret" dialog:
        *   **Secret name:** (e.g., `STRIPE_EXTENSION_WEBHOOK_SECRET`).
        *   **Secret value:** Paste the signing secret (`whsec_...`) from Stripe.
    9.  Click "Create secret".
    10. Select the newly created secret name from the dropdown.
*   **Events to listen for (during extension configuration):**
    *   **Essential for payments:** `checkout.session.completed`
    *   **Recommended for customer sync:** `customer.created`, `customer.updated`
    *   **Optional (if managing products/prices in Stripe that your app uses):** `product.created`, `product.updated`, `product.deleted`, `price.created`, `price.updated`, `price.deleted`

This ensures your Stripe keys are handled securely via Google Cloud Secret Manager.

