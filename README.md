
# Firebase Studio Next.js Starter

This is a Next.js starter project for Firebase Studio, pre-configured with NextAuth.js for authentication and Stripe for payments.

## Environment Variables: Crucial for Local & Deployed Apps

This project relies heavily on environment variables for configuration, especially for sensitive API keys and application settings.

### For Local Development: `.env.local` File (Project Root)

You **MUST** create a `.env.local` file in the root of your project (at the same level as `package.json`). This file is listed in `.gitignore` and **should never be committed to version control.**

**Template for your `.env.local` file:**
```env
# NextAuth.js Variables - CRITICAL FOR LOGIN/SIGNUP AND BUILD STABILITY
# =====================================================================
# NEXTAUTH_URL: The base URL of your application for local development.
# Example: If `npm run dev` runs on port 9003, this is http://localhost:9003.
NEXTAUTH_URL=http://localhost:9003

# NEXTAUTH_SECRET: A strong, random secret for session encryption. CRITICAL.
# 1. Generate ONE strong secret: In your terminal, run `openssl rand -base64 32`.
# 2. Copy the output. This is your single NEXTAUTH_SECRET for this project.
# 3. Use this EXACT SAME secret in .env.local AND in your deployed environment variables.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_THE_ONE_STRONG_RANDOM_SECRET_YOU_GENERATED

# Stripe Keys - FOR LOCAL DEVELOPMENT, RECOMMENDED TO USE *TEST* KEYS
# ===================================================================
# STRIPE_SECRET_KEY: Your Stripe *Test* Secret Key (starts with sk_test_...).
STRIPE_SECRET_KEY=YOUR_STRIPE_TEST_SECRET_KEY_GOES_HERE

# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: Your Stripe *Test* Publishable Key (starts with pk_test_...).
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_STRIPE_TEST_PUBLISHABLE_KEY_GOES_HERE

# Google Cloud & Genkit (for AI Features) - Local Development Note
# =================================================================
# For local development, Genkit (which uses Google AI) relies on Application Default Credentials (ADC).
# Typically set up ONCE by running: `gcloud auth application-default login`
# No specific Google Cloud project IDs or service account keys usually needed in .env.local for Genkit.
```

**VERY IMPORTANT INSTRUCTIONS FOR `.env.local` (Local Development):**

1.  **Generate `NEXTAUTH_SECRET` ONCE:** Run `openssl rand -base64 32` in your terminal.
2.  **Replace Placeholders:** Update `NEXTAUTH_SECRET` and Stripe keys in `.env.local` with your actual values. **Use TEST Stripe keys locally.**
3.  **Google Cloud ADC (for Genkit):** Run `gcloud auth application-default login` if you haven't already.
4.  **Restart Dev Server:** After creating or modifying `.env.local`, **MUST** restart your Next.js dev server.

### For Deployed Environments (e.g., Firebase Studio Prototypes / Google Cloud Build)

The `.env.local` file is **NOT** used. You **MUST** configure these environment variables directly through your hosting provider's settings or build configuration (e.g., Google Cloud Build "Substitution variables" for Firebase Studio prototypes).

*   **`_NEXTAUTH_URL`**:
    *   **Value:** The **full public URL of that specific deployment** (e.g., `https://your-prototype-id.cloudworkstations.dev`).
*   **`_NEXTAUTH_SECRET`**:
    *   **Value:** The **EXACT SAME strong, random secret** used in `.env.local`. (Critical for build success of auth pages).
*   **Stripe LIVE Keys for Deployed Environments:**
    *   **`_STRIPE_SECRET_KEY`**: Your **LIVE** Stripe Secret Key (e.g., `sk_live_...`).
    *   **`_NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**: Your **LIVE** Stripe Publishable Key (e.g., `pk_live_...`).
*   **Google Cloud Project (for Genkit/AI):** The runtime service account needs appropriate IAM permissions (e.g., "Vertex AI User").
*   **Firebase SDK Variables (If Using Firebase Services):**
    *   If your project uses Firebase services like Storage, ensure variables like `_NEXT_PUBLIC_FIREBASE_API_KEY`, `_NEXT_PUBLIC_FIREBASE_PROJECT_ID`, etc., are also set in your deployed environment. Missing Firebase config can cause build or runtime errors if the SDK is initialized.
    *   If Firebase is NOT used, these can be omitted, and the Firebase SDK can be removed from the project.

**Consequences of Missing/Incorrect Environment Variables in Deployed/Build Environments:**
*   **`_NEXTAUTH_SECRET` / `_NEXTAUTH_URL` Issues:** Build failures (missing `app-build-manifest.json`), runtime auth errors.
*   **Stripe Key Issues:** Payment processing failures. Ensure **LIVE** keys are used for deployed environments.
*   **Firebase SDK Issues (if used):** Build failures or runtime errors if Firebase config variables are missing.

## Authentication with NextAuth.js

This application uses NextAuth.js for authentication.
*   The core configuration is in `src/app/api/auth/[...nextauth]/route.ts`.
*   A Credentials Provider is set up for email/password login.
    *   **Test User:** `test@example.com` / `password`.
    *   The `authorize` function is a placeholder and will accept any new email/password combination to simulate signup for demo purposes. A real application needs database integration for user management.

## Stripe Integration

Stripe is used for payments.
*   The API route for creating checkout sessions is in `src/app/api/stripe/create-checkout-session/route.ts`.
*   Client-side Stripe initialization happens in `src/app/layout.tsx`.
*   **Remember to use TEST keys locally and LIVE keys in deployed/production environments.**

## Genkit (AI Features)

Genkit is configured in `src/ai/genkit.ts`.
*   For local development, it relies on Application Default Credentials (`gcloud auth application-default login`).
*   For deployed environments, the service account running your application (e.g., on Cloud Run) needs IAM permissions for Google AI services (e.g., "Vertex AI User" role).

## Deprecated: Firebase Usage Notes (If transitioning away)

This starter initially included Firebase SDK. If you are **not** using Firebase services (Authentication, Firestore, Storage, etc.):
1.  Remove the `firebase` dependency from `package.json`.
2.  Delete `src/lib/firebase.ts`.
3.  Remove any `NEXT_PUBLIC_FIREBASE_...` environment variables from your local `.env.local` and your deployment configurations.
If you *are* using specific Firebase services (e.g., Storage), ensure the relevant `NEXT_PUBLIC_FIREBASE_...` variables are correctly configured.

**This project primarily demonstrates NextAuth.js for authentication and Stripe for payments, independent of Firebase for these core features.**
```