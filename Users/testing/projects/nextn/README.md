
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
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# 1. Generate ONE strong secret: In your terminal, run `openssl rand -base64 32`.
# 2. Copy the output. This is your single NEXTAUTH_SECRET for this project.
# 3. Use this EXACT SAME secret in .env.local AND in your Vercel/Cloud Build environment variables.
# THIS IS THE MOST COMMON CAUSE OF BUILD ERRORS LIKE "ENOENT: no such file or directory, open '...app-build-manifest.json'"
# for pages like /login or /signup if it's missing or incorrect in the BUILD ENVIRONMENT.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_THE_ONE_STRONG_RANDOM_SECRET_YOU_GENERATED

# Stripe Keys - CRITICAL FOR PAYMENTS (Use TEST keys for local development)
# ========================================================================
# Verify these Test Keys in your Stripe Dashboard (Developers > API Keys, "View test data" ON)

# STRIPE_SECRET_KEY: Your Stripe *Test* Secret Key (starts with sk_test_...).
# Used by backend API routes.
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY_GOES_HERE

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe *Test* Publishable Key (starts with pk_test_...).
# Used by client-side Stripe.js.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_TEST_PUBLISHABLE_KEY_GOES_HERE

# Google Cloud & Genkit (for AI Features) - Local Development Note
# =================================================================
# For local development, Genkit (which uses Google AI) relies on Application Default Credentials (ADC).
# You typically set this up ONCE on your machine by running:
# gcloud auth application-default login
# This means you usually DO NOT need to put Google Cloud project IDs or service account keys
# directly into this .env.local file for Genkit to work locally.
# Deployed environments (like Google Cloud Run) will use service account permissions.
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`.
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute **ALL** other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY_GOES_HERE`) with your **actual TEST keys**.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, you **MUST** restart your Next.js development server (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration. The **FOUR CRUCIAL** variables are:

*   **`NEXTAUTH_URL`**:
    *   **Value:** Set to the **full public URL of that specific deployment**.
        *   **For Vercel (e.g., `www.pollitago.com`):** This **MUST BE** `https://www.pollitago.com` (or your actual Vercel domain, e.g., `https://your-project-name.vercel.app`). **It CANNOT be `http://localhost:9003` on Vercel.**
        *   **For Firebase Studio Prototypes (Google Cloud Build):** This **MUST BE** the full public URL of your prototype (e.g., `https://your-prototype-id.cloudworkstations.dev`). **It CANNOT be `http://localhost:9003` during the prototype's cloud build.**
    *   **Importance:** Critical for redirects, callbacks, and NextAuth.js to know its own address. **An incorrect `NEXTAUTH_URL` in the build environment can lead to build errors like "missing `app-build-manifest.json`".**

*   **`NEXTAUTH_SECRET`**:
    *   **Value:** Set to the **EXACT SAME strong, random secret** you generated and used in `.env.local`.
    *   **Importance:** **Paramount for build success of auth pages (like `/login`, `/signup`).** Double-check for typos or extra spaces when pasting. This is the most common cause of "missing `app-build-manifest.json`" errors.

*   **`STRIPE_SECRET_KEY`**:
    *   **Value:**
        *   **For LIVE Production (e.g., `www.pollitago.com` if it's your live site):** Your **LIVE** Stripe Secret Key (starts with `sk_live_...`).
        *   **For Test/Staging Deployments (including Firebase Studio Prototypes):** Your **TEST** Stripe Secret Key (starts with `sk_test_...`).
    *   **Importance:** Required for backend Stripe API calls. Mismatching test/live keys with the environment's purpose can cause payment issues or prevent testing.

*   **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**:
    *   **Value:**
        *   **For LIVE Production:** Your **LIVE** Stripe Publishable Key (starts with `pk_live_...`).
        *   **For Test/Staging Deployments:** Your **TEST** Stripe Publishable Key (starts with `pk_test_...`).
    *   **Importance:** Required for client-side Stripe.js. If missing or incorrect for the environment, Stripe payment forms will break (potentially causing the "client-side exception" on the "New Poll" page). The app logs a "CRITICAL STRIPE ERROR" to the browser console if this is missing.

**Verifying Stripe Keys:**
Before assuming your keys "stopped working", always verify them in your Stripe Dashboard:
1.  Log into Stripe.
2.  Toggle **"View test data"** ON (for test keys) or OFF (for live keys).
3.  Go to **Developers > API keys**.
4.  Compare the Publishable and Secret keys shown with what you have set in your environment variables. Ensure they match exactly.

**Google Cloud Project (for Genkit/AI):** In deployed Google Cloud environments, the project ID is often automatically available. The service account running your application needs appropriate IAM permissions.

**Cleaning Up Old Firebase Variables (if applicable):**
If you previously used Firebase services and had environment variables like `NEXT_PUBLIC_FIREBASE_API_KEY`, etc., set on Vercel or Google Cloud Build, you can remove them. This helps keep your configuration clean but **will not fix NextAuth.js build errors.**

**Consequences of Missing Critical Environment Variables in Deployed/Build Environments:**

*   **Missing or Incorrect `NEXTAUTH_SECRET`:** **Build Failure** (missing manifest for `/login`, `/signup`), Runtime Auth Failure.
*   **Missing or Incorrect `NEXTAUTH_URL` (e.g., `localhost` on Vercel/Prototypes):** **Build Failure** (can contribute to missing manifests), Runtime Auth Failure ("Failed to fetch", bad redirects).
*   **Missing `STRIPE_SECRET_KEY`:** Runtime payment failure. Build failure is less common now but possible.
*   **Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:** Client-side Stripe failure (payment forms break). This is a likely cause for the "client-side exception" on the New Poll page if the key isn't available to the browser.

## Authentication with NextAuth.js
(Content remains largely the same)

### Troubleshooting NextAuth.js & Build Errors

*   **CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`, `/api/auth/...`)**
    This error means Next.js could not complete the build for that specific page, often because of instability in NextAuth.js initialization during the build.

    1.  **PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the BUILD ENVIRONMENT.**
        *   NextAuth.js **requires** `NEXTAUTH_SECRET` to be available not only at runtime but also *during the `next build` process*.
        *   The secret must be a **strong, consistent, random string**.
        *   **Generate ONE secret and use that SAME value everywhere for this project.**

    2.  **SECONDARY CAUSE: `NEXTAUTH_URL` is INCORRECT in the BUILD ENVIRONMENT.**
        *   For **Vercel deployments**, `NEXTAUTH_URL` **MUST** be the full public URL of your Vercel deployment (e.g., `https://www.pollitago.com`). **It CANNOT be `http://localhost:9003` on Vercel.**
        *   For **Firebase Studio Prototypes (Google Cloud Build)**, `NEXTAUTH_URL` **MUST** be the full public URL of that specific prototype (e.g., `https://your-prototype-id.cloudworkstations.dev`). **It CANNOT be `http://localhost:9003` during the prototype's cloud build.**

    3.  **VERCEL DEPLOYMENT - MOST CRITICAL CHECKLIST:**
        *   Go to your Vercel Project Dashboard -> **Settings -> Environment Variables**.
        *   **Meticulously check `NEXTAUTH_SECRET`:**
            *   Does it exist? Is its value **EXACTLY** the strong, random string you generated (no typos, no extra spaces, not empty)?
        *   **Meticulously check `NEXTAUTH_URL`:**
            *   Does it exist? Is its value the **full public URL of THAT Vercel deployment** (e.g., `https://www.pollitago.com`)?
        *   **Also check `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`** are correct for the intended environment (test keys for test deployments, live keys for live production).

    4.  **FIREBASE STUDIO PROTOTYPES / GOOGLE CLOUD BUILD - MOST CRITICAL CHECKLIST:**
        *   These builds need environment variables set in their Google Cloud Build configuration.
        *   **Crucial Variables for Google Cloud Build:** `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (prototype's public URL), `STRIPE_SECRET_KEY` (TEST key), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (TEST key).
        *   How to set them: Firebase Studio settings for prototypes or Google Cloud Console -> Cloud Build -> Triggers -> Edit Trigger -> Advanced -> Substitution/Environment variables.

    5.  **LOCAL DEVELOPMENT (if building locally with `npm run build` or seeing issues with `npm run dev`):**
        *   Ensure `.env.local` has correct values for `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (localhost), `STRIPE_SECRET_KEY` (test), `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test).
        *   Stop dev server, **delete the `.next` folder**, then run `npm run build` or `npm run dev`.

    6.  **REDEPLOY (Vercel/Cloud Build):** After confirming/setting environment variables, **trigger a new build/deployment**.

*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    1.  Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` on Vercel/deployment platform.
    2.  Check Runtime Logs.

*   **"Failed to fetch" errors on Login/Signup:**
    1.  Verify `NEXTAUTH_URL` is correct for your current environment.
    2.  Restart dev server if you changed `.env.local`.

## Client-Side Exception on "New Poll" Page (`pollitago is not defined` or similar)

If you see "Application error: a client-side exception has occurred" or "Stripe is not available for pledges" on the "New Poll" page:

1.  **Open Browser Developer Tools (Console tab).**
2.  **Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**:
    *   Ensure this is correctly set in your `.env.local` (for local) AND in your Vercel / Google Cloud Build environment variables for the deployed version. It must be the correct **test key** for local/prototypes/test deployments, and **live key** for live production.
    *   The `src/app/layout.tsx` logs a "CRITICAL STRIPE ERROR" to the browser console if this key is not found or empty when the page loads.
    *   If Stripe.js fails to load, other dependent JavaScript might error out, or the pledge input might be disabled when it shouldn't be.
3.  **Test in Incognito/Private Browsing Mode:** This can rule out browser extensions causing the "pollitago is not defined" error.
4.  **Share the Console Error:** The exact error message from the console is crucial.

## Stripe Integration, Genkit, Deploying to Vercel, Google Cloud Build Sections
(Content for these sections remains largely the same as previously provided, emphasizing the need for corresponding environment variables in deployed settings.)

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project. If you previously had Firebase SDK environment variables set on Vercel or Google Cloud Build, you can remove them. This step is for tidiness and **will not fix NextAuth.js build errors like "missing app-build-manifest.json"**. Focus on `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for those build errors.
```
