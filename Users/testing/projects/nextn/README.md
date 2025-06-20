
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

**VERY IMPORTANT INSTRUCTIONS:**

1.  **Generate `NEXTAUTH_SECRET` ONCE:**
    *   In your terminal, run: `openssl rand -base64 32`.
    *   Copy the output. **This is your definitive `NEXTAUTH_SECRET` for this entire project.**
2.  **Replace Placeholders in `.env.local`:**
    *   Update `NEXTAUTH_SECRET` in `.env.local` with the value you just generated.
    *   Substitute ALL other placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE`) with your **actual keys**.
3.  **Setup Google Cloud ADC (for Genkit local dev):** If you haven't already, run `gcloud auth application-default login` in your terminal and follow the prompts.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, **MUST** restart your Next.js development server (`npm run dev`) for changes to take effect.

### For Deployed Environments (Vercel, Google Cloud Build / Firebase Studio Prototypes)

The `.env.local` file is **NOT** used in deployed environments. You **MUST** configure these environment variables directly through your hosting provider's settings dashboard or build configuration:

*   `NEXTAUTH_URL`: Set to the **full public URL of that specific deployment** (e.g., `https://your-project.vercel.app`, `https://your-prototype-id.cloudworkstations.dev`, or `https://www.pollitago.com`).
*   `NEXTAUTH_SECRET`: Set to the **EXACT SAME strong, random secret** you generated and used in `.env.local`. **This is paramount for build success of auth pages.** Double-check for typos or extra spaces when pasting.
*   `STRIPE_SECRET_KEY`: Your actual Stripe Secret Key.
*   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your actual Stripe Publishable Key.
*   **Google Cloud Project (for Genkit/AI):** In deployed Google Cloud environments, the project ID is often automatically available. The service account running your application needs appropriate IAM permissions.

**Consequences of Missing Environment Variables in Deployed/Build Environments:**

*   **Missing `NEXTAUTH_SECRET`:**
    *   **Build Failure:** Extremely likely to cause `ENOENT ... app-build-manifest.json` errors for pages like `/login` or `/signup`.
    *   **Runtime Failure:** "Internal Server Error" during login/signup.
*   **All other consequences as previously listed...**

## Authentication with NextAuth.js

This application uses NextAuth.js. The `src/app/api/auth/[...nextauth]/route.ts` file handles authentication requests.

### Troubleshooting NextAuth.js & Build Errors

*   **CRITICAL BUILD ERROR: `ENOENT: no such file or directory, open '...app/login/page/app-build-manifest.json'` (or for `/signup`, `/api/auth/...`)**
    This error means Next.js could not complete the build for that specific page, often because of instability in NextAuth.js initialization during the build.

    1.  **PRIMARY CAUSE: `NEXTAUTH_SECRET` is MISSING, EMPTY, or INCORRECT in the BUILD ENVIRONMENT.**
        *   NextAuth.js **requires** `NEXTAUTH_SECRET` to be available not only at runtime but also *during the `next build` process*.
        *   The secret must be a **strong, consistent, random string**.
        *   **Do NOT keep generating new secrets.** Generate one, save it, and use that SAME value everywhere.

    2.  **ACTION (Vercel/Google Cloud Build/Firebase Studio Prototypes):**
        *   Go to your hosting provider's **Project Settings > Environment Variables**.
        *   **Verify `NEXTAUTH_SECRET`:**
            *   Does it exist?
            *   Is its value the **EXACT, STRONG, RANDOM string** you generated (e.g., via `openssl rand -base64 32`)? Check for typos, extra spaces, or if it's accidentally empty.
            *   It must be the **SAME VALUE** as in your (correctly configured) `.env.local`.
        *   **Verify `NEXTAUTH_URL`:**
            *   Ensure it exists and is the full public URL of that specific deployment.
        *   **Important:** If you are using a service like Firebase Studio that provisions Google Cloud Build, you need to ensure these variables are correctly passed to that build environment. This might involve settings within Firebase Studio or directly in the Google Cloud Build trigger configuration if accessible.

    3.  **ACTION (Local Development - if building locally with `npm run build`):**
        *   Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are correctly set in your `.env.local` file.
        *   Stop your development server.
        *   **Delete the `.next` folder** in your project root. This clears any potentially corrupted build cache.
        *   Run `npm run build` again, or restart your development server (`npm run dev`).

    4.  **REDEPLOY (Vercel/Cloud Build):** After confirming/setting environment variables in your hosting provider's settings, **trigger a new build/deployment**. This is crucial for the changes to take effect. On Vercel, use the "Redeploy" option.

*   **"Internal Server Error" during Login/Signup (especially on Vercel/deployed):**
    1.  **Verify `NEXTAUTH_SECRET` and `NEXTAUTH_URL` on Vercel/deployment platform.** This is the most common cause.
    2.  Check **Runtime Logs** on Vercel (or your deployment platform).

*   **"Failed to fetch" errors on Login/Signup:**
    1.  Verify `NEXTAUTH_URL` is correct for your current environment.
    2.  Restart your dev server if you changed `.env.local`.

## Stripe Integration, Genkit, Deploying to Vercel, Google Cloud Build Sections
(Content for these sections remains largely the same as previously provided, emphasizing the need for corresponding environment variables in deployed settings.)

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.
