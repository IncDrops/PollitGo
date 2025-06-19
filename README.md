
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.


## API Key Security Reminder

If you received a warning about an unrestricted API key, ensure you have followed these steps in the Google Cloud Console for your Firebase project's API key (typically named "Browser key (auto created by Firebase)" or similar):

1.  **Application restrictions**:
    *   Select "Websites".
    *   Under **Website restrictions**:
        *   Click "ADD" for each website URL you need to authorize.
        *   Add your development URLs:
            *   `localhost:9003`
            *   `http://localhost:9003` (explicitly, if `localhost:9003` alone doesn't cover it for your testing)
        *   Add your deployed Firebase Hosting URLs:
            *   `pollitgo.web.app`
            *   `pollitgo.firebaseapp.com`
        *   Add your custom domain:
            *   `pollitago.com` (if users access your site directly via this, e.g., `https://pollitago.com`)
            *   `www.pollitago.com` (if you also use the `www` subdomain, e.g., `https://www.pollitago.com`)
        *   Click "Done" after entering each URL.
    *   Ensure all necessary domains are listed before proceeding.

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
    *   **Authorized JavaScript origins:** These are the domains from which your web application is allowed to initiate an OAuth 2.0 flow with Google. Add:
        *   `http://localhost:9003` (for local development)
        *   `https://pollitgo.web.app`
        *   `https://pollitgo.firebaseapp.com`
        *   `https://pollitago.com` (your custom domain)
        *   `https://www.pollitago.com` (if applicable)
    *   **Authorized redirect URIs:** This is where Google will send the user back *after* they have successfully authenticated with Google.
        *   For Firebase Authentication, the primary redirect URI is: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler`. For this project: `https://pollitgo.firebaseapp.com/__/auth/handler`.
        *   **This `firebaseapp.com` redirect URI is used by Firebase to handle the token exchange, even if your main application is hosted on a custom domain (`pollitago.com`) that is *not* on Firebase Hosting.**

2.  **Firebase Console (Authentication -> Settings -> Authorized domains):**
    *   Ensure your custom domain (e.g., `pollitago.com`) is listed here. This is crucial for Firebase to recognize authentication requests originating from your custom domain, regardless of where it's hosted.
    *   Also, ensure `localhost` is listed for development.
    *   Firebase uses this list to correctly manage the authentication flow and often populates the necessary Google Cloud OAuth client settings based on these domains.

By correctly configuring these settings, you ensure that your API key is not misused and that authentication flows (like Google Sign-In) work correctly and securely from all your intended environments (local, Firebase default domains, and your custom domain).

## Stripe Firebase Extension Configuration Notes

When configuring the "Run Payments with Stripe" Firebase Extension:

*   **Cloud Functions deployment location:** Choose a region close to your users/database (e.g., `us-central1`). Cannot be changed later.
*   **Products and pricing plans collection:** Default `products` is usually fine.
*   **Customer details and subscriptions collection:** Default `customers` is usually fine. This is where Stripe customer IDs and subscription data linked to your Firebase users will be stored.
*   **Sync new users to Stripe customers and Cloud Firestore:** Recommended: **Sync new users to Stripe and Firestore**. This automatically creates Stripe customer objects for new Firebase Auth users.
*   **Automatically delete Stripe customer objects:** Recommended: **Do not delete**. Retain Stripe data for history and reporting.
*   **Stripe API key with restricted access:**
    1.  In your Stripe Dashboard (Developers > API keys), create a **new restricted API key**. Name it (e.g., "Firebase PollitGo Extension") and grant it only the permissions required by the extension (refer to the official Stripe Firebase extension documentation for the exact list of permissions).
    2.  Copy the generated restricted key (e.g., `rk_test_...`).
    3.  Back in the Firebase Extension configuration UI, for the "Stripe API key with restricted access" field:
        *   **If the UI is direct (one input field before "Create secret" button):** Clear any existing content. Paste your `rk_test_...` key directly into this field. Then, click the **"Create secret"** button next to it. The field should then update to show a *name* for the secret (this name might be auto-generated or one you typed if the UI was sticky). Note this name.
        *   **If the UI shows a pop-up after clicking "Create secret":** In the pop-up, provide a "Secret name" (e.g., `STRIPE_EXTENSION_API_KEY`) and paste your `rk_test_...` key into the "Secret value" field. Create the secret. Then, back on the extension page, select this newly created secret name from the dropdown.
    4.  **Verification (Important):** After starting the extension install/update, go to Google Cloud Console -> Security -> Secret Manager. Find the secret by the name that the extension configuration is now referencing. View its latest version and **confirm the stored value is your correct `rk_test_...` Stripe API key.** If it's incorrect, add a new version to that secret with the correct key value.
*   **Events to listen for (during extension configuration):**
    *   **Essential for payments/pledges/tips:** `checkout.session.completed`
    *   **Recommended for customer sync:** `customer.created`, `customer.updated`
    *   **Optional (if managing predefined products/prices in Stripe that your app uses):** `product.created`, `product.updated`, `product.deleted`, `price.created`, `price.updated`, `price.deleted`. If your tips/pledges are always dynamically priced, these product/price sync events are less critical for payment processing by the extension.
*   **Stripe webhook secret:** This secret is used by the *extension's own webhook endpoint* to verify events from Stripe.
    1.  **Install/Update the Extension First:** You typically complete the initial installation or update of the extension. Some parts of the webhook setup might require the extension to be at least partially installed to provide its URL.
    2.  **Get the Extension's Webhook URL:**
        *   After the extension is installed/updated, go to its configuration page in the Firebase Console (Firebase Console > Extensions > Manage your Stripe extension).
        *   The extension will display its unique **Webhook URL** (e.g., `https://<region>-<project-id>.cloudfunctions.net/ext-stripe-payments-events`). Copy this URL.
    3.  **Create Endpoint in Stripe:**
        *   In your Stripe Dashboard (Developers > Webhooks), click **"+ Add endpoint"**.
        *   **Endpoint URL field:** Paste the Webhook URL you copied from the Firebase extension details page here.
        *   **Description (Optional):** Add a description like "PollitGo Firebase Extension".
        *   **Listen to events:** Click "Select events" and choose the events the extension is configured to handle (e.g., `checkout.session.completed`, `customer.created`, `customer.updated`). You chose these during the extension's event configuration step.
        *   Click "Add endpoint".
    4.  **Get the Signing Secret from Stripe:**
        *   After adding the endpoint, Stripe will display its details. Find and copy the **"Signing secret"** (starts with `whsec_...`). Click to reveal it if needed.
    5.  **Reconfigure the Extension in Firebase:**
        *   Go back to the Firebase Console and **reconfigure** the Stripe extension.
        *   For the "Stripe webhook secret" field, click the **"Create secret"** button.
        *   In the pop-up:
            *   **Secret name:** Give it a descriptive name (e.g., `STRIPE_EXTENSION_WEBHOOK_SECRET`).
            *   **Secret value:** Paste the `whsec_...` signing secret you copied from Stripe.
            *   Click "Create secret".
        *   Select this newly created secret name from the dropdown.
        *   Save/Update the extension configuration.

This ensures your Stripe keys are handled securely via Google Cloud Secret Manager.
The Stripe extension will deploy its own Cloud Functions for its operations.
The `functions/src/index.ts` file in your project is for any *custom* webhook handler you might implement for logic *not* covered by the extension (e.g., awarding PollitPoints, sending custom emails). If you create a custom webhook handler, it will need its own separate endpoint in Stripe and its own webhook signing secret configured via Firebase Functions environment configuration (e.g., `firebase functions:config:set stripe.webhook_secret="whsec_YOUR_CUSTOM_SECRET"`).

    
