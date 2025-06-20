
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables for configuration, especially for sensitive API keys and application settings.

### For Local Development: `.env.local` File

You **MUST** create a `.env.local` file in the root of your project (at the same level as `package.json`). This file is listed in `.gitignore` and **should never be committed to version control.**

**Template for your `.env.local` file:**
```env
# NextAuth.js Variables - CRITICAL FOR LOGIN/SIGNUP AND BUILD STABILITY
# =====================================================================

# NEXTAUTH_URL: The base URL of your application.
# Local Development: If `npm run dev` runs on port 9003, this is http://localhost:9003. Adjust if different.
# Deployed Environments (Vercel, Google Cloud etc.): This MUST be the FULL PUBLIC URL of that deployment.
# Example for Vercel: NEXTAUTH_URL=https://your-project-name.vercel.app
# Example for your live domain: NEXTAUTH_URL=https://www.pollitago.com
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# Generate one using: openssl rand -base64 32
# THIS IS THE MOST COMMON CAUSE OF BUILD ERRORS LIKE "ENOENT: no such file or directory, open '...app-build-manifest.json'"
# for pages like /login or /signup if it's missing or incorrect in the BUILD ENVIRONMENT.
# Ensure this exact secret is also set in your Vercel/Google Cloud Build environment variables.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE

# Stripe Keys - CRITICAL FOR PAYMENTS
# ====================================

# STRIPE_SECRET_KEY: Your Stripe *Secret* Key (starts with sk_test_... or sk_live_...).
# Used by backend API routes.
# If missing in deployed/build environments, can cause errors like "Failed to collect page data for /api/stripe/create-checkout-session".
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe *Publishable* Key (starts with pk_test_... or pk_live_...).
# Used by client-side Stripe.js.
# If missing or incorrect, Stripe.js will fail to initialize in the browser.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_GOES_HERE
```

**VERY IMPORTANT INSTRUCTIONS:**

1.  **Replace Placeholders:** Substitute ALL placeholder values (e.g., `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`, `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE`) with your **actual keys and generated secret**.
2.  **Generate `NEXTAUTH_SECRET`:** In your terminal, run `openssl rand -base64 32`. Copy the output and paste it as the value for `NEXTAUTH_SECRET`.
3.  **Restart Dev Server:** After creating or modifying `.env.local` for local development, you **MUST** restart your Next.js development server (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.
4.  **Crucial for `ENOENT ... app-build-manifest.json` Errors:**
    *   The error `ENOENT: no such file or directory, open '.../app/login/page/app-build-manifest.json'` (or for `/signup`, or other auth-related pages) during a build (local or deployed) is **almost always caused by a missing or incorrect `NEXTAUTH_SECRET` in the environment where `next build` is running.**
    *   NextAuth.js requires this secret to be available during the build process. If it's not, the build for auth-related pages can be incomplete, leading to these missing manifest files.
    *   **Action:**
        *   **Local:** Ensure `NEXTAUTH_SECRET` is correctly set in `.env.local` and restart your dev server. If the error persists locally, delete the `.next` folder and restart.
        *   **Vercel/Google Cloud Build:** Ensure `NEXTAUTH_SECRET` is correctly set as an environment variable in your hosting provider's settings. Then, redeploy/rebuild.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration:

*   `NEXTAUTH_URL`: Set to the **full public URL of that specific deployment** (e.g., `https://your-project.vercel.app`, `https://your-prototype-id.cloudworkstations.dev`, or `https://www.pollitago.com`).
*   `NEXTAUTH_SECRET`: Set to the **exact same strong, random secret** you used in `.env.local`.
*   `STRIPE_SECRET_KEY`: Your actual Stripe Secret Key.
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your actual Stripe Publishable Key.

**Consequences of Missing Environment Variables in Deployed/Build Environments:**

*   **Missing `NEXTAUTH_SECRET`:**
    *   **Build Failure:** Very likely to cause `ENOENT ... app-build-manifest.json` errors for pages like `/login` or `/signup`.
    *   **Runtime Failure:** "Internal Server Error" during login/signup.
*   **Missing or Incorrect `NEXTAUTH_URL`:**
    *   **Runtime Failure:** "Failed to fetch" errors during login/signup, or OAuth provider errors.
*   **Missing `STRIPE_SECRET_KEY`:**
    *   **Build Failure:** Can cause `[Error: Failed to collect page data for /api/stripe/create-checkout-session]` if the build process analyzes API routes deeply.
    *   **Runtime Failure:** Stripe checkout session creation will fail.
*   **Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:**
    *   **Runtime Failure:** Stripe.js will not initialize in the browser; payment forms will break.

## Authentication with NextAuth.js

This application uses NextAuth.js. The `src/app/api/auth/[...nextauth]/route.ts` file handles authentication requests.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** `test@example.com` / `password`.
    *   **Simulated Signup:** The `authorize` function currently allows any new email/password to "sign up." This is for demo purposes. A real application needs database integration for user management.

### Troubleshooting NextAuth.js & Build Errors

*   **`ENOENT: no such file or directory, open '...app-build-manifest.json'` (for `/login`, `/signup`, etc.):**
    1.  **PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING or INCORRECT in the BUILD ENVIRONMENT.**
    2.  **Action (Vercel/Google Cloud Build/Firebase Studio Prototypes):** Go to your hosting provider's settings and ensure `NEXTAUTH_SECRET` is set with the correct, strong, random value. Also, verify `NEXTAUTH_URL`.
    3.  **Action (Local Development):** Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set in `.env.local`. Stop your dev server, delete the `.next` directory, and restart.
    4.  **Redeploy/Rebuild:** After confirming/setting environment variables, trigger a new build/deployment.

*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    1.  **Verify `NEXTAUTH_SECRET` on Vercel/deployment platform.** This is the most common cause.
    2.  Verify `NEXTAUTH_URL` on Vercel/deployment platform.
    3.  Check **Runtime Logs** on Vercel for specific error messages from `/api/auth/...`. The auth route includes a check for `NEXTAUTH_SECRET`.

*   **"Failed to fetch" errors on Login/Signup:**
    1.  Verify `NEXTAUTH_URL` is correct for your current environment.
    2.  Restart your dev server if you changed `.env.local`.

## Stripe Integration

Stripe is used for payments. The API route `src/app/api/stripe/create-checkout-session/route.ts` creates checkout sessions.

*   Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are correctly set for your environment.
*   The `RootLayout` checks for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and logs a console error if missing.
*   The Stripe API route (`create-checkout-session`) logs an error if `STRIPE_SECRET_KEY` is missing.

## Deploying to Vercel

1.  Ensure your code is in a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project to Vercel.
3.  **Configure Environment Variables in Vercel Project Settings:**
    *   `NEXTAUTH_URL` (your Vercel deployment URL)
    *   `NEXTAUTH_SECRET` (your strong secret)
    *   `STRIPE_SECRET_KEY`
    *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4.  Deploy and test.

## Google Cloud Build / Firebase Studio Prototype Environments

When using Firebase Studio prototypes or deploying directly via Google Cloud Build, your local `.env.local` file is **NOT** used.

*   **Required Variables:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
*   **Configuration:** These must be set directly within the Google Cloud settings for the build trigger or the target deployment service (e.g., Cloud Run). This might involve setting substitution variables, linking secrets from Google Secret Manager, or configuring environment variables on the Cloud Run service revision.
*   **`ENOENT ... app-build-manifest.json` or `Failed to collect page data ...` errors:**
    *   These build errors often mean critical environment variables (especially `NEXTAUTH_SECRET` for manifest errors, or `STRIPE_SECRET_KEY` for Stripe API route data collection errors) are not available to the build process or runtime environment.
    *   Ensure secrets are securely provided to your Google Cloud deployment.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.
