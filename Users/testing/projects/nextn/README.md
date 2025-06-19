
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
# This should be the base URL of your application.
# - For local development with `npm run dev -p 9003`, this is http://localhost:9003
# - If your app runs on a different port locally, update it.
# - For deployed environments (Vercel, Netlify, Firebase Studio Prototypes etc.),
#   this MUST be set to the publicly accessible URL of THAT deployed environment.
#   e.g., https://your-app-name.vercel.app OR https://your-studio-prototype-url.cloudworkstations.dev
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. A "FAILED TO FETCH" ERROR OFTEN MEANS THIS IS MISCONFIGURED
# FOR THE ENVIRONMENT YOU ARE TESTING IN, OR THE SERVER WASN'T RESTARTED (LOCALLY).
NEXTAUTH_URL=http://localhost:9003

# Generate a strong secret for NextAuth.js. This is CRITICAL for security.
# In your terminal, run: openssl rand -base64 32
# Copy the output and paste it here.
# Example: NEXTAUTH_SECRET=aVeryStrongAndRandomStringGeneratedByOpenSSL
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. IF MISSING, NEXTAUTH API ROUTES WILL FAIL.
# Ensure this variable is also set in your deployed environment's settings.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE
```

**VERY IMPORTANT:**
1.  Replace ALL placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE` and `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`) with your **actual keys and generated secret**.
2.  To generate `NEXTAUTH_SECRET`, you can run `openssl rand -base64 32` in your terminal.
3.  **After creating or modifying `.env.local` (for local development), you MUST restart your Next.js development server** (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for the changes to take effect. Next.js only loads environment variables on startup.
4.  **For Deployed/Prototype Environments (like Firebase Studio):** `NEXTAUTH_URL` and `NEXTAUTH_SECRET` must be set as environment variables through your hosting provider's settings dashboard. Firebase Studio might not have an easy way to set *backend* environment variables for Next.js API routes, which can lead to the "Failed to fetch" error for NextAuth.js when running on the prototype URL. This is a limitation of the prototyping environment, not an issue with the NextAuth.js setup itself if it works locally.

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
1.  **Verify `NEXTAUTH_URL` in `.env.local` (for local dev) or your hosting environment settings (for deployed/prototype):**
    *   **Local:** Ensure it's `http://localhost:9003` (or your correct local port).
    *   **Deployed/Prototype (e.g., Firebase Studio):** This is the most common cause of "Failed to fetch" in these environments. `NEXTAUTH_URL` **must** be set to the publicly accessible URL of *that specific environment* (e.g., `https://your-studio-url.cloudworkstations.dev`). If the environment doesn't allow setting backend environment variables for Next.js API routes, NextAuth.js may not function correctly.
2.  **Verify `NEXTAUTH_SECRET` in `.env.local` (local) or hosting environment settings (deployed):** Ensure it's set to a strong, randomly generated string. The API route `src/app/api/auth/[...nextauth]/route.ts` includes an explicit check and will log an error to your **server terminal** if it's missing.
3.  **Restart Server (Local Development):** **You MUST restart your Next.js development server** (`npm run dev`) after any changes to `.env.local`.
4.  **Check Server Terminal Logs:** Look at the terminal where `npm run dev` is running (or your deployed environment's server logs). Errors in the NextAuth.js API route will appear here, especially regarding missing `NEXTAUTH_SECRET`.
5.  **Check Browser Developer Console:** Look for more detailed error messages logged by the login page itself.

## Stripe Integration

This application uses Stripe for payments.

### Stripe API Route Configuration (`/api/stripe/create-checkout-session`)

Your Next.js application includes an API route at `src/app/api/stripe/create-checkout-session/route.ts`. This route is responsible for creating Stripe Checkout Sessions.

*   **Environment Variable for Stripe Secret Key:** Ensure `STRIPE_SECRET_KEY` is set in your `.env.local` file (for local) or hosting environment (for deployed).
*   **Environment Variable for Stripe Publishable Key:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set.
*   **Restart Dev Server (Local):** After editing `.env.local`, restart your Next.js development server.

## Testing the Payment Flow
1.  **Set Environment Variables:** Ensure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are correctly set.
2.  **Restart Dev Server (Local).**
3.  **Log In / Sign Up (Simulated):**
    *   Open your app (e.g., `http://localhost:9003`).
    *   Use the Login/Sign Up buttons. Test with `test@example.com` / `password` or create a new "user".
4.  **Initiate a Payment (e.g., on "New Poll" page with a pledge).**
5.  **Stripe Checkout:** You should be redirected to Stripe's Checkout page.
    *   Use Stripe's test card numbers:
        *   **Card Number:** `4242 4242 4242 4242`
        *   **Expiration Date:** Any future date (e.g., `12/30`)
        *   **CVC/CVV:** Any 3 digits (e.g., `123`)
        *   **Name on Card:** Any name
        *   **ZIP/Postal Code:** Any ZIP/Postal code
    *   Complete the payment.
6.  **Verify Redirection:** Success to `/payment-success`, cancel to `/payment-cancelled`.
7.  **Check Stripe Dashboard (Test Mode).**
8.  **Troubleshooting:** Check browser console and Next.js terminal/server logs.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project. Related sections in this README are for historical reference only.

## Custom Webhook Handler (`functions/src/index.ts` - Deprecated)
The `functions` directory is no longer used for Firebase Functions. Custom backend logic (e.g., for Stripe webhooks) should be implemented using Next.js API routes.

## Deploying (General Guidance - Adapt for your chosen platform)
*   **Next.js Application:** Deployment will depend on your chosen hosting platform (Vercel, Netlify, etc.).
*   **Environment Variables:** Ensure ALL necessary environment variables from your `.env.local` are set in your hosting provider's settings for the deployed application. `NEXTAUTH_URL` must be your production URL. Use **LIVE** Stripe keys for production.
