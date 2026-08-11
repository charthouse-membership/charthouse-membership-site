import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

const ALLOWED_PRICE_IDS = new Set([
  "price_1U3JbJGPuFHpS79dXBil4qZ9",
  "price_1U3JcLGPuFHpS79dE5w83NQe",
  "price_1U3JcQGPuFHpS79dNmuxixK5",
]);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json(
        { error: "You must be signed in" },
        { status: 401 }
      );
    }

    const { priceId } = await request.json();

    if (
      typeof priceId !== "string" ||
      !ALLOWED_PRICE_IDS.has(priceId)
    ) {
      return NextResponse.json(
        { error: "Invalid membership plan" },
        { status: 400 }
      );
    }

    const origin = new URL(request.url).origin;

    const session =
      await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: user.email,
        client_reference_id: user.id,

        metadata: {
          supabase_user_id: user.id,
        },

        subscription_data: {
          metadata: {
            supabase_user_id: user.id,
          },
        },

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        success_url:
          `${origin}/protected?payment=success&session_id={CHECKOUT_SESSION_ID}`,

        cancel_url:
          `${origin}/protected?payment=cancelled`,
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "STRIPE CHECKOUT ERROR:",
      error
    );

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