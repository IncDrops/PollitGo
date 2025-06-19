

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables (.env.local)

This project uses environment variables for configuration, especially for sensitive keys. You need to create a `.env.local` file in the root of your project. This file is included in `.gitignore` and should never be committed to version control.

**Content for your `.env.local` file (for LOCAL DEVELOPMENT ONLY):**

```env
# Stripe Keys
# Replace with your ACTUAL Stripe Test Secret Key (starts with sk_test_...)
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE
# Replace with your ACTUAL Stripe Test Publishable Key (starts with pk_test_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_GOES_HERE

# NextAuth.js Variables
# This should be the base URL of your application FOR LOCAL DEVELOPMENT.
# If `npm run dev` runs on port 9003, this is http://localhost:9003
# If your app runs on a different port locally, update it.
# FOR DEPLOYED ENVIRONMENTS (Vercel, Netlify, Google Cloud Build/Run etc.), THIS MUST BE SET TO
# THE PUBLICLY ACCESSIBLE URL OF THAT DEPLOYED ENVIRONMENT in the hosting provider's settings.
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
4.  **For Deployed/Prototype Environments (like Vercel, Netlify, Google Cloud Build/Run, Firebase Studio Prototypes):**
    *   `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` **must** be set as environment variables through your hosting provider's settings dashboard or environment configuration. **These are NOT read from `.env.local` in deployed environments.**
    *   **`STRIPE_SECRET_KEY` is especially critical for the `/api/stripe/create-checkout-session` route to function. If it's missing in the build/deployment environment, your build might fail or the route will not work at runtime.**
    *   **`NEXTAUTH_URL` in deployed/prototype environments MUST be the full public URL of that specific deployment** (e.g., `https://your-app-name.vercel.app` or `https://your-dynamic-studio-url.cloudworkstations.dev`). If it's not set correctly, NextAuth.js API routes (like login/signup) will likely fail with "Failed to fetch" errors because the backend doesn't know its own public address.
    *   Firebase Studio prototypes, in particular, might not have a straightforward way to set *backend* environment variables for Next.js API routes that it hosts. This can lead to the "Failed to fetch" error for NextAuth.js when running on the prototype URL, even if it works perfectly locally. This is often a limitation of the specific prototyping environment's configuration options for Next.js backends.

## Authentication with NextAuth.js

This application has been configured to use NextAuth.js for authentication.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** You can log in with `test@example.com` and password `password`.
    *   **Simulated Signup:** The current setup in `src/app/api/auth/[...nextauth]/route.ts` has a placeholder `authorize` function. This function will currently allow any new email/password combination to "sign up" and log in for demonstration purposes.
*   **Database Integration Needed:** For a real application, you would need to:
    1.  Integrate a database (e.g., Supabase, PostgreSQL with Prisma, MongoDB).
    2.  Modify the `authorize` function in `src/app/api/auth/[...nextauth]/route.ts` to:
        *   Validate login credentials against your user database.
        *   Handle user registration by creating new user records in your database (likely via a separate API endpoint that you would create, e.g., `/api/auth/register`).

### Troubleshooting NextAuth.js "Failed to fetch" errors:
If you encounter "Failed to fetch" errors during login/signup:
1.  **Verify `NEXTAUTH_URL`:**
    *   **Local Development:** In `.env.local`, ensure it's `http://localhost:9003` (or your correct local port). **Restart your dev server after any change.**
    *   **Deployed/Prototype (e.g., Vercel, Netlify, Firebase Studio):** This is the **most common cause** of "Failed to fetch" in these environments. `NEXTAUTH_URL` **must** be set to the publicly accessible URL of *that specific environment* (e.g., `https://your-app-name.vercel.app` or `https://your-studio-url.cloudworkstations.dev`) in your hosting provider's environment variable settings. If the environment doesn't allow setting backend environment variables for Next.js API routes, or if it's misconfigured, NextAuth.js may not function correctly.
2.  **Verify `NEXTAUTH_SECRET`:**
    *   **Local Development:** In `.env.local`, ensure it's set to a strong, randomly generated string. **Restart your dev server after any change.**
    *   **Deployed/Prototype:** Ensure `NEXTAUTH_SECRET` is also set to the exact same strong secret in your hosting provider's environment variable settings.
    *   The API route `src/app/api/auth/[...nextauth]/route.ts` includes an explicit check and will log an error to your **server terminal/logs** if `NEXTAUTH_SECRET` is missing or not loaded by the server.
3.  **Restart Server (Local Development):** You **MUST restart your Next.js development server** (`npm run dev`) after any changes to `.env.local`.
4.  **Check Server Terminal Logs / Deployment Logs:** Look at the terminal where `npm run dev` is running (or your deployed environment's server logs). Errors in the NextAuth.js API route will appear here, especially regarding missing `NEXTAUTH_SECRET` or other misconfigurations. The Stripe API route will also log an error if `STRIPE_SECRET_KEY` is missing.
5.  **Check Browser Developer Console:** Look for more detailed error messages logged by the login page itself. The login page was updated to show more specific error messages for "Failed to fetch".

## Stripe Integration

This application uses Stripe for payments.

### Stripe API Route Configuration (`/api/stripe/create-checkout-session`)

Your Next.js application includes an API route at `src/app/api/stripe/create-checkout-session/route.ts`. This route is responsible for creating Stripe Checkout Sessions.

*   **Environment Variable for Stripe Secret Key:** Ensure `STRIPE_SECRET_KEY` is set in your `.env.local` file (for local development) or in your hosting environment settings (for deployed/built applications). **If this key is missing in the build/deployment environment, the build may fail or the API route will not function correctly at runtime.**
*   **Environment Variable for Stripe Publishable Key:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set (used on the client-side).
*   **Restart Dev Server (Local):** After editing `.env.local`, restart your Next.js development server.

## Testing the Payment Flow
1.  **Set Environment Variables:** Ensure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXTAUTH_URL`, and `NEXTAUTH_SECRET` are correctly set (in `.env.local` for local, or in hosting provider settings for deployed).
2.  **Restart Dev Server (Local if applicable).**
3.  **Log In / Sign Up (Simulated):**
    *   Open your app.
    *   Use the Login/Sign Up buttons. Test with `test@example.com` / `password` or create a new "user".
4.  **Initiate a Payment (e.g., on "New Poll" page with a pledge, or "Tip Creator" on poll pages).**
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
8.  **Troubleshooting:** Check browser console and Next.js terminal/server logs. Ensure environment variables are correctly set for the environment you are testing in (local vs. deployed).

## Deploying to Vercel (or similar platforms) for Testing

If you need to test on actual mobile devices and the prototype environment login isn't working (likely due to `NEXTAUTH_URL` issues in that specific prototype setup), deploying to a platform like Vercel or Netlify is recommended. These platforms offer straightforward ways to manage environment variables.

**Steps for Vercel:**

1.  **Ensure your code is in a Git Repository:**
    *   Vercel deploys from Git (GitHub, GitLab, Bitbucket).
    *   If not already, initialize Git, commit your files, and push to a remote repository on one of these services.

2.  **Import Project on Vercel:**
    *   Log in to Vercel.
    *   Click "Add New..." > "Project".
    *   Connect to your Git provider and select your project repository. Vercel usually auto-detects Next.js settings.

3.  **Configure Environment Variables in Vercel Project Settings:**
    *   This is the **most critical step** for NextAuth.js and Stripe to work correctly.
    *   In your Vercel project settings, find the "Environment Variables" section.
    *   Add the following variables:
        *   `NEXTAUTH_URL`:
            *   Key: `NEXTAUTH_URL`
            *   Value: **The public URL Vercel assigns to your deployment** (e.g., `https://your-project-name.vercel.app`). You'll get this URL after the first deployment; you might need to deploy once, get the URL, then add/update this variable and redeploy.
        *   `NEXTAUTH_SECRET`:
            *   Key: `NEXTAUTH_SECRET`
            *   Value: The **exact same strong, random secret** you generated for your local `.env.local` file.
        *   `STRIPE_SECRET_KEY`:
            *   Key: `STRIPE_SECRET_KEY`
            *   Value: Your actual Stripe **Secret Key** (e.g., `sk_test_...` or `sk_live_...`).
        *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:
            *   Key: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
            *   Value: Your actual Stripe **Publishable Key** (e.g., `pk_test_...` or `pk_live_...`).
    *   Ensure these are set for the "Production" environment on Vercel. You can also set them for "Preview" and "Development" environments if needed (though Vercel's "Development" often refers to their CLI, not your local machine directly).

4.  **Deploy:**
    *   Click the "Deploy" button in Vercel.
    *   Vercel will build and deploy your application.

5.  **Test:**
    *   Use the Vercel-provided URL (e.g., `https://your-project-name.vercel.app`) to test your application on desktop and mobile devices. Login should now work.

Similar steps apply to other platforms like Netlify; consult their documentation for specifics on setting environment variables.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project. Related sections in this README are for historical reference only.

## Custom Webhook Handler (`functions/src/index.ts` - Deprecated)
The `functions` directory is no longer used for Firebase Functions. Custom backend logic (e.g., for Stripe webhooks) should be implemented using Next.js API routes if needed, separate from any Stripe extension.
