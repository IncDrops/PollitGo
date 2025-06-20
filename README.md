

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
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. IF MISSING, NEXTAUTH API ROUTES WILL FAIL,
# AND IT CAN LEAD TO BUILD ERRORS (like missing page manifests) OR RUNTIME ERRORS.
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
    *   **`NEXTAUTH_SECRET` is absolutely critical.** If missing or incorrect in the deployment environment, NextAuth.js will fail, often leading to "Internal Server Error" on login/signup, and can also cause build failures (e.g., missing `app-build-manifest.json` files for pages that might directly or indirectly depend on auth state during build).

## Authentication with NextAuth.js

This application has been configured to use NextAuth.js for authentication.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** You can log in with `test@example.com` and password `password`.
    *   **Simulated Signup:** The current setup in `src/app/api/auth/[...nextauth]/route.ts` has a placeholder `authorize` function. This function will currently allow any new email/password combination to "sign up" and log in for demonstration purposes.
*   **Database Integration Needed:** For a real application, you would need to:
    1.  Integrate a database.
    2.  Modify the `authorize` function to validate credentials and handle user creation.

### Troubleshooting NextAuth.js & Build Errors

*   **"Failed to fetch" errors on Login/Signup:**
    *   Verify `NEXTAUTH_URL` is correct for your current environment (local or deployed).
    *   Restart your dev server if you changed `.env.local`.
*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    *   **Verify `NEXTAUTH_SECRET` on Vercel/deployment platform.** This is the most common cause. It MUST be set and match your intended secret.
    *   Verify `NEXTAUTH_URL` on Vercel/deployment platform.
    *   Check runtime logs on Vercel for more specific error messages from the `/api/auth/...` route. The auth route (`src/app/api/auth/[...nextauth]/route.ts`) includes a check and will log if `NEXTAUTH_SECRET` is missing from the server environment.
*   **Build Errors: `ENOENT: no such file or directory, open '...app-build-manifest.json'` for `/login`, `/signup`, or other auth-related pages:**
    *   This error means the Next.js build was incomplete for that page.
    *   **The MOST COMMON CAUSE is a missing or incorrect `NEXTAUTH_SECRET` environment variable in the build environment** (Vercel, Google Cloud Build, etc.). NextAuth.js instability due to a missing secret can prevent pages related to auth from building correctly.
    *   **ACTION:**
        1.  **For Vercel/Google Cloud Build/Firebase Studio Prototypes:** Go to your hosting provider's settings and ensure `NEXTAUTH_SECRET` is set with the correct, strong, random value. Also, ensure `NEXTAUTH_URL` is correctly set to the public URL of that specific deployment.
        2.  **Redeploy/Rebuild:** After confirming/setting environment variables, trigger a new build/deployment.
    *   **For Local Development (if this error occurs locally):**
        1.  Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set in your `.env.local` file.
        2.  Stop your development server.
        3.  **Delete the `.next` directory** in your project root.
        4.  Restart your development server (`npm run dev`). This forces a completely fresh build.

## Stripe Integration

This application uses Stripe for payments.

### Stripe API Route Configuration (`/api/stripe/create-checkout-session`)
Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are set correctly for your environment. The API route `src/app/api/stripe/create-checkout-session/route.ts` has been updated to initialize the Stripe client inside the `POST` handler for better build resilience.

## Google Cloud Build / Firebase Studio Prototype Environments

When using Firebase Studio prototypes or deploying directly via Google Cloud Build, your local `.env.local` file is **NOT** used. The build environment and the runtime environment **must** have necessary environment variables configured directly within the Google Cloud settings.

*   **Required Variables:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
*   **Configuration:**
    *   These are typically set via the Google Cloud Build trigger configuration (e.g., substitution variables passed to build steps) or by linking secrets from Google Secret Manager to the build steps and/or the target deployment service (like Cloud Run).
    *   For Cloud Run, environment variables are set in the service's revision settings.
*   **Error `[Error: Failed to collect page data for /api/stripe/create-checkout-session]` or `ENOENT ... app-build-manifest.json`:**
    *   These build errors often mean that critical environment variables (like `STRIPE_SECRET_KEY` or, more commonly for manifest errors, `NEXTAUTH_SECRET`) are not available to the build process or the runtime environment.
    *   Ensure secrets are securely provided to your Google Cloud deployment. See the "Troubleshooting NextAuth.js & Build Errors" section above for specific guidance on manifest errors.

## Testing the Payment Flow
1.  Set Environment Variables.
2.  Restart Dev Server (Local if applicable).
3.  Log In / Sign Up.
4.  Initiate a Payment.
5.  Complete Stripe Checkout with test card details.
6.  Verify Redirection and check Stripe Dashboard.

## Deploying to Vercel (or similar platforms) for Testing
Follow the steps to import your project to Vercel and, most importantly, **configure all necessary environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) in your Vercel project settings.**

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.

## Custom Webhook Handler (`functions/src/index.ts` - Deprecated)
The `functions` directory is no longer used.
