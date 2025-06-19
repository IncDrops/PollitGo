

# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Environment Variables (.env.local)

This project uses environment variables for configuration, especially for sensitive keys. You need to create a `.env.local` file in the root of your project. This file is included in `.gitignore` and should never be committed to version control.

**Content for your `.env.local` file (for LOCAL DEVELOPMENT ONLY):**

```env
# Stripe Keys
# Replace with your ACTUAL Stripe Test Secret Key (starts with sk_test_...)
STRIPE_SECRET_KEY=YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE
# Replace with your ACTUAL Stripe Test Publishable Key (starts with pk_test_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=YOUR_ACTUAL_STRIPE_PUBLISHABLE_KEY_GOES_HERE

# NextAuth.js Variables
# This should be the base URL of your application FOR LOCAL DEVELOPMENT.
# If `npm run dev` runs on port 9003, this is http://localhost:9003
# If your app runs on a different port locally, update it.
# FOR DEPLOYED ENVIRONMENTS (Vercel, Netlify, Google Cloud Build/Run etc.), THIS MUST BE SET TO
# THE PUBLICLY ACCESSIBLE URL OF THAT DEPLOYED ENVIRONMENT in the hosting provider's settings.
NEXTAUTH_URL=http://localhost:9003

# Generate a strong secret for NextAuth.js. This is CRITICAL for security.
# In your terminal, run: openssl rand -base64 32
# Copy the output and paste it here.
# Example: NEXTAUTH_SECRET=aVeryStrongAndRandomStringGeneratedByOpenSSL
# THIS IS CRITICAL FOR NEXTAUTH.JS TO WORK. IF MISSING, NEXTAUTH API ROUTES WILL FAIL.
# Ensure this variable is also set in your deployed environment's settings.
NEXTAUTH_SECRET=REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE
```

**VERY IMPORTANT:**
1.  Replace ALL placeholder values (e.g., `YOUR_ACTUAL_STRIPE_SECRET_KEY_GOES_HERE` and `REPLACE_THIS_WITH_A_STRONG_RANDOM_SECRET_YOU_GENERATE`) with your **actual keys and generated secret**.
2.  To generate `NEXTAUTH_SECRET`, you can run `openssl rand -base64 32` in your terminal.
3.  **After creating or modifying `.env.local` (for local development), you MUST restart your Next.js development server** (stop `npm run dev` with `Ctrl+C` and run `npm run dev` again) for the changes to take effect. Next.js only loads environment variables on startup.
4.  **For Deployed/Prototype Environments (like Vercel, Netlify, Google Cloud Build/Run, Firebase Studio Prototypes):**
    *   `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` **must** be set as environment variables through your hosting provider's settings dashboard or environment configuration. **These are NOT read from `.env.local` in deployed environments.**
    *   **`STRIPE_SECRET_KEY` is especially critical for the `/api/stripe/create-checkout-session` route to function. If it's missing in the build/deployment environment, your build might fail (e.g., with "Failed to collect page data") or the route will not work at runtime.**
    *   **`NEXTAUTH_URL` in deployed/prototype environments MUST be the full public URL of that specific deployment** (e.g., `https://your-app-name.vercel.app` or `https://your-dynamic-studio-url.cloudworkstations.dev`). If it's not set correctly, NextAuth.js API routes (like login/signup) will likely fail with "Failed to fetch" errors because the backend doesn't know its own public address.

## Authentication with NextAuth.js

This application has been configured to use NextAuth.js for authentication.

*   **Credentials Provider:** A basic email/password login is set up.
    *   **Test User:** You can log in with `test@example.com` and password `password`.
    *   **Simulated Signup:** The current setup in `src/app/api/auth/[...nextauth]/route.ts` has a placeholder `authorize` function. This function will currently allow any new email/password combination to "sign up" and log in for demonstration purposes.
*   **Database Integration Needed:** For a real application, you would need to:
    1.  Integrate a database.
    2.  Modify the `authorize` function in `src/app/api/auth/[...nextauth]/route.ts`.

### Troubleshooting NextAuth.js "Failed to fetch" errors:
This error during login/signup usually means `NEXTAUTH_URL` is misconfigured for the environment you're testing in, or `NEXTAUTH_SECRET` is missing.
1.  **Verify `NEXTAUTH_URL`:**
    *   **Local Development:** In `.env.local`, ensure it's `http://localhost:9003` (or your correct local port). **Restart your dev server after any change.**
    *   **Deployed/Prototype (e.g., Vercel, Firebase Studio):** `NEXTAUTH_URL` **must** be set to the publicly accessible URL of *that specific environment* (e.g., `https://your-app-name.vercel.app` or `https://your-studio-url.cloudworkstations.dev`) in your hosting provider's environment variable settings.
2.  **Verify `NEXTAUTH_SECRET`:** Ensure it's set (locally in `.env.local`, and in your hosting provider's settings for deployed environments) to the same strong, random secret.
3.  **Check Server/Deployment Logs:** These logs will often show errors related to misconfigured NextAuth.js variables.

## Stripe Integration

### Stripe API Route Configuration (`/api/stripe/create-checkout-session`)

*   **Environment Variable for Stripe Secret Key:** Ensure `STRIPE_SECRET_KEY` is set in `.env.local` (for local) or your hosting environment settings (for deployed). **If this key is missing in the build/deployment environment, the build may fail (e.g., "Failed to collect page data") or the API route will not function correctly.**
*   **Environment Variable for Stripe Publishable Key:** Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set.

## Google Cloud Build / Firebase Studio Prototype Environments

When using Firebase Studio prototypes or deploying directly via Google Cloud Build, your local `.env.local` file is **NOT** used. The build environment (where `npm run build` happens) and the runtime environment (where your deployed app runs, e.g., on Cloud Run) **must** have necessary environment variables configured directly within the Google Cloud settings.

*   **Required Variables:** `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
*   **Configuration:**
    *   These are typically set via the Google Cloud Build trigger configuration (e.g., substitution variables) or by linking secrets from Google Secret Manager to the build steps and/or the target deployment service (like Cloud Run).
    *   For Cloud Run, environment variables are set in the service's revision settings.
*   **Error `[Error: Failed to collect page data for /api/stripe/create-checkout-session]`:**
    *   This build error often means that `STRIPE_SECRET_KEY` (or another critical variable) is not available to the build process or the runtime environment.
    *   Ensure secrets are securely provided to your Google Cloud deployment. While moving Stripe client initialization inside the API route handler helps, the runtime still needs the key.

## Deploying to Vercel (or similar platforms) for Testing

If you encounter persistent issues with prototype environments (like Firebase Studio) regarding environment variables for backend services like NextAuth.js or Stripe, deploying to a platform like Vercel or Netlify is highly recommended. These platforms offer more straightforward ways to manage environment variables.

**Steps for Vercel:**

1.  **Ensure your code is in a Git Repository** (GitHub, GitLab, Bitbucket).
2.  **Import Project on Vercel:** Log in to Vercel, "Add New..." > "Project", connect your Git provider, and select your project.
3.  **Configure Environment Variables in Vercel Project Settings:**
    *   This is the **most critical step**. In your Vercel project settings, find "Environment Variables".
    *   Add:
        *   `NEXTAUTH_URL`: **The public URL Vercel assigns to your deployment** (e.g., `https://your-project-name.vercel.app`).
        *   `NEXTAUTH_SECRET`: Your strong, random secret (same as in `.env.local`).
        *   `STRIPE_SECRET_KEY`: Your actual Stripe Secret Key (`sk_...`).
        *   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your actual Stripe Publishable Key (`pk_...`).
    *   Ensure these are set for the "Production" environment (and "Preview" if you use preview deployments).
4.  **Deploy:** Click "Deploy" in Vercel.
5.  **Test:** Use the Vercel-provided URL on desktop and mobile. Login and Stripe functionality should work if environment variables are correct.

## Deprecated: Firebase Usage Notes
Firebase services have been removed from this project.
```
