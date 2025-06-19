
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import Stripe from "stripe";

// Initialize Firebase Admin SDK.
// This should be called only once per application instance.
// If you have other function files, ensure initializeApp() is called once globally.
if (admin.apps.length === 0) {
  admin.initializeApp();
}

// Configure your Stripe secret key and webhook signing secret in Firebase environment variables:
// In your terminal, run:
// firebase functions:config:set stripe.secret_key="sk_YOUR_STRIPE_SECRET_KEY"
// firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SIGNING_SECRET"
// Replace with your actual test or live keys/secrets.
// After setting, deploy your functions for the config to take effect.

const stripeSecretKey = functions.config().stripe?.secret_key;
const webhookSecret = functions.config().stripe?.webhook_secret;

if (!stripeSecretKey || !webhookSecret) {
  console.error(
    "Stripe secret_key or webhook_secret is not set in Firebase Functions config. " +
    "Please set them using 'firebase functions:config:set stripe.secret_key=...' and 'firebase functions:config:set stripe.webhook_secret=...'"
  );
}

// Initialize Stripe with your SECRET KEY.
// The API version is recommended by Stripe to ensure consistent behavior.
const stripe = new Stripe(stripeSecretKey || "sk_test_fallback_if_not_set_due_to_error", {
  apiVersion: "2024-06-20", // Use the latest API version available at the time of implementation
});

export const stripeWebhookHandler = functions.https.onRequest(
  async (request, response) => {
    if (!stripeSecretKey || !webhookSecret) {
      functions.logger.error("Stripe keys not configured. Aborting webhook processing.");
      response.status(500).send("Server configuration error for Stripe.");
      return;
    }

    if (request.method !== "POST") {
      response.setHeader("Allow", "POST");
      response.status(405).send("Method Not Allowed");
      return;
    }

    const sig = request.headers["stripe-signature"] as string;
    let event: Stripe.Event;

    try {
      // request.rawBody is needed for verifying the signature.
      // Ensure your Express app (or whatever Firebase Functions uses internally)
      // makes the raw body available. Firebase Functions does this by default for https.onRequest.
      event = stripe.webhooks.constructEvent(
        request.rawBody,
        sig,
        webhookSecret
      );
    } catch (err: any) {
      functions.logger.error("⚠️ Webhook signature verification failed.", err.message);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    functions.logger.info(
      "✅ Stripe Webhook Event Received:",
      event.type,
      event.id
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        const session = event.data.object as Stripe.Checkout.Session;
        functions.logger.info(`Checkout session ${session.id} was successful!`);

        // Retrieve metadata passed during session creation
        const userId = session.metadata?.userId;
        const action = session.metadata?.action; // e.g., 'poll_pledge', 'tip_creator'
        const pollQuestion = session.metadata?.question; // if it was a pledge
        const pollCreatorId = session.metadata?.pollCreatorId;
        const amountTotal = session.amount_total; // Amount in cents

        // TODO: Implement your business logic here.
        // This is where you update your Firestore database, grant access, etc.
        // Ensure your database operations are idempotent (safe to re-run for the same event).

        if (action === "poll_pledge" && userId && pollQuestion && amountTotal) {
          functions.logger.info(
            `Processing poll pledge for user ${userId}, poll: "${pollQuestion}", amount: ${amountTotal / 100}`
          );
          // Example: Mark a pledge as paid in Firestore
          // await admin.firestore().collection('users').doc(userId)
          //   .collection('pledges').add({
          //     pollQuestion,
          //     status: 'paid',
          //     amount: amountTotal,
          //     stripeSessionId: session.id,
          //     createdAt: admin.firestore.FieldValue.serverTimestamp()
          //   });
        } else if (action === "tip_creator" && userId && pollCreatorId && amountTotal) {
          functions.logger.info(
            `Processing tip from user ${userId} to creator ${pollCreatorId}, amount: ${amountTotal / 100}`
          );
          // Example: Update creator's PollitPoints or a tip counter
          // const creatorRef = admin.firestore().collection('users').doc(pollCreatorId);
          // await creatorRef.update({
          //  pollitPointsBalance: admin.firestore.FieldValue.increment(Math.floor(amountTotal / 100 * 5)), // Example: 5 points per dollar
          //  totalTipsReceived: admin.firestore.FieldValue.increment(amountTotal)
          // });
        } else {
          functions.logger.warn("Checkout session completed with missing metadata for action processing:", session.metadata);
        }
        break;

      // Add other event types you want to handle
      // case 'payment_intent.succeeded':
      //   const paymentIntent = event.data.object;
      //   // Then define and call a method to handle the successful payment intent.
      //   break;
      // case 'payment_method.attached':
      //   const paymentMethod = event.data.object;
      //   // Then define and call a method to handle the successful attachment of a PaymentMethod.
      //   break;

      default:
        functions.logger.warn(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event to Stripe
    response.status(200).json({ received: true });
  }
);

    