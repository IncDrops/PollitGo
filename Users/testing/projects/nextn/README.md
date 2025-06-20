
# Firebase Studio Project: PollitAGo

This is a NextJS starter in Firebase Studio.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables for configuration. **Incorrectly configured environment variables in your BUILD ENVIRONMENT (Google Cloud Build for prototypes) are the most common cause of build failures (like "missing `app-build-manifest.json`") and runtime errors (like "client-side exception" or payment failures).**

### For Local Development: `.env.local` File

You **MUST** create a `.env.local` file in the root of your project (at the same level as `package.json`). This file is listed in `.gitignore` and **should never be committed to version control.**

**Template for your `.env.local` file:**
```env
# NextAuth.js Variables - CRITICAL FOR LOGIN/SIGNUP AND BUILD STABILITY
# =====================================================================

# NEXTAUTH_URL: The base URL of your application for local development.
# If `npm run dev` runs on port 9003, this is http://localhost:9003. Adjust if different.
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# >>> Action Required: Generate ONE strong secret (see instructions below) and use it here AND in your Google Cloud Build trigger. <<<
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
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
    *   Use this **EXACT SAME SECRET** in `.env.local` AND in your Google Cloud Build trigger settings for prototypes.
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute **ALL** other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY_GOES_HERE`) with your **actual TEST keys**.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, you **MUST** restart your Next.js development server (`npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

---

## PRIMARY DEPLOYMENT: Firebase Studio Prototype (via Google Cloud Build)

This is the current focus for deploying and testing the application. The `.env.local` file is **NOT** used. You **MUST** configure environment variables directly through the Google Cloud Build trigger associated with your Firebase Studio prototype.

**Finding Your Prototype URL (Crucial for `_NEXTAUTH_URL`):**
When you launch or update a prototype in Firebase Studio, the interface will display its public URL. This URL typically ends in `.cloudworkstations.dev` or a similar Google Cloud domain (e.g., `https://your-prototype-name-randomstring.region.cloudworkstations.dev`).
1.  Launch/Update your prototype in Firebase Studio.
2.  Carefully copy the **full public URL** provided by Firebase Studio. This is what you'll use for `_NEXTAUTH_URL`.

**Setting Environment Variables in Google Cloud Build Trigger:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **Cloud Build > Triggers**.
3.  Find and **Edit** the trigger associated with your Firebase Studio prototype.
4.  Scroll down to the **"Advanced"** section and find **"Substitution variables"**.
5.  Click **"Add variable"** for each of the following:

    *   **Variable Name:** `_NEXTAUTH_URL`
        *   **Value:** Paste the **full public URL of THIS Firebase Studio prototype** you copied earlier.
        *   **Importance:** Critical for redirects, callbacks, and NextAuth.js. If incorrect or missing in the build, it can cause build failures and runtime errors.

    *   **Variable Name:** `_NEXTAUTH_SECRET`
        *   **Value:** Paste the **EXACT SAME strong, random secret string** you generated (e.g., via `openssl rand -base64 32`) and used in your `.env.local`.
        *   **Importance:** **PARAMOUNT for build success of auth pages (like `/login`, `/signup`) and for runtime security.** This is the #1 cause of "missing `app-build-manifest.json`" errors and the "NEXTAUTH_SECRET is missing" runtime error if not set correctly.

    *   **Variable Name:** `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
        *   **Value:** Your **TEST** Stripe Publishable Key (starts with `pk_test_...`).
        *   **Importance:** Required for client-side Stripe.js. If missing or incorrect, Stripe payment forms (like on the "New Poll" page) will break with a "client-side exception."

    *   **Variable Name:** `_STRIPE_SECRET_KEY`
        *   **Value:** Your **TEST** Stripe Secret Key (starts with `sk_test_...`).
        *   **Importance:** Required for backend Stripe API calls from your Next.js API routes.

6.  **Service Account (in the same Trigger settings):**
    *   For the "Service account" dropdown, it's generally recommended to select the **default Cloud Build service account**. This usually looks like `[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com`. This account typically has the necessary permissions to run builds.
    *   The *running prototype* (e.g., on Cloud Run) will need a service account with permissions for Google AI (like "Vertex AI User" role) for Genkit features to work. This is separate from the build service account.

7.  **Description and Tags (Optional):**
    *   **Description:** Add a brief note, e.g., "Builds PollitAGo Firebase Studio prototype".
    *   **Tags:** Optionally add tags like `firebase-studio`, `pollitago`, `prototype`. These are for your organization and don't affect the build.

8.  **Save the Trigger.**
9.  **Rebuild/Redeploy your prototype from Firebase Studio.** This will use the updated trigger settings.

---

## TROUBLESHOOTING PROTOTYPE ERRORS

### A. CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`)
### OR RUNTIME ERROR: `{"error": "Server misconfiguration: NEXTAUTH_SECRET is missing."}` on `/api/auth/...` routes

These errors mean NextAuth.js failed to initialize correctly, either during the build process or at runtime.

**PRIMARY CAUSE: `_NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the Google Cloud Build Trigger's Substitution Variables.**

**SOLUTION: GENERATE A NEW `NEXTAUTH_SECRET` AND APPLY IT EVERYWHERE (Local and Cloud Build)**

1.  **Generate ONE Strong Secret:**
    *   In your terminal, run: `openssl rand -base64 32`
    *   Copy the output. This is your **NEW, DEFINITIVE `NEXTAUTH_SECRET`**.

2.  **Update in `.env.local` (Local Development):**
    *   Replace the old `NEXTAUTH_SECRET` value with the new one.
    *   Restart your local dev server (`npm run dev`).

3.  **Update in Google Cloud Build Trigger (for Firebase Studio Prototypes):**
    *   Go to Google Cloud Console -> Cloud Build -> Triggers.
    *   Edit the trigger for your prototype.
    *   Under "Substitution variables", find/edit `_NEXTAUTH_SECRET`.
    *   Paste the **NEW** secret string. Ensure no extra spaces.
    *   **CRITICAL:** Also ensure `_NEXTAUTH_URL` is the **full public URL of THIS Firebase Studio prototype**.
    *   Save the trigger.

4.  **REBUILD/REDEPLOY PROTOTYPE:**
    *   Launch/rebuild/redeploy the prototype from Firebase Studio.

**SECONDARY CAUSE (Also Critical): `_NEXTAUTH_URL` is INCORRECT for the Build/Runtime Environment.**
    *   Ensure `_NEXTAUTH_URL` in the Cloud Build trigger is the correct public URL for the specific prototype instance.

### B. "Application error: a client-side exception has occurred" (Often on "New Poll" page when trying to pledge)

This usually means JavaScript code running in the browser encountered an unrecoverable error, often related to Stripe.js initialization.

**PRIMARY CAUSES & SOLUTIONS:**

1.  **`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is MISSING or INCORRECT in the Cloud Build Trigger.**
    *   **Check Browser Console:** Look for "CRITICAL STRIPE ERROR" messages on the deployed prototype. The error message comes from `src/app/layout.tsx` if the key is missing.
    *   **Cloud Build Trigger:** Ensure `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set to your correct **TEST** key (`pk_test_...`) in the substitution variables. Redeploy/Rebuild.

---

## Authentication with NextAuth.js

This application uses NextAuth.js. The `src/app/api/auth/[...nextauth]/route.ts` file handles authentication requests.
*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** `test@example.com` / `password`.
    *   **Simulated Signup:** The `authorize` function currently allows any new email/password to "sign up."

## Stripe Integration

Stripe is used for payments. Ensure `_STRIPE_SECRET_KEY` (test secret key) and `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test publishable key) are set in your Google Cloud Build trigger for prototype deployments.

## Genkit (AI Features)

For local development, Genkit uses Application Default Credentials (`gcloud auth application-default login`). For deployed prototypes, the runtime service account of your Cloud Run instance (managed by Firebase Studio) needs IAM permissions for Google AI services (e.g., "Vertex AI User" role).

---

## Deprecated: Vercel Deployment

Deployment via Vercel is currently not the primary focus. If you choose to use Vercel in the future, you will need to configure similar environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`) in your Vercel project settings. The troubleshooting principles for Vercel are similar to those for Google Cloud Build, focusing on ensuring the correct variables are available to Vercel's build and runtime environments.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.
