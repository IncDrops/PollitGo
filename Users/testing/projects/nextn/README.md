
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
# For local dev with `npm run dev -p 9003`, this is http://localhost:9003
# If your app runs on a different port, or if you are using a dynamic URL
# for testing OAuth providers (like Firebase Studio often assigns), update it accordingly.
# Ensure this URL is reachable from your browser AND by NextAuth.js for its internal operations.
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. A "FAILED TO FETCH" ERROR OFTEN MEANS THIS IS MISCONFIGURED OR THE SERVER WASN'T RESTARTED.
NEXTAUTH_URL=http://localhost:9003

# Generate a strong secret for NextAuth.js. This is CRITICAL for security.
# In your terminal, run: openssl rand -base64 32
# Copy the output and paste it here.
# Example: NEXTAUTH_SECRET=aVeryStrongAndRandomStringGeneratedByOpenSSL
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. IF MISSING, NEXTAUTH API ROUTES WILL FAIL.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE
```

**VERY IMPORTANT:**
1.  Replace ALL placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE` and `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`) with your **actual keys and generated secret**.
2.  To generate `NEXTAUTH_SECRET`, you can run `openssl rand -base64 32` in your terminal.
3.  **After creating or modifying `.env.local`, you MUST restart your Next.js development server** (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for the changes to take effect. Next.js only loads environment variables on startup.

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

### Troubleshooting NextAuth.js "Failed to fetch" errors:
If you encounter "Failed to fetch" errors during login/signup:
1.  **Verify `NEXTAUTH_URL` in `.env.local`:** Ensure it's correctly set to your application's base URL (e.g., `http://localhost:9003` for local development).
2.  **Verify `NEXTAUTH_SECRET` in `.env.local`:** Ensure it's set to a strong, randomly generated string. The API route `src/app/api/auth/[...nextauth]/route.ts` includes an explicit check and will log an error to your **server terminal** if it's missing on startup or when the route is hit.
3.  **Restart Server:** **You MUST restart your Next.js development server** (`npm run dev`) after any changes to `.env.local`.
4.  **Check Server Terminal Logs:** Look at the terminal where `npm run dev` is running. Errors in the NextAuth.js API route will appear here. The API route now includes an explicit check for `NEXTAUTH_SECRET`.
5.  **Check Browser Developer Console:** Look for more detailed error messages logged by the login page itself.

## Stripe Integration

This application uses Stripe for payments.

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
    *   Use Stripe's test card numbers. For a successful payment, use:
        *   **Card Number:** `4242 4242 4242 4242`
        *   **Expiration Date:** Any future date (e.g., `12/30`)
        *   **CVC/CVV:** Any 3 digits (e.g., `123`)
        *   **Name on Card:** Any name (e.g., "Test User")
        *   **ZIP/Postal Code:** Any ZIP/Postal code (e.g., `12345`)
    *   Complete the payment.
6.  **Verify Redirection:**
    *   On successful payment, you should be redirected to `/payment-success` in your app.
    *   If you cancel, you should be redirected to `/payment-cancelled`.
7.  **Check Stripe Dashboard:**
    *   Log in to your Stripe Dashboard (in Test Mode).
    *   Go to "Payments" to see the test transaction.
8.  **Troubleshooting:**
    *   Check your browser's developer console (F12) for client-side errors (e.g., "failed to fetch" might indicate `NEXTAUTH_URL` issues or API route crashes).
    *   Check your Next.js terminal (where `npm run dev` is running) for server-side API route errors.
    *   Double-check your `.env.local` keys and ensure the server was restarted.

## Deprecated: Firebase Usage Notes
This project previously used Firebase for authentication and database. These services have been removed. The following sections are for historical reference or if you decide to re-integrate Firebase or a similar BaaS.

### Troubleshooting: `auth/requests-from-referer-...-are-blocked` Error in Firebase Studio (If re-integrating Firebase)
(Details omitted for brevity as Firebase is removed)

### API Key Security Reminder (If re-integrating Firebase)
(Details omitted for brevity as Firebase is removed)

### OAuth 2.0 Client ID Configuration (If re-integrating Firebase and using OAuth)
(Details omitted for brevity as Firebase is removed)

## Custom Webhook Handler (`functions/src/index.ts` - Deprecated)

The `functions/src/index.ts` file was previously for custom Firebase Cloud Functions. As Firebase has been removed, this file is no longer used for Firebase Functions. If you need custom backend logic (e.g., for handling Stripe webhooks outside of an extension), you should implement this using Next.js API routes (e.g., in `src/app/api/...`).
An example of a Next.js API route for Stripe webhooks is commented out in `functions/src/index.ts` for reference.
The `functions` directory can be manually deleted from your project if you have no other use for it.

## Deploying (General Guidance - Adapt for your chosen platform)

*   **Next.js Application:** Deployment will depend on your chosen hosting platform (e.g., Vercel, Netlify, AWS Amplify, Google Cloud Run). Follow their specific deployment guides for Next.js applications.
*   **Environment Variables:** Ensure all necessary environment variables from your `.env.local` (like `STRIPE_SECRET_KEY`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) are set in your hosting provider's environment variable settings for your deployed application. **Do not commit your `.env.local` file.**
    *   `NEXTAUTH_URL` should be set to your production application's URL.
    *   Use your **LIVE** Stripe keys for production.

  
