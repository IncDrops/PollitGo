
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

# Stripe Keys - CRITICAL FOR PAYMENTS
# ====================================

# STRIPE_SECRET_KEY: Your Stripe *Secret* Key (starts with sk_test_... or sk_live_...).
# Used by backend API routes.
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe *Publishable* Key (starts with pk_test_... or pk_live_...).
# Used by client-side Stripe.js.
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

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`.
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute ALL other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE`) with your **actual keys**.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts. This is for AI features and usually not related to NextAuth/Stripe build errors.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, you **MUST** restart your Next.js development server (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for changes to take effect.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration. The **FOUR CRUCIAL** variables are:

*   **`NEXTAUTH_URL`**:
    *   **Value:** Set to the **full public URL of that specific deployment**.
        *   **For Vercel (e.g., `www.pollitago.com`):** This **MUST BE** `https://www.pollitago.com` (or your actual Vercel domain, e.g., `https://your-project-name.vercel.app`).
        *   **It CANNOT BE `http://localhost:9003` on Vercel.** This is a common mistake and will cause build failures or runtime errors.
    *   **Importance:** Critical for redirects, callbacks, and NextAuth.js to know its own address. **An incorrect `NEXTAUTH_URL` on Vercel can lead to build errors like "missing `app-build-manifest.json`".**
*   **`NEXTAUTH_SECRET`**:
    *   **Value:** Set to the **EXACT SAME strong, random secret** you generated and used in `.env.local`.
    *   **Importance:** **Paramount for build success of auth pages (like `/login`, `/signup`).** Double-check for typos or extra spaces when pasting. This is the most common cause of "missing `app-build-manifest.json`" errors.
*   **`STRIPE_SECRET_KEY`**:
    *   **Value:** Your actual Stripe Secret Key (e.g., `sk_test_...` or `sk_live_...`).
    *   **Importance:** Required for backend Stripe API calls like creating checkout sessions.
*   **`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**:
    *   **Value:** Your actual Stripe Publishable Key (e.g., `pk_test_...` or `pk_live_...`).
    *   **Importance:** Required for client-side Stripe.js to initialize.

**Google Cloud Project (for Genkit/AI):** In deployed Google Cloud environments (like Google Cloud Run, which might be used by Firebase Studio Prototypes), the project ID is often automatically available. The service account running your application needs appropriate IAM permissions for Genkit AI features. You typically **do not** need to set Google Cloud service account keys as environment variables on Vercel for Genkit if it's running within Google Cloud infrastructure that provides identity via a service account.

**Cleaning Up Old Firebase Variables (if applicable):**
If you previously used Firebase services and had environment variables like `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, etc., set on Vercel or Google Cloud Build, you can now remove them as they are no longer used by this project. This helps keep your configuration clean. **This step is for tidiness and will not fix NextAuth.js build errors.**

**Consequences of Missing Critical Environment Variables in Deployed/Build Environments:**

*   **Missing or Incorrect `NEXTAUTH_SECRET`:**
    *   **Build Failure:** Extremely likely to cause `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or similar for `/signup`, `/api/auth/...`) errors.
    *   **Runtime Failure:** "Internal Server Error" or other auth failures during login/signup.
*   **Missing or Incorrect `NEXTAUTH_URL` (e.g., set to `localhost` on Vercel):**
    *   **Build Failure:** Can contribute to NextAuth.js instability during the build, leading to missing manifest files.
    *   **Runtime Failure:** "Failed to fetch" errors during login/signup, OAuth provider errors, incorrect redirect behavior.
*   **Missing `STRIPE_SECRET_KEY`:**
    *   **Build Failure:** Can sometimes cause `[Error: Failed to collect page data for /api/stripe/create-checkout-session]` if the build process deeply analyzes API routes, though the current code is more resilient.
    *   **Runtime Failure:** Stripe checkout session creation will fail.
*   **Missing `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`:**
    *   **Runtime Failure:** Stripe.js will not initialize in the browser; payment forms will break.

## Authentication with NextAuth.js

This application uses NextAuth.js. The `src/app/api/auth/[...nextauth]/route.ts` file handles authentication requests.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** `test@example.com` / `password`.
    *   **Simulated Signup:** The `authorize` function currently allows any new email/password to "sign up." This is for demo purposes. A real application needs database integration.

### Troubleshooting NextAuth.js & Build Errors

*   **CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`, `/api/auth/...`)**
    This error means Next.js could not complete the build for that specific page, often because of instability in NextAuth.js initialization during the build.

    1.  **PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the BUILD ENVIRONMENT.**
        *   NextAuth.js **requires** `NEXTAUTH_SECRET` to be available not only at runtime but also *during the `next build` process*.
        *   The secret must be a **strong, consistent, random string**.
        *   **Do NOT keep generating new secrets.** Generate one, save it, and use that SAME value everywhere.

    2.  **SECONDARY CAUSE (Especially on Vercel): `NEXTAUTH_URL` is INCORRECT in the BUILD ENVIRONMENT.**
        *   For Vercel deployments, `NEXTAUTH_URL` **MUST** be the full public URL of your Vercel deployment (e.g., `https://www.pollitago.com` or `https://your-project.vercel.app`).
        *   **It CANNOT be `http://localhost:9003` on Vercel.** If it is, this can destabilize NextAuth.js during the build.

    3.  **VERCEL DEPLOYMENT - MOST CRITICAL CHECKLIST:**
        *   Go to your Vercel Project Dashboard.
        *   Navigate to **Settings -> Environment Variables**.
        *   **Meticulously check `NEXTAUTH_SECRET`:**
            *   **Does the variable `NEXTAUTH_SECRET` exist?**
            *   **Is its value EXACTLY the strong, random string you generated?**
                *   Compare it character by character with the one you have in your (correctly configured) `.env.local` or the one you saved.
                *   **Check for typos.**
                *   **Check for leading/trailing spaces** (e.g., accidentally copied an extra space).
                *   **Check if the value is accidentally empty or just a placeholder.**
            *   Ensure it's applied to the **Production** environment (and Preview/Development if you use those Vercel environments).
        *   **Meticulously check `NEXTAUTH_URL`:**
            *   Ensure it exists.
            *   Ensure its value is the **full public URL of THAT SPECIFIC Vercel deployment** (e.g., `https://your-project-name.vercel.app` or `https://www.pollitago.com`). **It should NOT be `http://localhost:9003` for your Vercel deployment.**
        *   If you are using a service like Firebase Studio that provisions Google Cloud Build, you need to ensure these variables are correctly passed to that Google Cloud Build environment. This might involve settings within Firebase Studio or directly in the Google Cloud Build trigger configuration if accessible.

    4.  **LOCAL DEVELOPMENT (if building locally with `npm run build` or seeing issues with `npm run dev`):**
        *   Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set in your `.env.local` file (`NEXTAUTH_URL` should be `http://localhost:9003` locally).
        *   Stop your development server.
        *   **Delete the `.next` folder** in your project root. This clears any potentially corrupted build cache.
        *   Run `npm run build` again to test, or restart your development server (`npm run dev`).

    5.  **REDEPLOY (Vercel/Cloud Build):** After confirming/setting environment variables in your hosting provider's settings, **you MUST trigger a new build/deployment**. This is crucial for the changes to take effect. On Vercel, use the "Redeploy" option (usually from the "Deployments" tab for the specific deployment).

*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    1.  **Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` on Vercel/deployment platform** as described above. This is the most common cause. An incorrect `NEXTAUTH_URL` (like `localhost`) will also cause this.
    2.  Check **Runtime Logs** on Vercel (or your deployment platform). Your `/api/auth/[...nextauth]/route.ts` includes specific console errors if `NEXTAUTH_SECRET` is missing at runtime.

*   **"Failed to fetch" errors on Login/Signup:**
    1.  Verify `NEXTAUTH_URL` is correct for your current environment (local vs. deployed).
    2.  Restart your dev server if you changed `.env.local`.

## Stripe Integration, Genkit, Deploying to Vercel, Google Cloud Build Sections
(Content for these sections remains largely the same as previously provided, emphasizing the need for corresponding environment variables in deployed settings.)

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project. If you previously had Firebase SDK environment variables (like `NEXT_PUBLIC_FIREBASE_API_KEY`, etc.) configured in your Vercel or Google Cloud Build settings, you can remove them to keep your configuration clean. This project now relies on NextAuth.js for authentication and Stripe for payments.
This step is for tidiness and **will not fix NextAuth.js build errors like "missing app-build-manifest.json"**.
Focus on `NEXTAUTH_SECRET` and `NEXTAUTH_URL` for those build errors.

    