// paymentRoutes.js
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET); // Replace with your actual Stripe Secret Key

// Route to create a payment intent
router.post('/create-payment-intent', async (req, res) => {
    console.log("inside the create payment intent ")
    try {
        const { amount, currency } = req.body; // Expecting amount in smallest unit (e.g., cents for USD)

        // Create a Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount, 
            currency, 
            automatic_payment_methods: {
                enabled: true,
              },
       
        });
        console.log("Payment intents contains ",paymentIntent)
      
        res.status(201).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
