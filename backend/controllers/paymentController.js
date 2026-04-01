import Case from "../models/Case.js";
import Stripe from "stripe";
import dotenv from "dotenv";


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkout  = async (req, res) => {
  try {
    const { amount, caseId, userId ,caseTitle} = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to Case ${caseId}`
            },
            unit_amount: amount * 100, // convert to cents
          },
          quantity: 1,
        },
      ],
      success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/payment-cancelled?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        caseId,
        caseTitle,
        userId,
        amount
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log("Stripe session error:", error);
    res.status(500).json({ error: "Could not initiate checkout" });
  }
}

export const webhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const caseId = session.metadata.caseId;
    const amount = session.amount_total / 100;

    // update case total donations
    Case.findByIdAndUpdate(caseId, {
      $inc: { collectedAmount: amount }
    }).exec();
  }

  res.json({ received: true });
}

export const getSession = async (req, res) => {

  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to retrieve session" });
  }
}
