
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables for configuration, especially for sensitive API keys and application settings. **Incorrectly configured environment variables in your BUILD ENVIRONMENT (Vercel, Google Cloud Build for prototypes) are the most common cause of build failures (like "missing `app-build-manifest.json`") and runtime errors (like "client-side exception" or payment failures).**

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
If you previously used Firebase services and had environment variables like `NEXT_PUBLIC_FIREBASE_API_KEY`, etc., set on Vercel or Google Cloud Build, you can remove them. This helps keep your configuration clean but **will not fix NextAuth.js build errors like "missing app-build-manifest.json"**. Focus on `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for those build errors.

---

## TROUBLESHOOTING DEPLOYMENT ERRORS

### A. CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`, `/api/auth/...`)

This error means Next.js could **NOT** complete the build for that specific auth-related page. This is almost always because **NextAuth.js failed to initialize correctly during the build process.**

**PRIMARY CAUSES & SOLUTIONS:**

1.  **`NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the BUILD ENVIRONMENT.**
    *   **Why:** NextAuth.js **REQUIRES** `NEXTAUTH_SECRET` to be available and correct not only at runtime but also *during the `next build` process*.
    *   **The Secret Value:** Must be a strong, consistent, random string (e.g., generated via `openssl rand -base64 32`). **Use the SAME secret value across all environments for this project.**

2.  **`NEXTAUTH_URL` is INCORRECT for the BUILD ENVIRONMENT.**
    *   **Why:** NextAuth.js needs to know its own public address.
    *   **For Vercel:** **MUST** be the full public URL of THAT Vercel deployment (e.g., `https://www.pollitago.com` or `https://your-project.vercel.app`). **IT CANNOT BE `http://localhost:9003` ON VERCEL.**
    *   **For Firebase Studio Prototypes:** **MUST** be the full public URL of THAT specific prototype (e.g., `https://your-prototype-id.cloudworkstations.dev`). **IT CANNOT BE `http://localhost:9003` during the prototype's cloud build.**

**VERCEL DEPLOYMENT - MOST CRITICAL CHECKLIST:**
    *   Go to your Vercel Project Dashboard -> **Settings -> Environment Variables**.
    *   **1. `NEXTAUTH_SECRET`:**
        *   Does it exist?
        *   Is its value **EXACTLY** the strong, random string you generated? (Check for typos, extra spaces, or if it's accidentally empty. Copy-paste carefully.)
    *   **2. `NEXTAUTH_URL`:**
        *   Does it exist?
        *   Is its value the **full public URL of THAT Vercel deployment** (e.g., `https://www.pollitago.com`)?
    *   **3. Redeploy:** After confirming or changing these, **YOU MUST TRIGGER A NEW BUILD/DEPLOYMENT** on Vercel for the changes to take effect. Use the "Redeploy" option.

**FIREBASE STUDIO PROTOTYPES / GOOGLE CLOUD BUILD - MOST CRITICAL CHECKLIST:**
    *   These builds get their environment variables from the Google Cloud Build configuration.
    *   **1. `NEXTAUTH_SECRET`:**
        *   Ensure this is set as an environment variable (or substitution variable) in the Google Cloud Build trigger that Firebase Studio uses.
        *   The value must be **EXACTLY** your strong, random secret.
    *   **2. `NEXTAUTH_URL`:**
        *   Ensure this is set to the **prototype's full public URL** (e.g., `https://your-prototype-id.cloudworkstations.dev`) in the Google Cloud Build trigger.
    *   **How to set for Prototypes:** This can be tricky. If Firebase Studio doesn't offer a direct UI for build-time environment variables, you might need to:
        *   Go to Google Cloud Console -> Cloud Build -> Triggers.
        *   Find the trigger associated with your Firebase Studio prototype.
        *   Edit the trigger. Look for "Advanced" settings or "Substitution variables" / "Environment variables" sections to add/update `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.
    *   **3. Rebuild Prototype:** After making changes in Google Cloud Build, trigger a new build/deployment of your prototype from Firebase Studio.

**LOCAL DEVELOPMENT (If building locally with `npm run build` or seeing similar issues with `npm run dev`):**
    *   Ensure `.env.local` has correct values for `NEXTAUTH_SECRET` (your strong secret) and `NEXTAUTH_URL` (`http://localhost:9003`).
    *   Stop dev server, **delete the `.next` folder**, then run `npm run build` (to test build) or `npm run dev`.

### B. "Application error: a client-side exception has occurred" (Often on "New Poll" page when trying to pledge)

This usually means JavaScript code running in the browser encountered an unrecoverable error. For the "New Poll" page, it's often related to Stripe.js initialization.

**PRIMARY CAUSES & SOLUTIONS:**

1.  **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is MISSING or INCORRECT.**
    *   **Why:** This key is needed by the Stripe.js library loaded in the browser. If it's missing or wrong, Stripe.js can't initialize, and any code that depends on it (like your pledge input field logic) will break.
    *   **Check Browser Console:** Your application logs a "CRITICAL STRIPE ERROR" to the browser's Developer Tools Console if this key is not found or is empty when `src/app/layout.tsx` loads. Open the console (usually F12) and look for this message.
    *   **Local Development:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (your **TEST** key `pk_test_...`) is correctly set in `.env.local`. Restart your dev server.
    *   **Vercel Deployment:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (your **LIVE** key `pk_live_...` if it's production, or **TEST** key if it's a test deployment) is correctly set in Vercel Environment Variables. Redeploy after changes.
    *   **Firebase Studio Prototype:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (your **TEST** key `pk_test_...`) is set in the Google Cloud Build environment variables for the prototype. Rebuild the prototype.

2.  **Other JavaScript Errors:**
    *   Check the browser's Developer Console for any other JavaScript errors that might be occurring before or after the Stripe-related issue.

### C. General Login/Signup Runtime Failures ("Internal Server Error", "Failed to fetch")

These often occur after a successful build, but when the application is running.

1.  **Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in the RUNTIME environment.** (Same as build checks, but for the running application instance).
2.  Check **Runtime Logs** on Vercel (Functions tab) or Google Cloud Logging for your prototype. Your `/api/auth/[...nextauth]/route.ts` includes specific console errors if `NEXTAUTH_SECRET` is missing at runtime.

---
## Authentication with NextAuth.js
(Content remains largely the same, referring to the troubleshooting above)

## Stripe Integration
(Content remains largely the same, referring to the troubleshooting above)

## Genkit (AI Features)
(Content remains largely the same)

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project. If you previously had Firebase SDK environment variables set on Vercel or Google Cloud Build, you can remove them. This step is for tidiness and **will not fix NextAuth.js build errors like "missing app-build-manifest.json"**. Focus on `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for those build errors.

    