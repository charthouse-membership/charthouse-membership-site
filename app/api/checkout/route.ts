import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      throw new Error("STRIPE_PRICE_ID is missing");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url:
        "http://localhost:3000/protected?payment=success&session_id={CHECKOUT_SESSION_ID}",

      cancel_url:
        "http://localhost:3000/protected?payment=cancelled",
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("STRIPE CHECKOUT ERROR:", error);

    return NextResponse.json(
      {
        error: "Unable to create checkout session",
      },
      {
        status: 500,
      }
    );
  }
}