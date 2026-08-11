import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const customers =
      await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json(
        { error: "Stripe customer not found" },
        { status: 404 }
      );
    }

    const origin = new URL(request.url).origin;

    const session =
      await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: `${origin}/protected`,
      });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error(
      "STRIPE PORTAL ERROR:",
      error
    );

    return NextResponse.json(
      { error: "Unable to open membership management" },
      { status: 500 }
    );
  }
}