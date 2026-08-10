import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// ------------------------------------------------------------
// STRIPE PRICE ID -> MONTHLY STUDIO HOURS
// ------------------------------------------------------------

function getMonthlyHours(priceId: string): number {
  const hoursByPrice: Record<string, number> = {
    "price_1U2XzxGPuFHpS79dqLtzL2kG": 4,
    "price_1U2Y1NGPuFHpS79dv4gIfwRG": 8,
    "price_1U2Y2CGPuFHpS79dEcVA3XrE": 12,
  };

  return hoursByPrice[priceId] ?? 4;
}

// ------------------------------------------------------------
// GET CUSTOMER EMAIL
// ------------------------------------------------------------

async function getCustomerEmail(
  customer:
    | string
    | Stripe.Customer
    | Stripe.DeletedCustomer
    | null
) {
  if (!customer) return null;

  if (typeof customer !== "string") {
    return customer.deleted ? null : customer.email;
  }

  const stripeCustomer =
    await stripe.customers.retrieve(customer);

  if (stripeCustomer.deleted) {
    return null;
  }

  return stripeCustomer.email;
}

// ------------------------------------------------------------
// UPDATE MEMBERSHIP
// ------------------------------------------------------------

async function updateMembershipByEmail(
  email: string,
  status: "active" | "canceling" | "inactive",
  monthlyHours?: number,
  resetPeriod = false
) {
  const updateData: {
    membership_status: string;
    monthly_hours?: number;
    membership_period_start?: string;
  } = {
    membership_status: status,
  };

  // IMPORTANT:
  // Only change the hours when we have confirmed payment.
  if (monthlyHours !== undefined) {
    updateData.monthly_hours = monthlyHours;
  }

  if (status === "inactive") {
    updateData.monthly_hours = 0;
  }

  if (resetPeriod) {
    updateData.membership_period_start =
      new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("email", email);

  if (error) {
    console.error(
      "SUPABASE MEMBERSHIP UPDATE ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "MEMBERSHIP UPDATED:",
    email,
    updateData
  );
}

// ------------------------------------------------------------
// GET PRICE ID FROM AN INVOICE LINE
// ------------------------------------------------------------

function getPriceIdFromInvoiceLine(
  line: Stripe.InvoiceLineItem
): string {
  // Older Stripe API representation
  const legacyLine = line as unknown as {
    price?: {
      id?: string;
    } | string | null;

    pricing?: {
      price_details?: {
        price?: string | null;
      } | null;
    } | null;
  };

  if (
    legacyLine.price &&
    typeof legacyLine.price === "object" &&
    legacyLine.price.id
  ) {
    return legacyLine.price.id;
  }

  if (
    typeof legacyLine.price === "string"
  ) {
    return legacyLine.price;
  }

  // Newer Stripe API representation
  const modernPrice =
    legacyLine.pricing?.price_details?.price;

  if (modernPrice) {
    return modernPrice;
  }

  return "";
}

// ------------------------------------------------------------
// PROCESS A PAID INVOICE
// ------------------------------------------------------------

async function processPaidInvoice(
  invoice: Stripe.Invoice
) {
  console.log(
    "PROCESSING PAID INVOICE:",
    invoice.id
  );

  const email = await getCustomerEmail(
    invoice.customer
  );

  if (!email) {
    console.error(
      "NO CUSTOMER EMAIL FOUND FOR INVOICE:",
      invoice.id
    );

    return;
  }

  // ----------------------------------------------------------
  // GET PERIOD START
  // ----------------------------------------------------------

  const periodStart =
    invoice.lines.data[0]?.period?.start ??
    invoice.period_start;

  // ----------------------------------------------------------
  // GET SUBSCRIPTION ID
  // ----------------------------------------------------------

  const subscriptionId =
    typeof invoice.parent?.subscription_details?.subscription ===
      "string"
      ? invoice.parent.subscription_details.subscription
      : null;

  if (!subscriptionId) {
    console.error(
      "NO SUBSCRIPTION ID FOUND:",
      invoice.id
    );

    return;
  }

  // ----------------------------------------------------------
  // GET CURRENT SUBSCRIPTION
  // ----------------------------------------------------------

  const subscription =
    await stripe.subscriptions.retrieve(
      subscriptionId
    );

  // ----------------------------------------------------------
  // GET CURRENT PRICE ID
  // ----------------------------------------------------------

  const currentPriceId =
    subscription.items.data[0]?.price?.id;

  if (!currentPriceId) {
    console.error(
      "NO CURRENT SUBSCRIPTION PRICE FOUND:",
      subscription.id
    );

    return;
  }

  // ----------------------------------------------------------
  // GET MONTHLY HOURS FROM PRICE
  // ----------------------------------------------------------

  const monthlyHours =
    getMonthlyHours(currentPriceId);

  // ----------------------------------------------------------
  // PREPARE SUPABASE UPDATE
  // ----------------------------------------------------------

  const updateData: {
    membership_status: string;
    monthly_hours: number;
    membership_period_start?: string;
  } = {
    membership_status: "active",
    monthly_hours: monthlyHours,
  };

  // ----------------------------------------------------------
  // UPDATE MEMBERSHIP PERIOD START
  // ----------------------------------------------------------

  if (periodStart) {
    updateData.membership_period_start =
      new Date(
        periodStart * 1000
      ).toISOString();
  }

  // ----------------------------------------------------------
  // UPDATE SUPABASE
  // ----------------------------------------------------------

  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("email", email);

  if (error) {
    console.error(
      "SUPABASE PAID INVOICE UPDATE ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "PAID INVOICE SUCCESSFULLY UPDATED MEMBERSHIP:",
    email,
    updateData
  );
}

// ------------------------------------------------------------
// WEBHOOK
// ------------------------------------------------------------

export async function POST(
  request: Request
) {
  const body = await request.text();

  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return new Response(
      "Missing Stripe signature",
      {
        status: 400,
      }
    );
  }

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new Response(
      "Missing webhook secret",
      {
        status: 500,
      }
    );
  }

  let event: Stripe.Event;

  // ----------------------------------------------------------
  // VERIFY STRIPE WEBHOOK
  // ----------------------------------------------------------

  try {
    event =
      stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "WEBHOOK SIGNATURE ERROR:",
      error
    );

    return new Response(
      "Invalid webhook signature",
      {
        status: 400,
      }
    );
  }

  console.log(
    "STRIPE WEBHOOK RECEIVED:",
    event.type
  );

  // ----------------------------------------------------------
  // PROCESS EVENT
  // ----------------------------------------------------------

  try {
    // --------------------------------------------------------
    // CHECKOUT COMPLETED
    // --------------------------------------------------------
    //
    // IMPORTANT:
    // We deliberately DO NOT activate the membership here.
    //
    // Checkout completion alone should not grant the monthly
    // hours. The paid invoice event below is responsible for
    // granting access after payment is confirmed.
    //
    // --------------------------------------------------------

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object as Stripe.Checkout.Session;

      console.log(
        "CHECKOUT COMPLETED:",
        {
          sessionId: session.id,
          customer: session.customer,
          paymentStatus:
            session.payment_status,
          mode: session.mode,
        }
      );
    }

    // --------------------------------------------------------
    // NORMAL INVOICE.PAID EVENT
    // --------------------------------------------------------

    if (
      event.type === "invoice.paid"
    ) {
      const invoice =
        event.data.object as Stripe.Invoice;

      await processPaidInvoice(invoice);
    }

    // --------------------------------------------------------
    // NEWER STRIPE INVOICE_PAYMENT.PAID EVENT
    // --------------------------------------------------------
    //
    // Your Stripe CLI showed this event during testing.
    //
    // The event contains the invoice ID rather than the full
    // invoice, so we retrieve the invoice from Stripe first.
    //
    // --------------------------------------------------------

    if (
      event.type ===
      "invoice_payment.paid"
    ) {
      const invoicePayment =
        event.data.object as unknown as {
          invoice?: string;
          status?: string;
        };

      console.log(
        "INVOICE PAYMENT PAID:",
        invoicePayment
      );

      if (
        invoicePayment.invoice &&
        invoicePayment.status === "paid"
      ) {
        const invoice =
          await stripe.invoices.retrieve(
            invoicePayment.invoice
          );

        await processPaidInvoice(invoice);
      }
    }

    // --------------------------------------------------------
    // SUBSCRIPTION UPDATED
    // --------------------------------------------------------
    //
    // IMPORTANT:
    // Do NOT change monthly_hours here.
    //
    // Someone can change from 4 -> 8 hours before the payment
    // has actually been collected.
    //
    // We only update the membership status here.
    // The paid invoice event above changes the hours.
    //
    // --------------------------------------------------------

    if (
      event.type ===
      "customer.subscription.updated"
    ) {
      const subscription =
        event.data.object as Stripe.Subscription;

      const email =
        await getCustomerEmail(
          subscription.customer
        );

      if (email) {
        if (
          subscription.cancel_at_period_end
        ) {
          await updateMembershipByEmail(
            email,
            "canceling"
          );
        } else if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          await updateMembershipByEmail(
            email,
            "active"
          );
        }
      }
    }

    // --------------------------------------------------------
    // SUBSCRIPTION DELETED
    // --------------------------------------------------------

    if (
      event.type ===
      "customer.subscription.deleted"
    ) {
      const subscription =
        event.data.object as Stripe.Subscription;

      const email =
        await getCustomerEmail(
          subscription.customer
        );

      if (email) {
        await updateMembershipByEmail(
          email,
          "inactive"
        );
      }
    }

    // --------------------------------------------------------
    // PAYMENT FAILED
    // --------------------------------------------------------
    //
    // We deliberately DO NOT give new hours here.
    //
    // The existing hours remain until the subscription actually
    // ends. Stripe's subscription status will tell us whether
    // the subscription becomes past_due/unpaid/canceled.
    //
    // --------------------------------------------------------

    if (
      event.type ===
      "invoice.payment_failed"
    ) {
      const invoice =
        event.data.object as Stripe.Invoice;

      console.warn(
        "INVOICE PAYMENT FAILED:",
        invoice.id
      );
    }
  } catch (error) {
    console.error(
      "WEBHOOK PROCESSING ERROR:",
      error
    );

    return new Response(
      "Webhook processing failed",
      {
        status: 500,
      }
    );
  }

  return new Response(
    "Webhook received",
    {
      status: 200,
    }
  );
}