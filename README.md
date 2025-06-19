
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
            *   **Your Firebase Studio development URL:** This will be something like `https://<port>-<your-studio-instance-details>.cloudworkstations.dev` (e.g., `https://6000-firebase-studio-....cloudworkstations.dev`). You can usually find this in your browser's address bar when running your app in Firebase Studio.
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
        *   **Your Firebase Studio development URL:** (e.g., `https://6000-firebase-studio-....cloudworkstations.dev`)
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
    *   **Your Firebase Studio development URL:** Make sure to add your Firebase Studio development URL here (e.g., `6000-firebase-studio-....cloudworkstations.dev` -- note: for this specific Firebase setting, you typically add just the domain part, not the `https://` prefix, so `your-studio-domain.cloudworkstations.dev`). Firebase Console will usually guide you if it needs the scheme or not. **This is often the direct fix for `auth/requests-from-referer-...-blocked` errors.**
    *   Firebase uses this list to correctly manage the authentication flow and often populates the necessary Google Cloud OAuth client settings based on these domains.

By correctly configuring these settings, you ensure that your API key is not misused and that authentication flows (like Google Sign-In) work correctly and securely from all your intended environments (local, Firebase default domains, Firebase Studio, and your custom domain).

## Stripe Firebase Extension Configuration Notes

When configuring the "Run Payments with Stripe" Firebase Extension:

*   **Cloud Functions deployment location:** Choose a region close to your users/database (e.g., `us-central1`). Cannot be changed later.
*   **Products and pricing plans collection:** Default `products` is usually fine if you intend to sync predefined products from Stripe. If mainly using dynamic pricing (like for tips and pledges), this sync is less critical. You can leave the associated product/price sync events unchecked.
*   **Customer details and subscriptions collection:** Default `customers` is usually fine. This is where Stripe customer IDs and subscription data linked to your Firebase users will be stored.
*   **Sync new users to Stripe customers and Cloud Firestore:** Recommended: **Sync new users to Stripe and Firestore**. This automatically creates Stripe customer objects for new Firebase Auth users.
*   **Automatically delete Stripe customer objects:** Recommended: **Do not delete**. Retain Stripe data for history and reporting.
*   **Stripe API key with restricted access:**
    1.  In your Stripe Dashboard (Developers > API keys), create a **new restricted API key**. Name it (e.g., "Firebase PollitGo Extension") and grant it only the permissions required by the extension (refer to the official Stripe Firebase extension documentation for the exact list of permissions).
    2.  Copy the generated restricted key (e.g., `rk_test_...`).
    3.  Back in the Firebase Extension configuration UI, for the "Stripe API key with restricted access" field:
        *   **If the UI is direct (one input field before "Create secret" button):** Clear any existing content. Paste your `rk_test_...` key directly into this field. Then, click the **"Create secret"** button next to it. The field should then update to show a *name* for the secret (this name might be auto-generated). Note this name.
        *   **If the UI shows a pop-up after clicking "Create secret":** In the pop-up, provide a "Secret name" (e.g., `STRIPE_POLLITGO_EXTENSION_API_KEY`) and paste your `rk_test_...` key into the "Secret value" field. Create the secret. Then, back on the extension page, select this newly created secret name from the dropdown.
    4.  **Verification (Important):** After starting the extension install/update, go to Google Cloud Console -> Security -> Secret Manager. Find the secret by the name that the extension configuration is now referencing. View its latest version and **confirm the stored value is your correct `rk_test_...` Stripe API key.** If it's incorrect, add a new version to that secret with the correct key value.
*   **Events to listen for (during extension configuration):**
    *   **Essential for payments/pledges/tips:** `checkout.session.completed` (Under "Checkout") - **Ensure this is CHECKED.**
    *   **Recommended for customer sync:** `customer.created`, `customer.updated` (Under "Customer") - **Ensure these are CHECKED.**
    *   **Optional product/price sync events:** `product.created`, `product.updated`, `product.deleted`, `price.created`, `price.updated`, `price.deleted`. If your tips/pledges are always dynamically priced, these can be left **UNCHECKED**.
*   **Stripe webhook secret:** This secret is used by the *extension's own webhook endpoint* to verify events from Stripe.
    1.  **Install/Update the Extension First:** You typically complete the initial installation or update of the extension.
    2.  **Get the Extension's Webhook URL:**
        *   After the extension is installed/updated, go to its configuration page in the Firebase Console (Firebase Console > Extensions > Manage your Stripe extension).
        *   The extension will display its unique **Webhook URL** (e.g., `https://<region>-<project-id>.cloudfunctions.net/ext-stripe-payments-events`). Copy this URL.
    3.  **Create Endpoint in Stripe:**
        *   In your Stripe Dashboard (Developers > Webhooks), click **"+ Add endpoint"**.
        *   **Endpoint URL field:** Paste the Webhook URL you copied from the Firebase extension details page here.
        *   **Description (Optional):** Add a description like "PollitGo Firebase Extension".
        *   **Listen to events:** Click "Select events" and choose the events the extension is configured to handle (e.g., `checkout.session.completed`, `customer.created`, `customer.updated`).
        *   Click "Add endpoint".
    4.  **Get the Signing Secret from Stripe:**
        *   After adding the endpoint, Stripe will display its details. Find and copy the **"Signing secret"** (starts with `whsec_...`). Click to reveal it if needed.
    5.  **Reconfigure the Extension in Firebase:**
        *   Go back to the Firebase Console and **reconfigure** the Stripe extension.
        *   For the "Stripe webhook secret" field, click the **"Create secret"** button.
        *   In the pop-up:
            *   **Secret name:** Give it a descriptive name (e.g., `STRIPE_POLLITGO_EXTENSION_WEBHOOK_SECRET`).
            *   **Secret value:** Paste the `whsec_...` signing secret you copied from Stripe.
            *   Click "Create secret".
        *   Select this newly created secret name from the dropdown.
        *   Save/Update the extension configuration.

This ensures your Stripe keys are handled securely via Google Cloud Secret Manager.
The Stripe extension will deploy its own Cloud Functions for its operations.

## Stripe API Route Configuration (`/api/stripe/create-checkout-session`)

Your Next.js application includes an API route at `src/app/api/stripe/create-checkout-session/route.ts`. This route is responsible for creating Stripe Checkout Sessions when a user initiates a pledge or a tip.

*   **Environment Variable for Stripe Secret Key:** This API route requires your full Stripe **Secret Key** (e.g., `sk_test_...` or `sk_live_...`) to communicate with the Stripe API.
    *   Set this key as an environment variable in a `.env.local` file in your project root:
        ```
        # Open this .env.local file and replace the placeholder values below
        # with your ACTUAL Stripe keys from your Stripe Dashboard.
        #
        # Your Stripe SECRET Key (for server-side operations, starts with sk_test_... or sk_live_...)
        STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE
        #
        # Your Stripe PUBLISHABLE Key (for client-side Stripe.js, starts with pk_test_... or pk_live_...)
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_GOES_HERE
        ```
    *   **Crucially, you must replace the placeholder text (like `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE`) with your actual secret values obtained from your Stripe Dashboard.**
    *   The `STRIPE_SECRET_KEY` is used on the server-side by your API route.
    *   The `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is used on the client-side for Stripe.js.
    *   **Important Distinction:**
        *   The **`STRIPE_SECRET_KEY` (`sk_...`)** used by this Next.js API route is your **full Stripe Secret Key**. It's needed by *your application's backend code* to perform privileged operations like creating checkout sessions.
        *   The **Restricted API Key (`rk_...`)** configured for the Stripe Firebase Extension is *different*. It has limited permissions specifically for the extension's tasks (like syncing data and handling its own webhook events).
        *   It is correct and secure to use these two different keys for their respective purposes.
    *   Ensure `.env.local` is listed in your `.gitignore` file to prevent committing your secret keys.
    *   For deployed environments (like Firebase Hosting if you also deploy Next.js functions, or other hosting providers), you will need to set `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` as server-side environment variables through your hosting provider's settings.
    *   **After editing `.env.local` with your actual keys, restart your Next.js development server (e.g., stop `npm run dev` with Ctrl+C and run `npm run dev` again) for the changes to take effect.**

## Custom Webhook Handler (`functions/src/index.ts`)

The `functions/src/index.ts` file in your project is for any *custom* webhook handler you might implement for business logic *not* covered by the Stripe extension (e.g., awarding PollitPoints, sending custom emails after a payment).

*   If you use this custom handler, it will need its own separate endpoint configured in Stripe (different from the extension's webhook URL).
*   The signing secret for this custom handler should be configured via Firebase Functions environment configuration (e.g., `firebase functions:config:set stripe.webhook_secret="whsec_YOUR_CUSTOM_HANDLER_SECRET"`). The `stripe.secret_key` in the Functions config would be your main Stripe secret key.

## Deploying Firebase Configurations

*   **Firestore Rules & Indexes:**
    ```bash
    firebase deploy --only firestore
    ```
*   **Custom Cloud Functions (from `functions/src/index.ts`):**
    ```bash
    firebase deploy --only functions
    ```
    (Note: The Stripe Firebase Extension deploys its *own* functions automatically. This command is for *your* custom functions in the `functions` directory).

## Testing the Payment Flow
1.  **Set Environment Variables:** Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are correctly set with your **actual key values** in `.env.local` in your project root.
2.  **Restart Dev Server:** If your Next.js development server (`npm run dev`) was running, stop it (Ctrl+C in the terminal) and restart it (`npm run dev`) to load the new environment variables.
3.  **Initiate a Payment:**
    *   Open your app in the browser (e.g., `http://localhost:9003` or your Firebase Studio URL).
    *   Navigate to the "New Poll" page.
    *   Fill in the poll details and enter a pledge amount (e.g., `1.00` for $1.00).
    *   Click "Poll it & Go".
4.  **Stripe Checkout:** You should be redirected to Stripe's Checkout page.
    *   Use Stripe's test card numbers (e.g., `4242 4242 4242 4242`, future expiry, any 3-digit CVC).
    *   Complete the payment.
5.  **Verify Redirection:**
    *   On successful payment, you should be redirected to `/payment-success` in your app.
    *   If you cancel, you should be redirected to `/payment-cancelled`.
6.  **Check Stripe Dashboard:**
    *   Log in to your Stripe Dashboard (in Test Mode).
    *   Go to "Payments" to see the test transaction.
    *   Optionally, check "Customers" if customer sync is enabled for the extension.
7.  **Check Webhooks (Optional but Recommended):**
    *   In Stripe Dashboard, go to "Developers" > "Webhooks".
    *   Click on the endpoint URL for your Firebase Extension.
    *   Look for a `checkout.session.completed` event for your test payment. It should show a successful delivery (status 200).
8.  **Check Firebase Console (Optional for Debugging):**
    *   **Firestore:** If your extension updates Firestore (e.g., customer data, payment records), check the relevant collections.
    *   **Extension Logs:** Go to Firebase Console > Extensions > (Your Stripe Extension) > Logs to view logs from the extension's functions.
9.  **Troubleshooting:**
    *   Check your browser's developer console (F12) for client-side errors.
    *   Check your Next.js terminal (where `npm run dev` is running) for server-side API route errors.
    *   Double-check your `.env.local` keys and ensure the server was restarted.
    *   Verify authorized domains in Firebase Authentication settings and API key/OAuth configurations in Google Cloud Console.
    
```