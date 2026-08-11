

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import MembershipCheckoutButton from "@/components/membership-checkout-button";
import ManageMembershipButton from "@/components/manage-membership-button";
import { LogoutButton } from "@/components/logout-button";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
    const membershipStatus = String(
    profile?.membership_status ?? "inactive"
  ).toLowerCase();

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      starts_at,
      ends_at,
      status,
      hours_used,
      credit_refunded,
      booking_type,
      membership_period_start,
      rooms (
        name
      )
    `)
    .eq("user_id", user.id)
    .eq("booking_type", "member")
    .order("starts_at", { ascending: true });

  const membershipPeriodStart =
    profile?.membership_period_start
      ? new Date(profile.membership_period_start)
      : null;

  const monthlyHours =
  membershipStatus === "active"
    ? Number(profile?.monthly_hours ?? 0)
    : 0;

  const bonusHours = Number(
    profile?.bonus_hours ?? 0
  );

  // Count:
  // 1. Confirmed bookings
  // 2. Late cancellations where the credit was NOT refunded
  const usedHours =
    bookings?.reduce((total, booking) => {
      const bookingPeriodStart =
        booking.membership_period_start
          ? new Date(
              booking.membership_period_start
            )
          : null;

      const isCurrentPeriod =
        membershipPeriodStart &&
        bookingPeriodStart &&
        bookingPeriodStart.getTime() ===
          membershipPeriodStart.getTime();

      const shouldCount =
        isCurrentPeriod &&
        (booking.status === "confirmed" ||
          (booking.status === "cancelled" &&
            booking.credit_refunded === false));

      return shouldCount
        ? total + Number(booking.hours_used)
        : total;
    }, 0) ?? 0;

  const totalHours =
    monthlyHours + bonusHours;

  const hoursRemaining = Math.max(
    totalHours - usedHours,
    0
  );

  const hoursUsedPercentage =
    totalHours > 0
      ? Math.min(
          Math.round(
            (usedHours / totalHours) * 100
          ),
          100
        )
      : 0;

  const upcomingBookings =
    bookings?.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.starts_at).getTime() >
          Date.now()
    ) ?? [];

  

  async function cancelBooking(
    formData: FormData
  ) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const bookingId = Number(
      formData.get("bookingId")
    );

    if (!bookingId) {
      redirect("/protected");
    }

    const { data: booking } = await supabase
      .from("bookings")
      .select(
        "id, starts_at, status"
      )
      .eq("id", bookingId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (
      !booking ||
      booking.status !== "confirmed"
    ) {
      redirect("/protected");
    }

    const startTime =
      new Date(
        booking.starts_at
      ).getTime();

    const now = Date.now();

    const hoursUntilBooking =
      (startTime - now) /
      (1000 * 60 * 60);

    const refundCredit =
      hoursUntilBooking > 24;

    const { error } = await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        credit_refunded: refundCredit,
      })
      .eq("id", bookingId)
      .eq("user_id", user.id);

    if (error) {
      console.error(
        "CANCELLATION ERROR:",
        error
      );
    }

    redirect("/protected");
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
           href="#schedule"
            className="text-sm font-semibold tracking-[0.25em]"
          >
            CHARTHOUSE
          </Link>

          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              Member
            </p>

            <p className="mt-1 text-sm text-white/60">
              {user.email}
            </p>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6">

        {/* HERO */}
        <section className="relative overflow-hidden py-16 md:py-24">

          {/* STUDIO IMAGE */}
          <div
  className="pointer-events-none absolute inset-y-0 right-[-8%] w-[82%] bg-contain bg-right bg-no-repeat opacity-[0.42] md:w-[72%] md:opacity-[0.48]"
  style={{
    backgroundImage:
      "url('/chart-house-studio.png')",
    maskImage:
      "linear-gradient(to right, transparent 0%, black 55%, black 100%)",
    WebkitMaskImage:
      "linear-gradient(to right, transparent 0%, black 55%, black 100%)",
  }}
/>

          {/* DARK OVERLAY */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-transparent" />

          {/* HERO CONTENT */}
          <div className="relative z-10">

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Member Dashboard
            </p>

            <div className="mt-5 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

              <div>
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                  Welcome to
                  <br />
                  <span className="text-white/40">
                    ChartHouse.
                  </span>
                </h1>

                <p className="mt-6 max-w-xl text-lg leading-8 text-white/50">
                  Your studio time, bookings and
                  membership — all in one place.
                </p>
              </div>

              <div className="flex flex-col items-center">
  <Link
    href="/protected/book"
    className="inline-flex items-center justify-center rounded-full border border-[#d6a85f] bg-[#d6a85f] px-8 py-4 text-sm font-semibold text-black transition hover:bg-[#e0b66d]"
  >
    Book a Studio
    <span className="ml-3 text-base">
      →
    </span>
  </Link>

  <Link
    href="/how-it-works?from=members"
    className="mt-3 text-sm font-medium text-white/60 transition hover:text-white"
  >
    How it works →
  </Link>
</div>

            </div>
          </div>
        </section>

        {/* MAIN STATS */}
        <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr_0.8fr]">

          {/* STUDIO HOURS */}
          <div className="relative overflow-hidden rounded-[2rem] bg-white p-8 text-black md:p-10">

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/[0.04]" />

            <div className="relative">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.25em] text-black/40">
                    Studio Hours
                  </p>

                  <p className="mt-6 text-6xl font-semibold tracking-[-0.06em] md:text-8xl">
                    {hoursRemaining}
                  </p>

                  <p className="mt-2 text-lg text-black/50">
                    hours left
                  </p>
                </div>

                <div className="rounded-full bg-black px-4 py-2 text-xs font-medium text-white">
                  {monthlyHours} hrs / month
                </div>

              </div>

              {/* PROGRESS BAR */}
              <div className="mt-10">

                <div className="h-3 overflow-hidden rounded-full bg-black/10">

                  <div
                    className="h-full rounded-full bg-black transition-all"
                    style={{
                      width: `${hoursUsedPercentage}%`,
                    }}
                  />

                </div>

                <div className="mt-3 flex justify-between text-xs text-black/40">
                  <span>
                    {usedHours} used
                  </span>

                  <span>
                    {hoursRemaining} available
                  </span>
                </div>

              </div>

              {/* MESSAGE */}
              <div className="mt-8 border-t border-black/10 pt-6">

                <p className="text-sm font-medium text-black/70">
                  {membershipStatus !== "active"
  ? "Choose a membership to get studio time."
  : hoursRemaining > 0
    ? "You've got studio time ready to use."
    : "You've used all your studio hours."}
                </p>

                <p className="mt-2 text-sm leading-6 text-black/40">
                  Book your next session whenever
                  you're ready.
                </p>

              </div>

              {bonusHours > 0 && (
                <p className="mt-5 text-xs text-black/40">
                  Includes {bonusHours} bonus hour
                  {bonusHours !== 1
                    ? "s"
                    : ""}.
                </p>
              )}

            </div>
          </div>

          {/* MEMBERSHIP */}
          <div className="flex min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">

            <div>

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">
                Membership
              </p>

              <div className="mt-8 flex items-center gap-3">

                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    membershipStatus === "active"
  ? "bg-[#d6a85f]"
                      : membershipStatus ===
                        "canceling"
                      ? "bg-amber-400"
                      : "bg-white/30"
                  }`}
                />

                <p className="text-2xl font-semibold capitalize">
                  {membershipStatus}
                </p>

              </div>

              <p className="mt-3 text-sm leading-6 text-white/40">
                ChartHouse Membership
              </p>

              <p className="mt-6 text-3xl font-semibold">
                {monthlyHours}

                <span className="ml-2 text-sm font-normal text-white/40">
                  hours / month
                </span>
              </p>

            </div>

            <div className="mt-8">

              {membershipStatus === "active" ||
              membershipStatus === "canceling" ? (
                <ManageMembershipButton />
              ) : (
                <MembershipCheckoutButton />
              )}

            </div>
          </div>

         {/* QUICK ACTIONS */}
<div className="flex min-h-[300px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">

  <div>

    <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/35">
      Quick Actions
    </p>

    <p className="mt-7 text-2xl font-semibold leading-tight">
      Your studio,
      <br />
      your time.
    </p>

    <p className="mt-4 text-sm leading-6 text-white/40">
      Manage your sessions and keep
      creating.
    </p>

  </div>


  <div className="mt-8 space-y-3">

    <Link
      href="/protected/book"
      className="flex items-center justify-between rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
    >
      <span>
        Book Studio
      </span>
      <span>
        →
      </span>
    </Link>

<Link
  href="/studios"
  className="flex items-center justify-between rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
>
  <span>Explore Studios</span>
  <span>→</span>
</Link>
    <a
  href="#schedule"
  className="flex items-center justify-between rounded-full border border-white/20 px-6 py-4 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
>
  <span>View Schedule</span>
  <span>→</span>
</a>

  </div>

</div>

        </section>

        {/* UPCOMING BOOKINGS */}
<section id="schedule" className="scroll-mt-8 mt-20 md:mt-28">
  <div className="flex flex-col gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/35">
        Your Schedule
      </p>

      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
        Upcoming sessions
      </h2>
    </div>

    {upcomingBookings.length > 0 && (
      <p className="text-sm text-white/30">
        {upcomingBookings.length} upcoming session
        {upcomingBookings.length !== 1 ? "s" : ""}
      </p>
    )}
  </div>

  {upcomingBookings.length === 0 ? (
    <div className="mt-2 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <p className="text-lg font-medium text-white/70">
        Nothing booked yet.
      </p>

      <p className="mt-2 text-sm text-white/30">
        Your next session starts here.
      </p>

      <Link
        href="/protected/book"
        className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        Book a Studio
      </Link>
    </div>
  ) : (
    <div className="mt-2">
      {upcomingBookings.map((booking: any) => {
        const bookingDate = new Date(booking.starts_at);

        const hoursUntil =
          (bookingDate.getTime() - Date.now()) /
          (1000 * 60 * 60);

        const refundable = hoursUntil > 24;

        return (
          <div
            key={booking.id}
            className="group mb-4 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition hover:border-white/20 hover:bg-white/[0.045] md:p-7"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex min-w-0 items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-white/[0.08]">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                    {bookingDate.toLocaleDateString("en-GB", {
                      month: "short",
                    })}
                  </span>

                  <span className="mt-1 text-2xl font-semibold tracking-tight text-white">
                    {bookingDate.getDate()}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#d6a85f]" />

                    <p className="truncate text-lg font-semibold tracking-tight text-white">
                      {booking.rooms?.name ?? "Studio Session"}
                    </p>
                  </div>

                  <p className="mt-2 text-sm text-white/45">
                    {bookingDate.toLocaleDateString("en-GB", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    ·{" "}
                    {bookingDate.toLocaleTimeString("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/55">
                      {booking.hours_used} hour
                      {Number(booking.hours_used) !== 1 ? "s" : ""} studio time
                    </span>

                    <span className="text-xs text-white/25">
                      {refundable
                        ? "Cancel before 24 hours to return your hours."
                        : "Less than 24 hours — cancellation won't return your hours."}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-5 md:justify-end">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {booking.hours_used} hour
                    {Number(booking.hours_used) !== 1 ? "s" : ""}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    studio time
                  </p>
                </div>

                <form action={cancelBooking}>
                  <input
                    type="hidden"
                    name="bookingId"
                    value={booking.id}
                  />

                  <button
                    type="submit"
                    className="rounded-full border border-white/15 px-6 py-3 text-xs font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>
{/* STUDIO ACTIVITY */}
<section className="mt-20 md:mt-28">

  <div className="border-b border-white/10 pb-7">

    <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/35">
      Studio Activity
    </p>

    <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
      Your ChartHouse journey
    </h2>

  </div>


  <div className="mt-8 grid gap-5 md:grid-cols-3">


    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">

      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
        Hours remaining
      </p>

      <p className="mt-5 text-6xl font-semibold tracking-tight">
  {hoursRemaining}
</p>

      <p className="mt-2 text-sm text-[#d6a85f]/70">
  studio hours available
</p>

    </div>



    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">

      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
        Sessions booked
      </p>

      <p className="mt-5 text-6xl font-semibold tracking-tight">
  {bookings?.filter(
    (booking) =>
      booking.status === "confirmed"
  ).length ?? 0}
</p>

      <p className="mt-2 text-sm text-[#d6a85f]/70">
  completed and upcoming sessions
</p>
    </div>



    <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8">

      <p className="text-xs uppercase tracking-[0.25em] text-white/35">
        Membership
      </p>

      <div className="mt-5 flex items-center gap-3">

  <span className="h-3 w-3 rounded-full bg-[#d6a85f]" />

  <p className="text-3xl font-semibold capitalize">
    {membershipStatus}
  </p>

</div>

      <p className="mt-3 text-sm text-[#d6a85f]/70">
  ChartHouse membership
</p>

    </div>


  </div>

</section>
        {/* FOOTER */}
<section className="mt-16 border-t border-white/10 py-12">

  <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

    <div>

      <p className="text-xs uppercase tracking-[0.3em] text-white/30">
        ChartHouse Studios
      </p>

      <p className="mt-4 max-w-xl text-lg font-medium leading-8 text-white/70">
        Your space to create, record and make
        things happen.
      </p>

    </div>


    <div className="flex flex-col gap-3 text-sm text-white/30 md:items-end">
  <p>Members • Artists • Creators</p>

  <div className="flex gap-5 text-xs">
    <Link
      href="/privacy"
      className="transition hover:text-white"
    >
      Privacy Policy
    </Link>

    <Link
      href="/terms"
      className="transition hover:text-white"
    >
      Terms & Conditions
    </Link>
  </div>
</div>

  </div>

</section>

      </div>
    </main>
  );
}