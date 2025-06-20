
# Firebase Studio Project: PollitAGo

This is a NextJS starter in Firebase Studio.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables for configuration. **Incorrectly configured environment variables in your BUILD ENVIRONMENT (Google Cloud Build for prototypes) are the most common cause of build failures (like "missing `app-build-manifest.json`" or "Firebase is blocking Next") and runtime errors (like "client-side exception", "Stripe checkout session missing").**

### For Local Development: `.env.local` File (Project Root)

You **MUST** create a **single** `.env.local` file in the **ROOT of your project folder** (at the same level as `package.json` and `next.config.ts`). This is the *only* `.env.local` file Next.js will read.

**Path to the correct `.env.local` file:** `Users/testing/projects/nextn/.env.local`

This file is listed in `.gitignore` and **should never be committed to version control.**

**Template for your ROOT `.env.local` file:**
```env
# NextAuth.js Variables - CRITICAL FOR LOGIN/SIGNUP AND BUILD STABILITY
# =====================================================================

# NEXTAUTH_URL: The base URL of your application for local development.
# If `npm run dev` runs on port 9003, this is http://localhost:9003. Adjust if different.
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# >>> Action Required: Generate ONE strong secret (see instructions below) and use it here AND in your Google Cloud Build trigger. <<<
NEXTAUTH_SECRET=REPLACE_THIS_WITH_THE_ONE_STRONG_RANDOM_SECRET_YOU_GENERATED

# Stripe Keys - FOR LOCAL DEVELOPMENT, USE YOUR STRIPE *TEST* KEYS
# ========================================================================
# Verify these Test Keys in your Stripe Dashboard (Developers > API Keys, "View test data" ON)

# STRIPE_SECRET_KEY: Your Stripe *Test* Secret Key (starts with sk_test_...).
# Used by backend API routes.
STRIPE_SECRET_KEY=YOUR_STRIPE_TEST_SECRET_KEY_GOES_HERE

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe *Test* Publishable Key (starts with pk_test_...).
# Used by client-side Stripe.js.
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_TEST_PUBLISHABLE_KEY_GOES_HERE

# Firebase Configuration - REQUIRED IF USING FIREBASE SERVICES (Storage, Firestore, etc.)
# ==================================================================================
# Get these values from your Firebase project settings:
# Firebase Console > Project Overview (click the gear icon) > Project settings > General tab > Your apps > SDK setup and configuration (select "Config" radio button).
# Prefix with NEXT_PUBLIC_ to make them available to the client-side browser environment.
# IMPORTANT: Do NOT wrap these values in quotation marks.
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # Optional, for Google Analytics

# Google Cloud & Genkit (for AI Features) - Local Development Note
# =================================================================
# For local development, Genkit (which uses Google AI) relies on Application Default Credentials (ADC).
# You typically set this up ONCE on your machine by running:
# gcloud auth application-default login
# This means you usually DO NOT need to put Google Cloud project IDs or service account keys
# directly into this .env.local file for Genkit to work locally.
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Location:** Ensure this file is at the **project root** (`Users/testing/projects/nextn/.env.local`).
2.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
    *   Use this **EXACT SAME SECRET** in `.env.local` AND in your Google Cloud Build trigger settings for prototypes.
3.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` with the value you just generated.
    *   Substitute **ALL** other placeholder values (e.g., `YOUR_STRIPE_TEST_SECRET_KEY_GOES_HERE`, `YOUR_FIREBASE_API_KEY`) with your **actual TEST keys (for Stripe) and Firebase project configuration values**.
    *   **Crucially, do NOT wrap these values in quotation marks.** For example, `NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...` is correct, not `NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."`.
4.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts.
5.  **Restart Dev Server:** After creating or modifying your root `.env.local`, you **MUST** restart your Next.js development server (`npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

---

## PRIMARY DEPLOYMENT: Firebase Studio Prototype (via Google Cloud Build)

This is the current focus for deploying and testing the application. The `.env.local` file is **NOT** used for these deployed prototypes. You **MUST** configure environment variables directly through the Google Cloud Build trigger associated with your Firebase Studio prototype.

**Finding Your Prototype URL (Crucial for `_NEXTAUTH_URL`):**
When you launch or update a prototype in Firebase Studio, the interface will display its public URL. This URL typically ends in `.cloudworkstations.dev` or a similar Google Cloud domain.
1.  Launch/Update your prototype in Firebase Studio.
2.  Carefully copy the **full public URL** provided by Firebase Studio. This is what you'll use for `_NEXTAUTH_URL`.

**Setting Environment Variables in Google Cloud Build Trigger:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **Cloud Build > Triggers**.
3.  Find and **Edit** the trigger associated with your Firebase Studio prototype.
4.  Scroll down to the **"Advanced"** section and find **"Substitution variables"**.
5.  Click **"Add variable"** for each of the following (ensure variable names start with an underscore `_` as per Cloud Build convention).
    *   **IMPORTANT: When pasting values, do NOT wrap them in quotation marks.**

    *   **Variable Name:** `_NEXTAUTH_URL`
        *   **Value:** Paste the **full public URL of THIS Firebase Studio prototype** you copied earlier.
        *   **Importance:** Critical for redirects, callbacks, and NextAuth.js.

    *   **Variable Name:** `_NEXTAUTH_SECRET`
        *   **Value:** Paste the **EXACT SAME strong, random secret string** you generated (e.g., via `openssl rand -base64 32`) and used in your (correctly configured root) `.env.local`.
        *   **Importance:** **PARAMOUNT for build success and runtime security.** This is the #1 cause of "missing `app-build-manifest.json`" errors and "NEXTAUTH_SECRET is missing" runtime errors.

    *   **Stripe LIVE Keys for Deployed Prototype:**
        *   **Variable Name:** `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
            *   **Value:** Your **LIVE** Stripe Publishable Key (starts with `pk_live_...`).
            *   **Importance:** Required for client-side Stripe.js in the deployed app.
        *   **Variable Name:** `_STRIPE_SECRET_KEY`
            *   **Value:** Your **LIVE** Stripe Secret Key (starts with `sk_live_...`).
            *   **Importance:** Required for backend Stripe API calls in the deployed app.

    *   **Firebase Variables (MANDATORY IF USING FIREBASE SERVICES):**
        *   If you are using any Firebase services (e.g., Firebase Storage for image uploads), these variables are **MANDATORY** for the deployed prototype. Missing or incorrect Firebase config can lead to build failures (e.g., "Firebase is blocking Next") or runtime errors.
        *   Add each of your Firebase project config keys here, prefixed with `_NEXT_PUBLIC_FIREBASE_`. For example:
            *   `_NEXT_PUBLIC_FIREBASE_API_KEY` (Value: YOUR_FIREBASE_API_KEY)
            *   `_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` (Value: YOUR_FIREBASE_AUTH_DOMAIN)
            *   `_NEXT_PUBLIC_FIREBASE_PROJECT_ID` (Value: YOUR_FIREBASE_PROJECT_ID)
            *   `_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (Value: YOUR_FIREBASE_STORAGE_BUCKET)
            *   `_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` (Value: YOUR_FIREBASE_MESSAGING_SENDER_ID)
            *   `_NEXT_PUBLIC_FIREBASE_APP_ID` (Value: YOUR_FIREBASE_APP_ID)
            *   `_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (Optional, Value: YOUR_FIREBASE_MEASUREMENT_ID)
        *   **If you are certain you are NOT using any Firebase services, you can omit these. However, the current `src/lib/firebase.ts` attempts to initialize the SDK, which will fail gracefully but might log console errors if these are missing.**

6.  **Service Account (in the same Trigger settings):**
    *   Ensure the selected service account for the trigger (e.g., `firebase-app-hosting-compute@pollitago.iam.gserviceaccount.com` or the default Cloud Build service account) has necessary permissions (Cloud Build Service Agent, Cloud Run Admin, Service Account User if deploying as another SA).
    *   The *running prototype* (e.g., on Cloud Run) will need a service account with permissions for Google AI (like "Vertex AI User" role) for Genkit features and potentially permissions for Firebase services (like "Firebase Storage User") if accessed from the backend or client.

7.  **Save the Trigger.**
8.  **Rebuild/Redeploy your prototype from Firebase Studio.** This will use the updated trigger settings.

---

## TROUBLESHOOTING PROTOTYPE ERRORS

### A. BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'`
### OR RUNTIME ERROR: `{"error": "Server misconfiguration: NEXTAUTH_SECRET is missing."}`

**PRIMARY CAUSE: `_NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the Google Cloud Build Trigger.** (Or `_NEXTAUTH_URL` is missing/incorrect, also impacting builds).

**SOLUTION: GENERATE A NEW `NEXTAUTH_SECRET` AND APPLY IT EVERYWHERE (Local and Cloud Build)**
1.  **Generate ONE Strong Secret:** `openssl rand -base64 32`
2.  **Update in your ROOT `.env.local`** (no quotes).
3.  **Update in Google Cloud Build Trigger (`_NEXTAUTH_SECRET`)** (no quotes). Ensure `_NEXTAUTH_URL` is also correct (full public URL of the prototype, no quotes).
4.  **REBUILD/REDEPLOY PROTOTYPE** from Firebase Studio.

### B. "Application error: a client-side exception has occurred" / "Stripe checkout session is missing" / Payment Failures

**PRIMARY CAUSES & SOLUTIONS:**
1.  **Stripe Keys (`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `_STRIPE_SECRET_KEY`) are MISSING or INCORRECT (using TEST instead of LIVE, or vice-versa) in the Cloud Build Trigger.**
    *   Verify the keys in Cloud Build Trigger (no quotes) are your **LIVE** keys.
    *   Check Browser Console for "CRITICAL STRIPE ERROR" (if publishable key is bad on client).
    *   Check Cloud Run logs for errors from `/api/stripe/create-checkout-session` (if secret key is bad on server).
    *   Redeploy after fixing.

### C. BUILD ERROR or RUNTIME ERROR: "Firebase is blocking Next" / Firebase SDK initialization failures

**PRIMARY CAUSE: `_NEXT_PUBLIC_FIREBASE_...` variables are MISSING or INCORRECT in the Google Cloud Build Trigger.**

**SOLUTION:**
1.  **Verify ALL Firebase Configuration Variables:** Go to your Firebase project settings (Project Overview > Project settings > General > Your apps > SDK setup and configuration - "Config").
2.  **In Google Cloud Build Trigger > Substitution variables:**
    *   Ensure you have **ALL** the required Firebase config variables added, each prefixed with `_NEXT_PUBLIC_FIREBASE_` (e.g., `_NEXT_PUBLIC_FIREBASE_API_KEY`, `_NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.).
    *   Double-check that the values pasted are **EXACTLY** correct and **DO NOT HAVE QUOTATION MARKS** around them.
    *   The `src/lib/firebase.ts` file attempts to initialize the SDK. If these keys are missing or wrong in the build environment, the build can fail, or the deployed app will have runtime errors when trying to use Firebase services (like Storage).
3.  **REBUILD/REDEPLOY PROTOTYPE** from Firebase Studio after confirming.

---

## Authentication with NextAuth.js

This application uses NextAuth.js. Ensure `_NEXTAUTH_URL` and `_NEXTAUTH_SECRET` are correctly set in your deployment environment.

## Stripe Integration

Stripe is used for payments.
- For **local development**, use your **TEST** keys in `.env.local`.
- For **deployed prototypes**, use your **LIVE** keys (`_STRIPE_SECRET_KEY` and `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) in the Google Cloud Build trigger.

## Firebase Integration

Firebase SDK is initialized in `src/lib/firebase.ts`. If you use Firebase services (like Storage, Firestore):
1.  Obtain Firebase Project Configuration values.
2.  Set these in your **ROOT `.env.local` file** (for local development) and in your Google Cloud Build trigger's "Substitution variables" (for prototype deployment), using prefixes `NEXT_PUBLIC_FIREBASE_...` for `.env.local`, and `_NEXT_PUBLIC_FIREBASE_...` for Cloud Build. **Do not use quotation marks.**
3.  If you are **not** using any Firebase services, you can consider removing `src/lib/firebase.ts` and the `firebase` dependency from `package.json` to simplify.

## Genkit (AI Features)

For local development, Genkit uses Application Default Credentials (`gcloud auth application-default login`). For deployed prototypes, the runtime service account needs IAM permissions for Google AI services.

---

## Vercel Deployment (Currently Not Focused)

This section remains for informational purposes if you decide to deploy to Vercel later. You would configure similar environment variables (using LIVE keys for production) in Vercel Project Settings.
