
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Troubleshooting: `auth/requests-from-referer-...-are-blocked` Error in Firebase Studio

This is a common error when developing with Firebase Studio due to its dynamic URLs. Here's a comprehensive checklist:

1.  **Identify the EXACT URL from the Error Message:**
    *   When the error appears (e.g., `Firebase: Error (auth/requests-from-referer-https://<YOUR_DYNAMIC_URL>-are-blocked.)`), **immediately copy the `<YOUR_DYNAMIC_URL>` part.**
    *   For example, if the error is `auth/requests-from-referer-https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev-are-blocked`, the URL you need to work with is `6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`.
    *   **Firebase Studio URLs can change** if you close and reopen Studio, or if your session refreshes. If the error reappears with a *new* URL, you **must** add that new URL.

2.  **Add to Firebase Authentication Authorized Domains (Most Crucial Step):**
    *   Go to the **Firebase Console** ([console.firebase.google.com](https://console.firebase.google.com/)).
    *   Select your project (e.g., `pollitgo`).
    *   Navigate to **Authentication** (in the "Build" section of the left sidebar).
    *   Click the **Settings** tab.
    *   Find the **Authorized domains** section.
    *   Click **"Add domain"**.
    *   Carefully enter **ONLY the domain part** from the URL you copied (without `https://`).
        *   Example: `6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Click **"Add"**.
    *   Ensure `localhost` is also listed here for local `npm run dev` testing.

3.  **Add to Google Cloud API Key Restrictions (Recommended):**
    *   Go to the **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com/)).
    *   Select your project.
    *   Navigate to **APIs & Services > Credentials**.
    *   Find your API key (typically named "Browser key (auto created by Firebase)" or similar). Click on its name.
    *   Under **Application restrictions**, select **"Websites"**.
    *   Under **Website restrictions**, click **"ADD"**.
    *   Enter the **full URL including `https://`**.
        *   Example: `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Also add other necessary URLs like `http://localhost:9003`, your Firebase Hosting URLs (`pollitgo.web.app`, `pollitgo.firebaseapp.com`), and any custom domains.
    *   Click **"Save"**.

4.  **Add to Google Cloud OAuth 2.0 Client ID (If using Google Sign-In or other OAuth providers):**
    *   In the **Google Cloud Console**, go to **APIs & Services > Credentials**.
    *   Click on your **OAuth 2.0 Client ID** for Web application.
    *   Under **Authorized JavaScript origins**, click **"ADD URI"**.
    *   Enter the **full URL including `https://`**.
        *   Example: `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Also add `http://localhost:9003` and other production origins.
    *   Under **Authorized redirect URIs**, ensure your primary Firebase redirect URI is present: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler` (e.g., `https://pollitgo.firebaseapp.com/__/auth/handler`).
    *   Click **"Save"**.

5.  **WAIT FOR PROPAGATION (VERY IMPORTANT):**
    *   After making changes in the Firebase or Google Cloud consoles, it can take **5 to 15 minutes (sometimes longer)** for these settings to fully propagate across all of Google's servers.
    *   **Be patient and wait at least 10-15 minutes** before re-testing your application. Testing too soon will likely show the same error.

6.  **Hard Refresh & Clear Cache:**
    *   After the waiting period, perform a **hard refresh** of your application page in the browser (e.g., `Ctrl+Shift+R` or `Cmd+Shift+R`).
    *   Consider clearing your browser's cache for the site or testing in an **Incognito/Private window** to ensure you're not dealing with cached responses or configurations.

7.  **Double-Check the Correct Project:**
    *   Ensure you are making these changes in the Firebase and Google Cloud project settings that are **actually linked** to the `firebaseConfig` in your `src/lib/firebase.ts` file.

By meticulously following these steps, especially paying attention to the exact URL from the error and the propagation delay, you should be able to resolve this error.

## API Key Security Reminder

If you received a warning about an unrestricted API key, ensure you have followed these steps in the Google Cloud Console for your Firebase project's API key (typically named "Browser key (auto created by Firebase)" or similar):

1.  **Application restrictions**:
    *   Select "Websites".
    *   Under **Website restrictions**:
        *   Click "ADD" for each website URL you need to authorize.
        *   Add your development URLs:
            *   `localhost:9003`
            *   `http://localhost:9003` (explicitly, if `localhost:9003` alone doesn't cover it for your testing)
            *   **Your Firebase Studio development URL:** This will be something like `https://<port>-<your-studio-instance-details>.cloudworkstations.dev`. For example, if your app shows an error like `auth/requests-from-referer-https://6000-firebase-studio-INSTANCE-ID.cloudworkstations.dev-are-blocked`, then the URL to add here is `https://6000-firebase-studio-INSTANCE-ID.cloudworkstations.dev`.
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
        *   **Your Firebase Studio development URL:** (e.g., if your error shows `...referer-https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev-are-blocked`, add `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev` here).
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
    *   **Your Firebase Studio development URL (CRUCIAL FOR THIS ERROR):**
        *   If you see an error like `auth/requests-from-referer-https://YOUR-STUDIO-URL.cloudworkstations.dev-are-blocked`, you **MUST** add `YOUR-STUDIO-URL.cloudworkstations.dev` to this list.
        *   For example, if the error referer is `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`, you would add:
            **`6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`**
        *   Note: For this specific Firebase "Authorized domains" setting, you typically add just the domain part, without the `https://` prefix. The Firebase Console will usually guide you if it needs the scheme or not, or it might strip it automatically.
        *   **This is the most common fix for `auth/requests-from-referer-...-blocked` errors when using Firebase Studio.**
    *   Firebase uses this list to correctly manage the authentication flow and often populates the necessary Google Cloud OAuth client settings based on these domains.

By correctly configuring these settings, you ensure that your API key is not misused and that authentication flows (like Google Sign-In) work correctly and securely from all your intended environments (local, Firebase default domains, Firebase Studio, and your custom domain).

## Stripe Firebase Extension Configuration Notes

When configuring the "Run Payments with Stripe" Firebase Extension:

*   **Cloud Functions deployment location:** Choose a region close to your users/database (e.g., `us-central1`). Cannot be changed later.
*   **Products and pricing plans collection:** Default `products` is usually fine if you intend to sync predefined products from Stripe. If mainly using dynamic pricing (like for tips), this sync is less critical.
*   **Customer details and subscriptions collection:** Default `customers` is usually fine. This is where Stripe customer IDs and subscription data linked to your Firebase users will be stored.
*   **Sync new users to Stripe customers and Cloud Firestore:** Recommended: **Sync new users to Stripe and Firestore**. This automatically creates Stripe customer objects for new Firebase Auth users.
*   **Automatically delete Stripe customer objects:** Recommended: **Do not delete**. Retain Stripe data for history and reporting.
*   **Stripe API key with restricted access:**
    1.  In your Stripe Dashboard (Developers > API keys), create a **new restricted API key**. Name it (e.g., "Firebase PollitGo Extension") and grant it only the permissions required by the extension (refer to the official Stripe Firebase extension documentation for the exact list of permissions).
    2.  Copy the generated restricted key (e.g., `rk_test_...`).
    3.  Back in the Firebase Extension configuration UI, for the "Stripe API key with restricted access" field:
        *   **If the UI is direct (one input field before "Create secret" button):** Clear any existing content. Paste your `rk_test_...` key directly into this input field. Then, click the **"Create secret"** button next to it. The field should then update to show a *name* for the secret (this name might be auto-generated). Note this name.
        *   **If the UI shows a pop-up after clicking "Create secret":** In the pop-up, provide a "Secret name" (e.g., `STRIPE_POLLITGO_EXTENSION_API_KEY`) and paste your `rk_test_...` key into the "Secret value" field. Create the secret. Then, back on the extension page, select this newly created secret name from the dropdown.
    4.  **Verification (Important):** After starting the extension install/update, go to Google Cloud Console -> Security -> Secret Manager. Find the secret by the name that the extension configuration is now referencing. View its latest version and **confirm the stored value is your correct `rk_test_...` Stripe API key.** If it's incorrect, add a new version to that secret with the correct key value.
*   **Events to listen for (during extension configuration):**
    *   **Essential for payments/pledges/tips:** `checkout.session.completed`
    *   **Recommended for customer sync:** `customer.created`, `customer.updated`
    *   **Optional (if managing predefined products/prices in Stripe that your app uses):** `product.created`, `product.updated`, `product.deleted`, `price.created`, `price.updated`, `price.deleted`. If your tips/pledges are always dynamically priced, these product/price sync events are less critical for payment processing by the extension.
*   **Stripe webhook secret:** This secret is used by the *extension's own webhook endpoint* to verify events from Stripe.
    1.  **Install/Update the Extension First:** You typically complete the initial installation or update of the extension.
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
1.  **Set Environment Variables:** Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are correctly set with your **actual key values** in `.env.local`.
2.  **Restart your Next.js development server if you just added/modified `.env.local` (`npm run dev`).**
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
    *   Verify authorized domains in Firebase Authentication settings and API key/OAuth configurations in Google Cloud Console (see the "Troubleshooting: `auth/requests-from-referer-...-are-blocked`" section above).
