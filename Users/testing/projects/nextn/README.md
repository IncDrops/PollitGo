
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
4.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts. If you get "command not found", you need to install the Google Cloud SDK or use the Google Cloud Shell.
5.  **Restart Dev Server:** After creating or modifying your root `.env.local`, you **MUST** restart your Next.js development server (`npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

---

## PRIMARY DEPLOYMENT: Firebase Studio Prototype (via Google Cloud Build)

When you deploy a prototype from Firebase Studio, it uses **Google Cloud Build** and a **Cloud Build Trigger** behind the scenes. The trigger automates the process of taking your application code, building it for production, and deploying it to a shareable URL. Correctly configuring this trigger and its environment variables is essential for successful prototype deployments.

The `.env.local` file is **NOT** used for these deployed prototypes. You **MUST** configure environment variables directly through the Google Cloud Build trigger associated with your Firebase Studio prototype.

**Finding Your Prototype URL (Crucial for `_NEXTAUTH_URL`):**
When you launch or update a prototype in Firebase Studio, the interface will display its public URL. This URL typically ends in `.cloudworkstations.dev` or a similar Google Cloud domain.
1.  Launch/Update your prototype in Firebase Studio.
2.  Carefully copy the **full public URL** provided by Firebase Studio. This is what you'll use for `_NEXTAUTH_URL`.

**Setting Environment Variables in Google Cloud Build Trigger:**
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Navigate to **Cloud Build > Triggers**.
3.  Find and **Edit** the trigger associated with your Firebase Studio prototype (e.g., "PollitGo").
4.  Scroll down to the **"Advanced"** section and find **"Substitution variables"**.
5.  Click **"Add variable"** for each of the following (ensure variable names start with an underscore `_` as per Cloud Build convention).
    *   **IMPORTANT: When pasting values, do NOT wrap them in quotation marks.**

    *   **Variable Name:** `_NEXTAUTH_URL`
        *   **Value:** Paste the **full public URL of THIS Firebase Studio prototype** you copied earlier.
        *   **Importance:** Critical for redirects, callbacks, and NextAuth.js. **MISSING OR INCORRECT `_NEXTAUTH_URL` IS A COMMON CAUSE OF BUILD FAILURES (e.g., "missing app-build-manifest.json" for auth pages).**

    *   **Variable Name:** `_NEXTAUTH_SECRET`
        *   **Value:** Paste the **EXACT SAME strong, random secret string** you generated (e.g., via `openssl rand -base64 32`) and used in your (correctly configured root) `.env.local`.
        *   **Importance:** **PARAMOUNT for build success and runtime security.** This is the #1 cause of "missing `app-build-manifest.json`" errors and "NEXTAUTH_SECRET is missing" runtime errors. Ensure this is available to the build process (e.g., via `cloudbuild.yaml`'s `env` section if using YAML, or automatically if using Buildpacks).

    *   **Stripe LIVE Keys for Deployed Prototype:**
        *   **Variable Name:** `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
            *   **Value:** Your **LIVE** Stripe Publishable Key (starts with `pk_live_...`).
            *   **Importance:** Required for client-side Stripe.js in the deployed app.
        *   **Variable Name:** `_STRIPE_SECRET_KEY`
            *   **Value:** Your **LIVE** Stripe SecretKey (starts with `sk_live_...`).
            *   **Importance:** Required for backend Stripe API calls in the deployed app. (Also ensure it's available to the build if your build process includes server-side logic that uses it).

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

## Build Configuration (Trigger Type)

Your Cloud Build trigger can be configured in two main ways:

1.  **Buildpacks (Recommended for Firebase App Hosting & Next.js):**
    *   Set the trigger **"Type"** to **"Buildpacks"** in the Google Cloud Console when editing your trigger.
    *   Cloud Build automatically detects your Next.js app and builds it. Substitution variables (like `_NEXTAUTH_URL`, `_NEXTAUTH_SECRET`) should be automatically available to the build environment.
    *   You **do not need** a `cloudbuild.yaml` file in your repository with this setting.
    *   The "Builder image" field (e.g., `gcr.io/buildpacks/builder:latest`) will be used.

2.  **Cloud Build configuration file (yaml or json):**
    *   Set the trigger **"Type"** to **"Cloud Build configuration file (yaml or json)"**.
    *   You **must** have a `cloudbuild.yaml` (or JSON) file in your repository (e.g., at the root). A basic one has been created for you in `cloudbuild.yaml`.
    *   In the trigger settings, under "Location", specify the path to this file (e.g., `cloudbuild.yaml`).
    *   **Important:** If you use a `cloudbuild.yaml` file, ensure it is **committed and pushed** to your GitHub repository so Cloud Build can find it.
    *   This file gives you manual control over each build step.

**Understanding the Cloud Build Trigger's Role:**
The Cloud Build Trigger is essential for the automated deployment process used by Firebase Studio prototypes. When you initiate a deployment, the trigger is what tells Google Cloud Build to:
1. Fetch your latest code from your repository.
2. Build your Next.js application for production (this involves optimizations and creating necessary files/functions).
3. Deploy the built application to a shareable URL.
If the trigger itself has a configuration issue (like the logging problem), this automated process cannot even start, leading to "Failed to trigger build" errors.

---

## TROUBLESHOOTING PROTOTYPE ERRORS

### A. BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'`
### OR RUNTIME ERROR: `{"error": "Server misconfiguration: NEXTAUTH_SECRET is missing."}`

**PRIMARY CAUSE: `_NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the Google Cloud Build Trigger.** (Or `_NEXTAUTH_URL` is missing/incorrect, also impacting builds).

**SOLUTION: GENERATE A NEW `NEXTAUTH_SECRET` AND APPLY IT EVERYWHERE (Local and Cloud Build)**
1.  **Generate ONE Strong Secret:** `openssl rand -base64 32`
2.  **Update in your ROOT `.env.local`** (no quotes).
3.  **Update in Google Cloud Build Trigger (`_NEXTAUTH_SECRET`)** (no quotes). Ensure `_NEXTAUTH_URL` is also correct (full public URL of the prototype, no quotes).
4.  **If using `cloudbuild.yaml`:** Ensure `NEXTAUTH_SECRET=${_NEXTAUTH_SECRET}` and `NEXTAUTH_URL=${_NEXTAUTH_URL}` are passed in the `env` section of your build step.
5.  **REBUILD/REDEPLOY PROTOTYPE** from Firebase Studio.

### B. "Application error: a client-side exception has occurred" / "Stripe checkout session is missing" / Payment Failures

**PRIMARY CAUSES & SOLUTIONS:**
1.  **Stripe Keys (`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `_STRIPE_SECRET_KEY`) are MISSING or INCORRECT (using TEST instead of LIVE, or vice-versa) in the Cloud Build Trigger.**
    *   Verify the keys in Cloud Build Trigger (no quotes) are your **LIVE** keys.
    *   Check Browser Console for "CRITICAL STRIPE ERROR" (if publishable key is bad on client).
    *   Check Cloud Run logs for errors from `/api/stripe/create-checkout-session` (if secret key is bad on server).
    *   Redeploy after fixing.

### C. BUILD ERROR or RUNTIME ERROR: "Firebase is blocking Next" / Firebase SDK initialization failures / Or "We could not find a valid build file"

**PRIMARY CAUSES & SOLUTIONS:**
1.  **"Firebase is blocking Next" / SDK Init Failures:** `_NEXT_PUBLIC_FIREBASE_...` variables are MISSING or INCORRECT in the Cloud Build Trigger.
    *   **Verify ALL Firebase Configuration Variables:** Go to your Firebase project settings (Project Overview > Project settings > General > Your apps > SDK setup and configuration - "Config").
    *   **In Google Cloud Build Trigger > Substitution variables:**
        *   Ensure you have **ALL** the required Firebase config variables added, each prefixed with `_NEXT_PUBLIC_FIREBASE_` (e.g., `_NEXT_PUBLIC_FIREBASE_API_KEY`, `_NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc.).
        *   Double-check that the values pasted are **EXACTLY** correct and **DO NOT HAVE QUOTATION MARKS** around them.
        *   The `src/lib/firebase.ts` file attempts to initialize the SDK. If these keys are missing or wrong in the build environment, the build can fail, or the deployed app will have runtime errors when trying to use Firebase services (like Storage).
2.  **"We could not find a valid build file" Error (when using `cloudbuild.yaml`):**
    *   This means your trigger is set to "Type: Cloud Build configuration file (yaml or json)" and Cloud Build cannot find the specified YAML file (e.g., `cloudbuild.yaml`) in your GitHub repository at the specified "Location" path.
    *   **Solution:**
        *   Ensure your `cloudbuild.yaml` file exists at the root of your repository (or the path specified in the trigger).
        *   Ensure the `cloudbuild.yaml` file has been **committed and pushed** to your GitHub repository. (See Troubleshooting E if your pushes are failing).
        *   Verify the "Location" in the trigger settings correctly points to this file (e.g., `cloudbuild.yaml`).
3.  **REBUILD/REDEPLOY PROTOTYPE** from Firebase Studio after confirming.

### D. TRIGGER ERROR: "Failed to trigger build: if 'build.service_account' is specified..."

This critical error indicates that your Cloud Build **trigger's** logging configuration is incompatible with using a **user-managed service account** (like `firebase-app-hosting-compute@pollitago.iam.gserviceaccount.com`), often due to an organization policy. This happens *before* Cloud Build attempts to read your code or `cloudbuild.yaml`.

**PRIMARY SOLUTION PATHS (If `gcloud` CLI commands are unworkable or failing):**

1.  **RECOMMENDED UI-DRIVEN FIX: Delete and Recreate the Trigger via Google Cloud Console UI:**
    *   **Why:** This can often reset a trigger's configuration to a state compatible with current organization policies, bypassing issues that `gcloud` commands are struggling to resolve.
    *   **Steps:**
        1.  Go to **Cloud Build > Triggers** in the Google Cloud Console.
        2.  **Delete** your existing "PollitGo" trigger.
        3.  **Create a new trigger:**
            *   Carefully re-configure your repository connection, branch, and trigger name.
            *   **Configuration Type:** Choose either "Buildpacks" (simpler) or "Cloud Build configuration file" (if you must use your `cloudbuild.yaml`).
            *   **Service Account:** Select your `firebase-app-hosting-compute@pollitago.iam.gserviceaccount.com` service account.
            *   **Logging:** During creation, if any explicit logging options appear (e.g., "Cloud Logging only", "Default logging"), select the simplest or default available.
            *   **Substitution Variables:** **Crucially, re-add ALL** `_NEXTAUTH_URL`, `_NEXTAUTH_SECRET`, Stripe keys, and Firebase keys as before.
            *   Save the new trigger.
        4.  Attempt to deploy your prototype again from Firebase Studio.

2.  **Alternative (If `gcloud` CLI is an option, but failing with "Invalid choice" or "TRIGGER must be specified"):**
    *   The `gcloud` command to fix this is typically:
      `gcloud beta builds triggers update YOUR_TRIGGER_NAME_OR_ID --region=YOUR_REGION --update-logging=CLOUD_LOGGING_ONLY` (or try `NONE`).
    *   **If `gcloud` errors on the trigger name/ID:**
        1.  In Google Cloud Shell, list triggers to get the exact ID: `gcloud beta builds triggers list --region=YOUR_REGION` (e.g., `us-central1`).
        2.  Carefully **copy the unique ID** (long string) of your trigger from the output.
        3.  Use this ID: `gcloud beta builds triggers update COPIED_TRIGGER_ID --region=YOUR_REGION --update-logging=CLOUD_LOGGING_ONLY`.
    *   **If `gcloud` itself is not found or continues to fail inexplicably even with the ID, prioritize the UI "Delete and Recreate" method above.**

If deleting and recreating the trigger (Option 1) still results in the same "Failed to trigger build..." error, it strongly suggests a persistent Google Cloud platform configuration issue or organization policy that may require deeper investigation, potentially with Google Cloud Support.

### E. GIT PUSH / SYNC FAILURES ("Red X", Push Rejected)

If your `git push` or "Sync" operation in your Git client (like VS Code) fails, especially with a "red x", it means the remote server (GitHub) rejected the push. Cloud Build will not see your latest changes until the push is successful.

**CAUSES & SOLUTIONS:**
1.  **Find the Exact Error Message:**
    *   **VS Code:** Open the "Output" panel (View > Output), and select "Git" from the dropdown. The detailed error message will be there.
    *   **Command Line:** The error is printed directly in the terminal.
    *   **GitHub Desktop / Other GUIs:** Look for a log, console, or error notification area.
    *   **Common errors include:**
        *   `remote: error: File ... is ...MB; this exceeds GitHub's file size limit of 100.00 MB` -> You've committed a file that's too large.
        *   `remote: error: GH007: Your push would publish a private email address.` -> Check your Git email configuration.
        *   `pre-receive hook declined` -> A server-side check failed.
        *   `Permission to <repo> denied to <user>.` -> Authentication or permission issue.

2.  **Check for Large Files:**
    *   If the error mentions file size, use `git status` to see what's staged.
    *   Use `git log --stat` or your Git client's history to find commits that might have added large files.
    *   If you accidentally committed a large file (e.g., from `node_modules` or a log file):
        *   Ensure the file/folder is in your `.gitignore` (a comprehensive one has been added to this project).
        *   To remove the last commit if it's the problem: `git reset --soft HEAD~1` (this keeps changes staged), then `git rm --cached <path_to_large_file>`, amend the `.gitignore` if needed, then re-commit `git commit -m "Remove large file and update .gitignore"`.
        *   If the large file is in an older commit, it's more complex (may need `git filter-branch` or BFG Repo-Cleaner, which are advanced).

3.  **Ensure `.gitignore` is Effective:** A `.gitignore` file at the root of your project (`Users/testing/projects/nextn/.gitignore`) should list files and folders to ignore (e.g., `node_modules/`, `.next/`, `*.log`, `.env.local`). If you added/updated `.gitignore` *after* files were already tracked, you need to tell Git to stop tracking them:
    ```bash
    git rm -r --cached .
    git add .
    git commit -m "Apply .gitignore to already tracked files"
    ```
    Then try pushing again. **Be careful with this command if you have uncommitted changes you want to keep separate.**

4.  **Local Pre-push Hooks:** If your local Git setup has pre-push hooks (in `.git/hooks/pre-push`), they might be failing. The error message from Git should indicate this.

5.  **"Sync" vs. `git push`:**
    *   If your Git client's "Sync" command is trying to push multiple local commits and one is bad, it can block everything.
    *   Try to use more granular Git commands if possible (`git add <file>`, `git commit`, `git push`) or use your GUI's features to commit and push specific changes/commits selectively, if available.

---

## Authentication with NextAuth.js

This application uses NextAuth.js. Ensure `_NEXTAUTH_URL` and `_NEXTAUTH_SECRET` are correctly set in your deployment environment (Cloud Build trigger "Substitution variables"). See Troubleshooting A.

## Stripe Integration

Stripe is used for payments.
- For **local development**, use your **TEST** keys in `.env.local`.
- For **deployed prototypes**, use your **LIVE** keys (`_STRIPE_SECRET_KEY` and `_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`) in the Google Cloud Build trigger.

## Firebase Integration

Firebase SDK is initialized in `src/lib/firebase.ts`. If you use Firebase services (like Storage, Firestore):
1.  Obtain Firebase Project Configuration values.
2.  Set these in your **ROOT `.env.local` file** (for local development) and in your Google Cloud Build trigger's "Substitution variables" (for prototype deployment), using prefixes `NEXT_PUBLIC_FIREBASE_...` for `.env.local`, and `_NEXT_PUBLIC_FIREBASE_...` for Cloud Build. **Do not use quotation marks.**
3.  If you are **not** using any Firebase services, you can consider removing `src/lib/firebase.ts` and the `firebase` dependency from `package.json` to simplify. The `firebase` dependency and `src/lib/firebase.ts` have been kept in this starter for users who might want to integrate Firebase Storage or other services.

## Genkit (AI Features)

For local development, Genkit uses Application Default Credentials (`gcloud auth application-default login`). For deployed prototypes, the runtime service account needs IAM permissions for Google AI services.

---

## Alternative Deployment: Vercel

Vercel is a popular platform for deploying Next.js applications, known for its ease of use and tight integration with Next.js.
- **Setup:** Connect your GitHub repository to Vercel. It typically auto-detects Next.js projects.
- **Environment Variables:** You will need to configure similar environment variables in your Vercel project settings (e.g., `NEXTAUTH_URL` (which Vercel often sets automatically), `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and any `NEXT_PUBLIC_FIREBASE_...` variables if you use Firebase services). Use your **LIVE** keys for production deployments on Vercel.
- **Build Process:** Vercel handles the build and deployment process automatically.
- **Custom Domains:** Vercel also supports custom domains.

If you continue to face persistent deployment issues with Cloud Build that are difficult to resolve, Vercel can be a good alternative to consider for deploying your Next.js application.

    
