
# Firebase Studio Project: PollitAGo

This is a NextJS starter in Firebase Studio.

## Deployment: Understanding the Differences

You might find that deploying this Next.js application to different platforms can have varying experiences:

*   **Vercel:** Known for its highly streamlined deployment process for Next.js applications. Vercel is built by the creators of Next.js and often handles build and deployment configurations with minimal setup ("zero-config" or near-zero-config). If your app code is correct, Vercel deployments are typically very straightforward.

*   **Firebase Studio Prototypes (via Google Cloud Build):** Firebase Studio uses Google Cloud Build as its backend for deploying shareable prototypes. Cloud Build is a powerful, general-purpose build service. This means it requires more explicit configuration for your Next.js app:
    *   **Cloud Build Trigger:** This is an automated instruction that tells Cloud Build to start a build when you deploy from Studio or push to a connected repository. The trigger itself has settings (like region, service account, logging) that need to be compatible with your Google Cloud project's policies.
    *   **Build Configuration (`cloudbuild.yaml` or Buildpacks):** This tells Cloud Build the steps to build your app (e.g., `npm install`, `npm run build`).
    *   **Service Accounts:** Cloud Build needs permissions to deploy resources, managed via service accounts.
    *   **Environment Variables:** Critical variables (like `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, Stripe keys, Firebase config) must be correctly passed to the Cloud Build environment.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables. **Incorrectly configured environment variables in your BUILD ENVIRONMENT (Google Cloud Build for prototypes) are the most common cause of build failures (like "missing `app-build-manifest.json`" or "Firebase is blocking Next") and runtime errors if the build trigger *does* succeed.**

### For Local Development: `.env.local` File (Project Root)

You **MUST** create a **single** `.env.local` file in the **ROOT of your project folder** (at the same level as `package.json` and `next.config.ts`).

**Path to the correct `.env.local` file:** `Users/testing/projects/nextn/.env.local`

This file is listed in `.gitignore` and **should never be committed to version control.**

**Template for your ROOT `.env.local` file:**
```env
# NextAuth.js Variables - CRITICAL FOR LOGIN/SIGNUP AND BUILD STABILITY
# =====================================================================
# NEXTAUTH_URL: The base URL of your application for local development.
# Example: If `npm run dev` runs on port 9003, this is http://localhost:9003.
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# 1. Generate ONE strong secret: In your terminal, run `openssl rand -base64 32`.
# 2. Copy the output. This is your single NEXTAUTH_SECRET for this project.
# 3. This EXACT SAME secret MUST be used in .env.local AND in your deployed environment variables.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_THE_ONE_STRONG_RANDOM_SECRET_YOU_GENERATED

# Stripe Keys - FOR LOCAL DEVELOPMENT, YOU MUST USE YOUR STRIPE *TEST* KEYS
# ========================================================================
# These keys do NOT process real money.
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_TEST_SECRET_KEY_GOES_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_STRIPE_TEST_PUBLISHABLE_KEY_GOES_HERE

# Firebase Configuration - REQUIRED IF USING FIREBASE SERVICES (Storage, Firestore, etc.)
# ==================================================================================
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
# NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID # Optional

# Google Cloud & Genkit (for AI Features) - Local Development Note
# =================================================================
# For local development, Genkit relies on Application Default Credentials (ADC).
# Run: gcloud auth application-default login
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**
1.  **Location:** Ensure this file is at the **project root**.
2.  **Generate `NEXTAUTH_SECRET` ONCE:** Run `openssl rand -base64 32`. Use this **EXACT SAME SECRET** in `.env.local` AND in your Google Cloud Build trigger settings (and other deployed environments).
3.  **Stripe Keys:** Use your **TEST** Stripe keys (starting `pk_test_...` and `sk_test_...`).
4.  **Replace Placeholders:** Update with your actual Firebase project config if using Firebase services. **Do NOT wrap values in quotation marks.**
5.  **Setup Google Cloud ADC (for Genkit local dev):** `gcloud auth application-default login`.
6.  **Restart Dev Server:** After creating/modifying `.env.local`, restart `npm run dev`.

---

## PRIMARY DEPLOYMENT: Firebase Studio Prototype (via Google Cloud Build)

When you deploy a prototype from Firebase Studio, it uses **Google Cloud Build**. The `.env.local` file is **NOT** used. You **MUST** configure environment variables through the Google Cloud Build trigger associated with your prototype.

**Finding Your Prototype URL (Crucial for `_NEXTAUTH_URL`):**
1.  Launch/Update your prototype in Firebase Studio.
2.  Carefully copy the **full public URL** provided.

**Setting Environment Variables in Google Cloud Build Trigger:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/) -> **Cloud Build > Triggers**.
2.  Find and **Edit** the trigger (e.g., "PollitGo").
3.  Scroll to **"Advanced" > "Substitution variables"**.
4.  Click **"Add variable"** for each (names start with `_`). **Do NOT wrap values in quotes.**

    *   **`_NEXTAUTH_URL`**: Full public URL of THIS prototype. (Critical for builds)
    *   **`_NEXTAUTH_SECRET`**: The **EXACT SAME** strong, random secret used in `.env.local`. (Paramount for builds)
    *   **Stripe LIVE Keys for Deployed Prototypes:**
        *   `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your **LIVE** Stripe Publishable Key (e.g., `pk_live_...`).
        *   `_STRIPE_SECRET_KEY`: Your **LIVE** Stripe Secret Key (e.g., `sk_live_...`).
    *   **Firebase Variables (MANDATORY IF USING FIREBASE SERVICES):**
        *   `_NEXT_PUBLIC_FIREBASE_API_KEY`, `_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc.
        *   If NOT using Firebase, these can be omitted (but `src/lib/firebase.ts` might log benign errors if it tries to init).
5.  **Service Account (in Trigger settings):** Ensure it has necessary permissions (Cloud Build Service Agent, Cloud Run Admin, Service Account User). The *running prototype* also needs a service account with permissions for Google AI (Vertex AI User) and Firebase services if used.
6.  **Save the Trigger.** Rebuild/Redeploy from Firebase Studio.

---

## ALTERNATIVE DEPLOYMENT: Vercel

Vercel is a popular platform for deploying Next.js applications, known for its ease of use and excellent integration with Next.js. If you encounter persistent issues with Cloud Build triggers, Vercel can be a more straightforward deployment option.

- **Setup:** Connect your GitHub repository to Vercel. It typically auto-detects Next.js projects.
- **Environment Variables:**
    - `NEXTAUTH_URL`: Vercel often auto-sets this to the correct deployment URL.
    - `NEXTAUTH_SECRET`: The **EXACT SAME** strong, random secret used in `.env.local`.
    - Stripe Keys: Use your **LIVE** Stripe keys (`pk_live_...` and `sk_live_...`) in Vercel's environment variable settings.
    - Firebase & Genkit/Google Cloud variables as needed for your application.
- **Build Process:** Vercel handles the build and deployment process, often with minimal configuration.

---

## Build Configuration (Trigger Type for Cloud Build)

Your Cloud Build trigger can be:
1.  **Buildpacks (Recommended for Simplicity with Next.js):**
    *   Trigger "Type": "Buildpacks". No `cloudbuild.yaml` needed.
2.  **Cloud Build configuration file (yaml or json):**
    *   Trigger "Type": "Cloud Build configuration file". Requires a `cloudbuild.yaml` in your repo.

---

## TROUBLESHOOTING PROTOTYPE ERRORS (Google Cloud Build)

### A. BUILD ERROR: `ENOENT: ...app-build-manifest.json` / RUNTIME ERROR: `NEXTAUTH_SECRET is missing`
**PRIMARY CAUSE: `_NEXTAUTH_SECRET` or `_NEXTAUTH_URL` is MISSING or INCORRECT in Google Cloud Build Trigger.**
**SOLUTION:**
1.  Generate ONE Strong Secret: `openssl rand -base64 32`.
2.  Update in ROOT `.env.local` (no quotes).
3.  Update in Google Cloud Build Trigger (`_NEXTAUTH_SECRET` and `_NEXTAUTH_URL`) (no quotes). Ensure `_NEXTAUTH_SECRET` is the *exact same* value.
4.  If using `cloudbuild.yaml`, ensure `env` vars are passed.
5.  REBUILD/REDEPLOY.

### B. "Application error: a client-side exception" / Stripe / Payment Failures on Deployed Prototype
**PRIMARY CAUSE: Stripe Keys (`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `_STRIPE_SECRET_KEY`) are MISSING, INCORRECT, or using TEST keys instead of LIVE keys in Cloud Build Trigger.**
**SOLUTION:** Verify **LIVE** Stripe keys are in Cloud Build Trigger (no quotes). Check browser/Cloud Run logs. Redeploy.

### C. BUILD ERROR: "Firebase is blocking Next" / Firebase SDK init failures / "We could not find a valid build file"
**PRIMARY CAUSES & SOLUTIONS:**
1.  **Firebase SDK Issues:** `_NEXT_PUBLIC_FIREBASE_...` variables MISSING/INCORRECT in Cloud Build Trigger. Verify ALL from Firebase Console and add to Trigger (no quotes).
2.  **"Could not find a valid build file" (with `cloudbuild.yaml`):** Ensure `cloudbuild.yaml` is committed, pushed, and path in Trigger settings is correct.
3.  REBUILD/REDEPLOY.

### D. TRIGGER ERROR: "Failed to trigger build: if 'build.service_account' is specified..."
This critical error means your Cloud Build **trigger's logging configuration** is incompatible with its **user-managed service account** (e.g., `firebase-app-hosting-compute@...`), often due to an organization policy. This happens *before* your code is even read. This is an issue with the Cloud Build trigger configuration in Google Cloud, not your Next.js application code.

**RECOMMENDED UI-DRIVEN FIX (If `gcloud` CLI is problematic):**
1.  **Delete and Recreate the Trigger via Google Cloud Console UI:**
    *   **Why:** This often resets the trigger's configuration to a state compatible with current organization policies.
    *   **Steps:**
        1.  Go to **Cloud Build > Triggers**. **Delete** your existing trigger (e.g., "PollitGo").
        2.  **Create a new trigger:** Carefully re-configure repository connection, name, region (`us-central1`).
        3.  **Configuration Type:** Choose "Buildpacks" or "Cloud Build configuration file" (if you must use `cloudbuild.yaml`).
        4.  **Service Account:** Select your `firebase-app-hosting-compute@...` service account.
        5.  **Logging:** During creation, if logging options appear (e.g., "Cloud Logging only"), select the simplest/default or "Cloud Logging only".
        6.  **Substitution Variables:** **CRITICALLY, re-add ALL** `_NEXTAUTH_URL`, `_NEXTAUTH_SECRET`, Stripe (LIVE keys), and Firebase keys.
        7.  Save. Try deploying from Firebase Studio.

**Alternative (`gcloud` command, if executable):**
The `gcloud` command to fix this is typically:
`gcloud beta builds triggers update YOUR_TRIGGER_NAME_OR_ID --region=YOUR_REGION --update-logging=CLOUD_LOGGING_ONLY` (or try `NONE`).
*   If `gcloud` errors on trigger name/ID (e.g., "Invalid choice", "TRIGGER must be specified"):
    1.  List triggers to get the exact ID: `gcloud beta builds triggers list --region=YOUR_REGION` (e.g., `us-central1`).
    2.  **Copy the unique ID** (long string, e.g., `9a56b1ba-...`) of your trigger from the output.
    3.  Use this ID: `gcloud beta builds triggers update COPIED_TRIGGER_ID --region=YOUR_REGION --update-logging=CLOUD_LOGGING_ONLY`.

If deleting and recreating the trigger via the UI (Option 1) still results in the same "Failed to trigger build..." error, it strongly suggests a persistent Google Cloud platform configuration issue or organization policy that may require deeper investigation, potentially with Google Cloud Support.

### E. GIT PUSH / SYNC FAILURES ("Red X", Push Rejected)
Cloud Build won't see changes if `git push` fails.
**SOLUTION:**
1.  **Find Exact Error Message:** VS Code "Output" panel (Git) or terminal.
2.  **Check for Large Files:** If error mentions size, use `git status`, `git log --stat`. Remove if accidental (ensure in `.gitignore`, then `git reset --soft HEAD~1`, `git rm --cached <large_file>`, re-commit).
3.  **Ensure `.gitignore` is Effective:** If added/updated after files tracked: `git rm -r --cached .`, `git add .`, `git commit -m "Apply .gitignore"`.
4.  **Local Pre-push Hooks:** Check `.git/hooks/pre-push` if they are failing.

---

## Authentication with NextAuth.js
Ensure `NEXTAUTH_URL` and `NEXTAUTH_SECRET` are correctly set:
- **Local (`.env.local`):** `NEXTAUTH_URL=http://localhost:YOUR_PORT`, `NEXTAUTH_SECRET=YOUR_GENERATED_SECRET`.
- **Deployed (Cloud Build Trigger / Vercel):** `_NEXTAUTH_URL=YOUR_DEPLOYMENT_URL`, `_NEXTAUTH_SECRET=YOUR_GENERATED_SECRET` (must be the same secret as local).

## Stripe Integration
- **Local (`.env.local`):** Use **TEST** Stripe keys (`STRIPE_SECRET_KEY=sk_test_...`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...`).
- **Deployed (Cloud Build Trigger / Vercel):** Use **LIVE** Stripe keys (`_STRIPE_SECRET_KEY=sk_live_...`, `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`).

## Firebase Integration
Firebase SDK initialized in `src/lib/firebase.ts`. If using Firebase services:
1.  Set `NEXT_PUBLIC_FIREBASE_...` variables in `.env.local` and `_NEXT_PUBLIC_FIREBASE_...` in Cloud Build Trigger / Vercel (no quotes).
2.  If NOT using Firebase, consider removing `src/lib/firebase.ts` and `firebase` dependency.

## Genkit (AI Features)
Local: `gcloud auth application-default login`. Deployed: Runtime service account needs "Vertex AI User" IAM role.

---
## Role of Cloud Build Triggers (for Firebase Studio Prototypes)
When you deploy a prototype from Firebase Studio, it uses Google Cloud Build in the background. A **Cloud Build Trigger** is an automated instruction that tells Cloud Build:
1.  **When** to build your app (e.g., when you click "Deploy" in Studio or push to a connected GitHub branch).
2.  **How** to build your app (using your `cloudbuild.yaml` or Buildpacks).
3.  **What permissions** to use (via a Service Account).
4.  **What environment variables** to make available to the build process.
The trigger is essential for this automated deployment flow. If the trigger itself has a configuration issue (like the "Failed to trigger build..." logging error), the build process cannot even start.
    
