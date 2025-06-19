
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables (.env.local)

This project uses environment variables for configuration, especially for sensitive keys. You need to create a `.env.local` file in the root of your project. This file is included in `.gitignore` and should never be committed to version control.

**Content for your `.env.local` file:**

```env
# Stripe Keys
# Replace with your ACTUAL Stripe Test Secret Key (starts with sk_test_...)
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE
# Replace with your ACTUAL Stripe Test Publishable Key (starts with pk_test_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_GOES_HERE

# NextAuth.js Variables
# This should be the base URL of your application during development.
# If your app runs on a different port, or if you are using Firebase Studio's
# dynamic URL for testing OAuth providers, update it accordingly.
NEXTAUTH_URL=http://localhost:9003
# Generate a strong secret for NextAuth.js.
# In your terminal, run: openssl rand -base64 32
# Copy the output and paste it here.
# Example: NEXTAUTH_SECRET=aVeryStrongAndRandomStringGeneratedByOpenSSL
NEXTAUTH_SECRET=REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE
```

**Important:**
1.  Replace the placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE` and `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`) with your **actual keys and generated secret**.
2.  To generate `NEXTAUTH_SECRET`, you can run `openssl rand -base64 32` in your terminal.
3.  **After creating or modifying `.env.local`, you MUST restart your Next.js development server** (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for the changes to take effect.

## Authentication with NextAuth.js

This application has been configured to use NextAuth.js for authentication.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** You can log in with `test@example.com` and password `password`.
    *   **Simulated Signup:** The current setup will also allow any new email/password combination to "sign up" and log in for demonstration purposes. This is because the `authorize` function in `src/app/api/auth/[...nextauth]/route.ts` is a placeholder.
*   **Database Integration Needed:** For a real application, you would need to:
    1.  Integrate a database (e.g., Supabase, PostgreSQL with Prisma, MongoDB).
    2.  Modify the `authorize` function in `src/app/api/auth/[...nextauth]/route.ts` to:
        *   Validate login credentials against your user database.
        *   Handle user registration by creating new user records in your database (likely via a separate API endpoint).

## Stripe Integration

This application uses Stripe for payments.

### Stripe Firebase Extension Configuration Notes (If previously used and migrating away from Firebase)
If you were previously using the Stripe Firebase Extension, note that removing Firebase means this extension will no longer function. You will need to implement your own backend logic to handle Stripe webhooks (e.g., using a Next.js API route) to process events like `checkout.session.completed` and update your database accordingly.

### Stripe API Route Configuration (`/api/stripe/create-checkout-session`)

Your Next.js application includes an API route at `src/app/api/stripe/create-checkout-session/route.ts`. This route is responsible for creating Stripe Checkout Sessions when a user initiates a pledge or a tip.

*   **Environment Variable for Stripe Secret Key:** This API route requires your full Stripe **Secret Key** (e.g., `sk_test_...` or `sk_live_...`) to communicate with the Stripe API.
    *   Ensure `STRIPE_SECRET_KEY` is set in your `.env.local` file as described above.
*   **Environment Variable for Stripe Publishable Key:** Your frontend uses `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (set in `.env.local`) for Stripe.js.
*   **Restart Dev Server:** After editing `.env.local` with your actual keys, restart your Next.js development server (`npm run dev`) for the changes to take effect.

## Testing the Payment Flow
1.  **Set Environment Variables:** Ensure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are correctly set with your **actual values** in `.env.local` in your project root.
2.  **Restart Dev Server:** If your Next.js development server (`npm run dev`) was running, stop it (Ctrl+C in the terminal) and restart it (`npm run dev`) to load the new environment variables.
3.  **Log In / Sign Up (Simulated):**
    *   Open your app in the browser (e.g., `http://localhost:9003`).
    *   Use the Login/Sign Up buttons. You can use `test@example.com` / `password` or create a new "user".
4.  **Initiate a Payment:**
    *   Navigate to the "New Poll" page.
    *   Fill in the poll details and enter a pledge amount (e.g., `1.00` for $1.00).
    *   Click "Poll it & Go".
5.  **Stripe Checkout:** You should be redirected to Stripe's Checkout page.
    *   Use Stripe's test card numbers (e.g., `4242 4242 4242 4242`, future expiry, any 3-digit CVC).
    *   Complete the payment.
6.  **Verify Redirection:**
    *   On successful payment, you should be redirected to `/payment-success` in your app.
    *   If you cancel, you should be redirected to `/payment-cancelled`.
7.  **Check Stripe Dashboard:**
    *   Log in to your Stripe Dashboard (in Test Mode).
    *   Go to "Payments" to see the test transaction.
8.  **Troubleshooting:**
    *   Check your browser's developer console (F12) for client-side errors.
    *   Check your Next.js terminal (where `npm run dev` is running) for server-side API route errors.
    *   Double-check your `.env.local` keys and ensure the server was restarted.

## Deprecated: Firebase Usage Notes
This project previously used Firebase for authentication and database. These services have been removed. The following sections are for historical reference or if you decide to re-integrate Firebase or a similar BaaS.

### Troubleshooting: `auth/requests-from-referer-...-are-blocked` Error in Firebase Studio (If re-integrating Firebase)

This is a common and frustrating error when developing with Firebase Studio due to its dynamic URLs. If you've followed the steps and are still seeing this, please meticulously re-check these points:

1.  **Identify the EXACT URL from the LATEST Error Message (CRUCIAL):**
    *   When the error appears (e.g., `Firebase: Error (auth/requests-from-referer-https://<YOUR_DYNAMIC_URL>-are-blocked.)`), **immediately copy the `<YOUR_DYNAMIC_URL>` part.**
    *   For example, if your latest error shows `auth/requests-from-referer-https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev-are-blocked`, the URL you absolutely need to work with *right now* is `6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`.
    *   **Firebase Studio URLs can change!** If you close and reopen Studio, or if your session refreshes, or even sometimes after a period of inactivity, you might get a new URL. If the error reappears with a *new* URL, you **must** go back to step 2 and add that new URL. The old one may no longer be valid for your current session.

2.  **Add/Verify in Firebase Authentication Authorized Domains (Most Crucial Step):**
    *   Go to the **Firebase Console** ([console.firebase.google.com](https://console.firebase.google.com/)).
    *   Select your project.
    *   Navigate to **Authentication** (in the "Build" section of the left sidebar).
    *   Click the **Settings** tab.
    *   Find the **Authorized domains** section.
    *   **Check the list:** Is the EXACT domain you copied in Step 1 (e.g., `6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`) already there?
    *   If not, click **"Add domain"**.
    *   Carefully enter **ONLY the domain part** from the URL you copied in Step 1 (without `https://`).
        *   Example: `6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Click **"Add"**.
    *   Ensure `localhost` is also listed here for local `npm run dev` testing.

3.  **WAIT FOR PROPAGATION (EXTREMELY IMPORTANT):**
    *   After making changes in the Firebase or Google Cloud consoles, it can take **5 to 15 minutes (sometimes longer)** for these settings to fully propagate across all of Google's servers.
    *   **DO NOT retest your application immediately.** Set a timer for at least 10-15 minutes. Testing too soon will likely show the same error and lead to frustration. Patience here is key.

4.  **Hard Refresh & Clear Cache (After Waiting):**
    *   After the waiting period (Step 3), perform a **hard refresh** of your application page in the browser (e.g., `Ctrl+Shift+R` or `Cmd+Shift+R`).
    *   Consider clearing your browser's cache for the site or testing in an **Incognito/Private window** to ensure you're not dealing with cached responses or configurations.

5.  **Add to Google Cloud API Key Restrictions (Recommended for Security):**
    *   Go to the **Google Cloud Console** ([console.cloud.google.com](https://console.cloud.google.com/)).
    *   Select your project.
    *   Navigate to **APIs & Services > Credentials**.
    *   Find your API key (typically named "Browser key (auto created by Firebase)" or similar). Click on its name.
    *   Under **Application restrictions**, select **"Websites"**.
    *   Under **Website restrictions**, click **"ADD"**.
    *   Enter the **full URL including `https://`** from Step 1.
        *   Example: `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Also add other necessary URLs like `http://localhost:9003` (if you run locally), your Firebase Hosting URLs (if applicable), and any custom domains.
    *   Click **"Save"**. Remember this also has a propagation delay (Step 3).

6.  **Add to Google Cloud OAuth 2.0 Client ID (If using Google Sign-In or other OAuth providers):**
    *   In the **Google Cloud Console**, go to **APIs & Services > Credentials**.
    *   Click on your **OAuth 2.0 Client ID** for Web application.
    *   Under **Authorized JavaScript origins**, click **"ADD URI"**.
    *   Enter the **full URL including `https://`** from Step 1.
        *   Example: `https://6000-firebase-studio-1750146504616.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev`
    *   Also add `http://localhost:9003` and other production origins.
    *   Under **Authorized redirect URIs**, ensure your primary Firebase redirect URI is present: `https://YOUR_PROJECT_ID.firebaseapp.com/__/auth/handler` (e.g., `https://your-project-id.firebaseapp.com/__/auth/handler`).
    *   Click **"Save"**. Remember this also has a propagation delay (Step 3).

7.  **Double-Check the Correct Project:**
    *   Ensure you are making these changes in the Firebase and Google Cloud project settings that are **actually linked** to the Firebase configuration your app would be using.

If you've gone through all these steps, paid close attention to the **exact current URL from the error**, **waited patiently for propagation**, and **hard refreshed**, and the error *still* persists with the *exact same URL*, then there might be a more unusual issue. However, 99% of the time, the issue lies in the URL changing or the propagation delay not being respected.

### API Key Security Reminder (If re-integrating Firebase)
If you received a warning about an unrestricted API key, ensure you have followed the steps in the Google Cloud Console for your Firebase project's API key.
(Details on restricting API keys: Application restrictions, API restrictions)

### OAuth 2.0 Client ID Configuration (If re-integrating Firebase and using OAuth)
(Details on configuring Authorized JavaScript origins and Authorized redirect URIs in Google Cloud Console, and Authorized domains in Firebase Console)

By correctly configuring these settings (if you were using Firebase), you would ensure that your API key is not misused and that authentication flows work correctly.

## Custom Webhook Handler (`functions/src/index.ts` - Deprecated)

The `functions/src/index.ts` file was previously for custom Firebase Cloud Functions. As Firebase has been removed, this file is no longer used for Firebase Functions. If you need custom backend logic (e.g., for handling Stripe webhooks outside of an extension), you should implement this using Next.js API routes (e.g., in `src/app/api/...`).
An example of a Next.js API route for Stripe webhooks is commented out in `functions/src/index.ts` for reference.
The `functions` directory can be manually deleted from your project if you have no other use for it.

## Deploying (General Guidance - Adapt for your chosen platform)

*   **Next.js Application:** Deployment will depend on your chosen hosting platform (e.g., Vercel, Netlify, AWS Amplify, Google Cloud Run). Follow their specific deployment guides for Next.js applications.
*   **Environment Variables:** Ensure all necessary environment variables from your `.env.local` (like `STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) are set in your hosting provider's environment variable settings for your deployed application. **Do not commit your `.env.local` file.**
    *   `NEXTAUTH_URL` should be set to your production application's URL.
    *   Use your **LIVE** Stripe keys for production.
```