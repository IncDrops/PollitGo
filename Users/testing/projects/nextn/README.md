
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

# Google Cloud & Genkit (for AI Features) - Local Development Note
# =================================================================
# For local development, Genkit (which uses Google AI) relies on Application Default Credentials (ADC).
# You typically set this up ONCE on your machine by running:
# gcloud auth application-default login
# This means you usually DO NOT need to put Google Cloud project IDs or service account keys
# directly into this .env.local file for Genkit to work locally.
# Deployed environments (like Google Cloud Run) will use service account permissions.
```

**VERY IMPORTANT INSTRUCTIONS:**

1.  **Replace Placeholders:** Substitute ALL placeholder values (e.g., `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`, `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE`) with your **actual keys and generated secret**.
2.  **Generate `NEXTAUTH_SECRET`:** In your terminal, run `openssl rand -base64 32`. Copy the output and paste it as the value for `NEXTAUTH_SECRET`.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts. This is a one-time setup per machine for your Google account.
4.  **Restart Dev Server:** After creating or modifying `.env.local` for local development, you **MUST** restart your Next.js development server (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.
5.  **Crucial for `ENOENT ... app-build-manifest.json` Errors (Missing Manifest Files):**
    *   The error `ENOENT: no such file or directory, open '.../app/login/page/app-build-manifest.json'` (or for `/signup`, or other auth-related pages) during a build (local or deployed) is **almost always caused by a missing or incorrect `NEXTAUTH_SECRET` in the environment where `next build` is running.**
    *   NextAuth.js requires this secret to be available during the build process. If it's not, NextAuth.js can become unstable, and the build for auth-related pages can be incomplete, leading to these missing manifest files.
    *   **ACTION (Details in "Troubleshooting NextAuth.js & Build Errors" section below):**
        *   **Local:** Ensure `NEXTAUTH_SECRET` is correctly set in `.env.local`, delete the `.next` folder, and restart your dev server.
        *   **Vercel/Google Cloud Build:** Ensure `NEXTAUTH_SECRET` is correctly set as an environment variable in your hosting provider's settings. Then, redeploy/rebuild.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration:

*   `NEXTAUTH_URL`: Set to the **full public URL of that specific deployment** (e.g., `https://your-project.vercel.app`, `https://your-prototype-id.cloudworkstations.dev`, or `https://www.pollitago.com`).
*   `NEXTAUTH_SECRET`: Set to the **exact same strong, random secret** you used in `.env.local`. **This is paramount for build success of auth pages.**
*   `STRIPE_SECRET_KEY`: Your actual Stripe Secret Key.
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your actual Stripe Publishable Key.
*   **Google Cloud Project (for Genkit/AI):** In deployed Google Cloud environments (like Cloud Run), the project ID is often automatically available. The service account running your application will need appropriate IAM permissions (e.g., "Vertex AI User") to call Google AI services. You typically don't set ADC or service account keys directly as environment variables here; instead, you rely on the inherent service account of the Cloud Run service.

**Consequences of Missing Environment Variables in Deployed/Build Environments:**

*   **Missing `NEXTAUTH_SECRET`:**
    *   **Build Failure:** Very likely to cause `ENOENT ... app-build-manifest.json` errors for pages like `/login` or `/signup`.
    *   **Runtime Failure:** "Internal Server Error" during login/signup.
*   **Missing or Incorrect `NEXTAUTH_URL`:**
    *   **Runtime Failure:** "Failed to fetch" errors during login/signup, or OAuth provider errors.
*   **Missing `STRIPE_SECRET_KEY`:**
    *   **Build Failure (Less Common with Current Code):** Can cause `[Error: Failed to collect page data for /api/stripe/create-checkout-session]` if the build process analyzes API routes deeply and the variable is absent.
    *   **Runtime Failure:** Stripe checkout session creation will fail.
*   **Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:**
    *   **Runtime Failure:** Stripe.js will not initialize in the browser; payment forms will break.
*   **Missing Google Cloud Permissions/Configuration (for Genkit/AI):**
    *   **Runtime Failure:** AI features will fail, likely with authentication or permission denied errors from Google Cloud services.

## Authentication with NextAuth.js

This application uses NextAuth.js. The `src/app/api/auth/[...nextauth]/route.ts` file handles authentication requests.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** `test@example.com` / `password`.
    *   **Simulated Signup:** The `authorize` function currently allows any new email/password to "sign up." This is for demo purposes. A real application needs database integration for user management.

### Troubleshooting NextAuth.js & Build Errors

*   **CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`, `/api/auth/...`)**
    1.  **PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING or INCORRECT in the BUILD ENVIRONMENT.**
        *   NextAuth.js **requires** `NEXTAUTH_SECRET` to be available not only at runtime but also *during the `next build` process*.
        *   If the secret is missing or invalid during the build, NextAuth.js may not initialize correctly, leading to an unstable state. This can cause the build to be incomplete for pages related to authentication (like `/login`, `/signup`) or the auth API routes themselves, resulting in missing manifest files.
    2.  **ACTION (Vercel/Google Cloud Build/Firebase Studio Prototypes):**
        *   Go to your hosting provider's **Project Settings > Environment Variables**.
        *   **Verify `NEXTAUTH_SECRET`:**
            *   Ensure it exists.
            *   Ensure its value is a **strong, random string** (e.g., generated via `openssl rand -base64 32`).
            *   Ensure it's the **exact same value** you'd use in `.env.local`.
        *   **Verify `NEXTAUTH_URL`:**
            *   Ensure it exists.
            *   Ensure its value is the **full public URL of that specific deployment** (e.g., `https://your-project.vercel.app` or `https://www.pollitago.com`).
    3.  **ACTION (Local Development - if building locally with `npm run build`):**
        *   Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set in your `.env.local` file.
        *   Stop your development server (`npm run dev`).
        *   **Delete the `.next` folder** in your project root. This clears any potentially corrupted build cache.
        *   Run `npm run build` again, or restart your development server (`npm run dev`).
    4.  **Redeploy/Rebuild:** After confirming/setting environment variables in your hosting provider's settings, **trigger a new build/deployment**. On Vercel, you can usually do this from the "Deployments" tab for your project by clicking "Redeploy" on the latest commit.

*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    1.  **Verify `NEXTAUTH_SECRET` on Vercel/deployment platform.** This is the most common cause.
    2.  Verify `NEXTAUTH_URL` on Vercel/deployment platform.
    3.  Check **Runtime Logs** on Vercel (or your deployment platform) for specific error messages originating from `/api/auth/...`. The auth route includes a check for `NEXTAUTH_SECRET`.

*   **"Failed to fetch" errors on Login/Signup:**
    1.  Verify `NEXTAUTH_URL` is correct for your current environment (e.g., `http://localhost:9003` for local, your public Vercel URL for deployed).
    2.  Restart your dev server if you changed `.env.local`.

## Stripe Integration

Stripe is used for payments. The API route `src/app/api/stripe/create-checkout-session/route.ts` creates checkout sessions.

*   Ensure `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are correctly set for your environment.
*   The `RootLayout` checks for `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and logs a console error if missing.
*   The Stripe API route (`create-checkout-session`) logs an error if `STRIPE_SECRET_KEY` is missing.

## Genkit / Google AI Integration (Local Development)

For AI features using Genkit and Google AI (like Gemini):
*   **Local Setup:** Ensure you have run `gcloud auth application-default login` in your terminal and authenticated with a Google account that has access to your Google Cloud project with the Vertex AI API enabled. This sets up Application Default Credentials which Genkit uses locally.
*   **Deployed Setup:** In Google Cloud environments (e.g., Cloud Run), the service will run as a service account. This service account needs IAM permissions (e.g., "Vertex AI User" role) to access Google AI services.

## Deploying to Vercel

1.  Ensure your code is in a Git repository (GitHub, GitLab, Bitbucket).
2.  Import your project to Vercel.
3.  **Configure Environment Variables in Vercel Project Settings:**
    *   `NEXTAUTH_URL` (your Vercel deployment URL, e.g., `https://your-project.vercel.app`)
    *   `NEXTAUTH_SECRET` (your strong secret - **CRITICAL for build and runtime**)
    *   `STRIPE_SECRET_KEY`
    *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    *   If Vercel is not running on Google Cloud, you would need to configure authentication for Google Cloud services differently for Genkit (e.g., using a service account key JSON file, which is less ideal but possible, and setting `GOOGLE_APPLICATION_CREDENTIALS`). However, Vercel often can integrate with Google Cloud for project linking or service account impersonation if needed, but this is an advanced setup. For simplicity, ensure ADC works for local testing.
4.  Deploy and test. Check build logs and runtime logs on Vercel if issues arise.

## Google Cloud Build / Firebase Studio Prototype Environments

When using Firebase Studio prototypes or deploying directly via Google Cloud Build, your local `.env.local` file is **NOT** used.

*   **Required Variables:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
*   **Configuration:** These must be set directly within the Google Cloud settings for the build trigger or the target deployment service (e.g., Cloud Run). This might involve setting substitution variables, linking secrets from Google Secret Manager, or configuring environment variables on the Cloud Run service revision.
*   **`ENOENT ... app-build-manifest.json` or `Failed to collect page data ...` errors:**
    *   These build errors often mean critical environment variables (especially `NEXTAUTH_SECRET` for manifest errors, or `STRIPE_SECRET_KEY` for Stripe API route data collection errors) are not available to the build process or runtime environment.
    *   Ensure secrets are securely provided to your Google Cloud deployment. Refer to the "Troubleshooting NextAuth.js & Build Errors" section above for detailed steps on `NEXTAUTH_SECRET`.
*   **Genkit/Google AI:** The service account used by Cloud Build (for build-time steps if any AI is used there) or by the Cloud Run service (for runtime AI features) needs appropriate IAM permissions (e.g., "Vertex AI User") in your Google Cloud project.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.
