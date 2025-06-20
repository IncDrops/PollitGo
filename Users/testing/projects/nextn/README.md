
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
# >>> Action Required: Generate ONE strong secret (see instructions below) and use it here AND in ALL deployment environments. <<<
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
# Deployed environments (like Google Cloud Run for prototypes) will use service account permissions.
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`.
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
    *   Use this **EXACT SAME SECRET** in `.env.local`, in your Vercel Project Settings, AND in your Google Cloud Build trigger settings for prototypes.
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute **ALL** other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_TEST_SECRET_KEY_GOES_HERE`) with your **actual TEST keys**.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, you **MUST** restart your Next.js development server (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration.

**The Four CRUCIAL Variables for ALL Deployed/Build Environments:**

1.  **`NEXTAUTH_SECRET`**
    *   **Value:** The **EXACT SAME strong, random secret string** you generated (e.g., via `openssl rand -base64 32`) and used in your `.env.local`.
    *   **Importance:** **PARAMOUNT for build success of auth pages (like `/login`, `/signup`) and for runtime security.**
        *   **Vercel:** Set in Project Settings -> Environment Variables.
        *   **Firebase Studio Prototype (Google Cloud Build):** Set as a Substitution Variable in the Cloud Build trigger configuration (e.g., `_NEXTAUTH_SECRET`).
    *   **This is the #1 cause of "missing `app-build-manifest.json`" errors and the "NEXTAUTH_SECRET is missing" runtime error if not set correctly in the build/deployment environment.**

2.  **`NEXTAUTH_URL`**
    *   **Value:** The **full public URL of THAT SPECIFIC deployment environment.**
        *   **For Vercel (e.g., `www.pollitago.com`):** This **MUST BE** `https://www.pollitago.com` (or your actual Vercel domain, e.g., `https://your-project-name.vercel.app`). **It CANNOT be `http://localhost:9003` on Vercel.**
        *   **For Firebase Studio Prototypes (Google Cloud Build):**
            *   **Find Your Prototype URL:** When you launch a prototype in Firebase Studio, the interface will display its public URL (e.g., `https://your-prototype-id-random-string.region.cloudworkstations.dev`). This URL is unique to your prototype instance.
            *   Set this **full public URL of your prototype** in the Google Cloud Build trigger configuration (e.g., as `_NEXTAUTH_URL`). **It CANNOT be `http://localhost:9003` during the prototype's cloud build.**
    *   **Importance:** Critical for redirects, callbacks, and NextAuth.js to know its own address. An incorrect `NEXTAUTH_URL` in the build environment can also contribute to build errors and will cause runtime failures.

3.  **`STRIPE_SECRET_KEY`**
    *   **Value:**
        *   **For LIVE Production (e.g., `www.pollitago.com` if it's your live site):** Your **LIVE** Stripe Secret Key (starts with `sk_live_...`).
        *   **For Test/Staging Deployments (including Firebase Studio Prototypes):** Your **TEST** Stripe Secret Key (starts with `sk_test_...`).
    *   **Importance:** Required for backend Stripe API calls.

4.  **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**
    *   **Value:**
        *   **For LIVE Production:** Your **LIVE** Stripe Publishable Key (starts with `pk_live_...`).
        *   **For Test/Staging Deployments (including Firebase Studio Prototypes):** Your **TEST** Stripe Publishable Key (starts with `pk_test_...`).
    *   **Importance:** Required for client-side Stripe.js. If missing or incorrect, Stripe payment forms will break.

**Verifying Stripe Keys:**
Always verify your Stripe keys in your Stripe Dashboard:
1.  Log into Stripe.
2.  Toggle **"View test data"** ON (for test keys) or OFF (for live keys).
3.  Go to **Developers > API keys**.
4.  Compare keys with what you have set in your environment variables.

**Google Cloud Project & Service Account (for Genkit/AI in Prototypes):**
*   **Cloud Build Service Account:** For the Google Cloud Build trigger, you can typically use the **default Cloud Build service account** (`[PROJECT_NUMBER]@cloudbuild.gserviceaccount.com`).
*   **Runtime Service Account for Genkit:** The *running prototype application* needs an identity (a service account) with permissions for Google AI services (e.g., **"Vertex AI User"** IAM role).

---

## TROUBLESHOOTING DEPLOYMENT ERRORS

### A. CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`)
### OR RUNTIME ERROR: `{"error": "Server misconfiguration: NEXTAUTH_SECRET is missing."}` on `/api/auth/...` routes

These errors mean NextAuth.js failed to initialize correctly, either during the build process or at runtime.

**PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the Build/Runtime Environment.**

**SOLUTION: GENERATE A NEW `NEXTAUTH_SECRET` AND APPLY IT EVERYWHERE**

1.  **Generate ONE Strong Secret:**
    *   In your terminal, run: `openssl rand -base64 32`
    *   Copy the output. This is your **NEW, DEFINITIVE `NEXTAUTH_SECRET`**.

2.  **Update in `.env.local` (Local Development):**
    *   Replace the old `NEXTAUTH_SECRET` value with the new one.
    *   Restart your local dev server (`npm run dev`).

3.  **Update in Vercel Project Settings (for `www.pollitago.com` or other Vercel deployments):**
    *   Go to your Vercel Project Dashboard -> Settings -> Environment Variables.
    *   Find `NEXTAUTH_SECRET`. Edit its value or add it if missing.
    *   Paste the **NEW** secret string. Ensure no extra spaces.
    *   Save changes.
    *   **CRITICAL:** Also ensure `NEXTAUTH_URL` is the **full public URL of THIS Vercel deployment** (e.g., `https://www.pollitago.com`).

4.  **Update in Google Cloud Build Trigger (for Firebase Studio Prototypes):**
    *   Go to Google Cloud Console -> Cloud Build -> Triggers.
    *   Edit the trigger for your prototype.
    *   Under "Substitution variables", find/add `_NEXTAUTH_SECRET` (or `NEXTAUTH_SECRET`).
    *   Paste the **NEW** secret string.
    *   **CRITICAL:** Also ensure `_NEXTAUTH_URL` (or `NEXTAUTH_URL`) is the **full public URL of THIS Firebase Studio prototype**.
    *   Save the trigger.

5.  **REDEPLOY / REBUILD:**
    *   **Vercel:** Trigger a **new build/deployment** from the Vercel dashboard.
    *   **Firebase Studio Prototype:** Launch/rebuild/redeploy the prototype from Firebase Studio.

**SECONDARY CAUSE (Also Critical): `NEXTAUTH_URL` is INCORRECT for the Build/Runtime Environment.**
    *   Ensure `NEXTAUTH_URL` is the correct public URL for the specific environment where the build or runtime is happening (as described above).

### B. "Application error: a client-side exception has occurred" (Often on "New Poll" page when trying to pledge)

This usually means JavaScript code running in the browser encountered an unrecoverable error, often related to Stripe.js initialization.

**PRIMARY CAUSES & SOLUTIONS:**

1.  **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is MISSING or INCORRECT.**
    *   **Check Browser Console:** Look for "CRITICAL STRIPE ERROR" messages.
    *   **Local Development:** Ensure correct **TEST** key (`pk_test_...`) in `.env.local`. Restart dev server.
    *   **Vercel/Prototype:** Ensure correct **TEST or LIVE** key (matching environment) is set in Vercel Environment Variables or Google Cloud Build substitution variables. Redeploy/Rebuild.

---
(Other sections like Authentication with NextAuth.js, Stripe Integration, Genkit, Deprecated Firebase Notes remain, but the troubleshooting for the core issues is now centralized and emphasized above.)

