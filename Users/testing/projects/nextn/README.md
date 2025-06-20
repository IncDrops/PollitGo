
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

# Firebase Configuration - REQUIRED FOR FIREBASE SERVICES (Storage, Firestore, etc.)
# ==================================================================================
# Get these values from your Firebase project settings:
# Firebase Console > Project Overview (click the gear icon) > Project settings > General tab > Your apps > SDK setup and configuration (select "Config" radio button).
# Prefix with NEXT_PUBLIC_ to make them available to the client-side browser environment.
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

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
    *   Use this **EXACT SAME SECRET** in `.env.local` AND in your Google Cloud Build trigger settings for prototypes.
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute **ALL** other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY_GOES_HERE`, `YOUR_FIREBASE_API_KEY`) with your **actual TEST keys and Firebase project configuration values**.
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
5.  Click **"Add variable"** for each of the following (ensure variable names start with an underscore `_` as per Cloud Build convention for user-defined substitutions that are then mapped to runtime environment variables):

    *   **Variable Name:** `_NEXTAUTH_URL`
        *   **Value:** Paste the **full public URL of THIS Firebase Studio prototype** you copied earlier.
        *   **Importance:** Critical for redirects, callbacks, and NextAuth.js.

    *   **Variable Name:** `_NEXTAUTH_SECRET`
        *   **Value:** Paste the **EXACT SAME strong, random secret string** you generated (e.g., via `openssl rand -base64 32`) and used in your `.env.local`.
        *   **Importance:** **PARAMOUNT for build success and runtime security.** This is the #1 cause of "missing `app-build-manifest.json`" errors and the "NEXTAUTH_SECRET is missing" runtime error.

    *   **Variable Name:** `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
        *   **Value:** Your **TEST** Stripe Publishable Key (starts with `pk_test_...`).
        *   **Importance:** Required for client-side Stripe.js.

    *   **Variable Name:** `_STRIPE_SECRET_KEY`
        *   **Value:** Your **TEST** Stripe Secret Key (starts with `sk_test_...`).
        *   **Importance:** Required for backend Stripe API calls.

    *   **Firebase Variables:** Add each of your Firebase project config keys here, prefixed with `_NEXT_PUBLIC_FIREBASE_`. For example:
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_API_KEY`
            *   **Value:** YOUR_FIREBASE_API_KEY
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
            *   **Value:** YOUR_FIREBASE_AUTH_DOMAIN
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_PROJECT_ID`
            *   **Value:** YOUR_FIREBASE_PROJECT_ID
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
            *   **Value:** YOUR_FIREBASE_STORAGE_BUCKET
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
            *   **Value:** YOUR_FIREBASE_MESSAGING_SENDER_ID
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_APP_ID`
            *   **Value:** YOUR_FIREBASE_APP_ID
        *   **Variable Name:** `_NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`  (Optional)
            *   **Value:** YOUR_FIREBASE_MEASUREMENT_ID
        *   **Importance:** Required for Firebase SDK to connect to your project.

6.  **Service Account (in the same Trigger settings):**
    *   Ensure the Cloud Build service account (`[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com`) has necessary permissions.
    *   The *running prototype* (e.g., on Cloud Run) will need a service account with permissions for Google AI (like "Vertex AI User" role) for Genkit features and potentially permissions for Firebase services if accessed from the backend.

7.  **Save the Trigger.**
8.  **Rebuild/Redeploy your prototype from Firebase Studio.** This will use the updated trigger settings.

---

## TROUBLESHOOTING PROTOTYPE ERRORS

### A. CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'`
### OR RUNTIME ERROR: `{"error": "Server misconfiguration: NEXTAUTH_SECRET is missing."}`

**PRIMARY CAUSE: `_NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the Google Cloud Build Trigger.**

**SOLUTION: GENERATE A NEW `NEXTAUTH_SECRET` AND APPLY IT EVERYWHERE (Local and Cloud Build)**
1.  **Generate ONE Strong Secret:** `openssl rand -base64 32`
2.  **Update in `.env.local`**.
3.  **Update in Google Cloud Build Trigger (`_NEXTAUTH_SECRET`)**. Ensure `_NEXTAUTH_URL` is also correct.
4.  **REBUILD/REDEPLOY PROTOTYPE** from Firebase Studio.

### B. "Application error: a client-side exception has occurred" (Often on "New Poll" page or when Stripe should load)

**PRIMARY CAUSES & SOLUTIONS:**
1.  **`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is MISSING or INCORRECT in the Cloud Build Trigger.**
    *   Check Browser Console for "CRITICAL STRIPE ERROR".
    *   Verify the key in Cloud Build Trigger and Redeploy.
2.  **Firebase SDK Initialization Failure (if using Firebase features on the client):**
    *   Ensure all `_NEXT_PUBLIC_FIREBASE_...` variables are correctly set in the Cloud Build Trigger.
    *   Check Browser Console for Firebase-related errors (e.g., "Firebase: Error (auth/invalid-api-key)" or issues connecting to Firestore/Storage). The file `src/lib/firebase.ts` logs specific errors if core Firebase config keys are missing.

---

## Authentication with NextAuth.js

This application uses NextAuth.js. Ensure `_NEXTAUTH_URL` and `_NEXTAUTH_SECRET` are correctly set in your deployment environment.

## Stripe Integration

Stripe is used for payments. Ensure `_STRIPE_SECRET_KEY` (test secret key) and `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test publishable key) are set.

## Firebase Integration

Firebase SDK is initialized in `src/lib/firebase.ts`. To use Firebase services (like Storage, Firestore):
1.  **Obtain Firebase Project Configuration:**
    *   Go to your [Firebase Console](https://console.firebase.google.com/).
    *   Select your project.
    *   Click the **Gear icon** (Project settings) next to "Project Overview".
    *   In the "General" tab, scroll down to "Your apps".
    *   If you don't have a Web app (`</>`), create one.
    *   Find the "SDK setup and configuration" section and select the **"Config"** radio button.
    *   You will see an object like `const firebaseConfig = { apiKey: "...", authDomain: "...", ... };`. These are the values you need.
2.  **Set Environment Variables:**
    *   Add these values to your `.env.local` file (for local development) and to your Google Cloud Build trigger's "Substitution variables" (for prototype deployment), ensuring you use the correct prefixes as detailed in the sections above (`NEXT_PUBLIC_FIREBASE_...` for `.env.local`, and `_NEXT_PUBLIC_FIREBASE_...` for Cloud Build).

## Genkit (AI Features)

For local development, Genkit uses Application Default Credentials (`gcloud auth application-default login`). For deployed prototypes, the runtime service account needs IAM permissions for Google AI services.

---

## Deprecated: Vercel Deployment

Deployment via Vercel is currently not the primary focus. If you choose to use Vercel in the future, you will need to configure similar environment variables in your Vercel project settings.
The Vercel environment variable names would typically be:
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ... and so on for all Firebase config keys.
Ensure they are set in Vercel Project Settings > Environment Variables and that you redeploy after any changes.
```