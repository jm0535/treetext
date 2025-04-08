// Vercel Serverless Function for creating Stripe payment intents
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount } = req.body;

    // Validate the amount
    if (!amount || isNaN(amount) || amount < 1 || amount > 20) {
      return res.status(400).json({ error: 'Invalid amount. Must be between $1 and $20.' });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'usd', // Change to your preferred currency
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        source: 'treetext.in4metrix.dev',
        type: 'sponsorship'
      }
    });

    // Return the client secret to the client
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};
