// Vercel Serverless Function for handling Stripe webhooks
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  
  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    // Verify the event came from Stripe
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        
        // You could store successful payments in a database
        // or trigger other actions like sending a thank you email
        
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log(`Payment failed for PaymentIntent ${failedPayment.id}`);
        
        // Handle failed payments
        
        break;
        
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }
};
