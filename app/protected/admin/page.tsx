

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check that the logged-in user is actually an admin
  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!myProfile?.is_admin) {
    redirect("/protected");
  }

  // Get all members
  const { data: profiles } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      membership_status,
      monthly_hours,
      bonus_hours,
      created_at
    `)
    .order("created_at", { ascending: false });

  // Get all bookings
  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      starts_at,
      ends_at,
      hours_used,
      status,
      credit_refunded,
      rooms (
        name
      )
    `)
    .order("starts_at", { ascending: true });

  const now = new Date();

  const upcomingBookings =
    bookings?.filter(
      (booking) =>
        booking.status === "confirmed" &&
        new Date(booking.starts_at).getTime() > now.getTime()
    ) ?? [];

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const todaysBookings = upcomingBookings.filter((booking) => {
    const bookingTime = new Date(booking.starts_at);

    return bookingTime >= todayStart && bookingTime <= todayEnd;
  });

  const activeMembers =
    profiles?.filter(
      (profile) => profile.membership_status === "active"
    ).length ?? 0;

  function getMember(userId: string) {
    return profiles?.find((profile) => profile.id === userId);
  }

  function getRemainingHours(userId: string) {
    const member = getMember(userId);

    if (!member) return 0;

    const allowance =
      Number(member.monthly_hours ?? 0) +
      Number(member.bonus_hours ?? 0);

    const used =
      bookings
        ?.filter((booking) => booking.user_id === userId)
        .reduce((total, booking) => {
          const shouldCount =
            booking.status === "confirmed" ||
            (booking.status === "cancelled" &&
              booking.credit_refunded === false);

          return shouldCount
            ? total + Number(booking.hours_used)
            : total;
        }, 0) ?? 0;

    return Math.max(allowance - used, 0);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="font-semibold tracking-[0.2em]"
          >
            CHARTHOUSE STUDIOS
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/protected"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Member dashboard
            </Link><Link
  href="/protected/admin/diary"
  className="text-sm text-white/50 transition hover:text-white"
>
  Studio Diary
</Link>

<Link
  href="/protected/admin/members"
  className="text-sm text-white/50 transition hover:text-white"
>
  Members
</Link>

            <span className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-wider text-white/50">
              Admin
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          ChartHouse Administration
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Studio overview.
        </h1>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-8 text-black">
            <p className="text-sm text-black/50">
              Active members
            </p>

            <p className="mt-4 text-6xl font-semibold">
              {activeMembers}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm text-white/40">
              Bookings today
            </p>

            <p className="mt-4 text-6xl font-semibold">
              {todaysBookings.length}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm text-white/40">
              Upcoming bookings
            </p>

            <p className="mt-4 text-6xl font-semibold">
              {upcomingBookings.length}
            </p>
          </div>
        </div>

        <section className="mt-20">
          <div className="border-b border-white/10 pb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Schedule
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Upcoming studio bookings
            </h2>
          </div>

          {upcomingBookings.length === 0 ? (
            <div className="py-14 text-white/40">
              There are no upcoming bookings.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {upcomingBookings.map((booking: any) => {
                const member = getMember(booking.user_id);

                return (
                  <div
                    key={booking.id}
                    className="grid gap-4 py-6 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-center"
                  >
                    <div>
                      <p className="text-lg font-semibold">
                        {booking.rooms?.name}
                      </p>

                      <p className="mt-1 text-sm text-white/40">
                        {new Date(
                          booking.starts_at
                        ).toLocaleString("en-GB")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/30">
                        Member
                      </p>

                      <p className="mt-1">
                        {member?.full_name ||
                          member?.email ||
                          "Unknown member"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-white/30">
                        Hours remaining
                      </p>

                      <p className="mt-1">
                        {getRemainingHours(booking.user_id)}
                      </p>
                    </div>

                    <div className="text-sm text-white/50">
                      {booking.hours_used} hour
                      {Number(booking.hours_used) !== 1
                        ? "s"
                        : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-20">
          <div className="border-b border-white/10 pb-6">
            <p className="text-sm uppercase tracking-[0.25em] text-white/40">
              Membership
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Members
            </h2>
          </div>

          {!profiles || profiles.length === 0 ? (
            <div className="py-14 text-white/40">
              No members found.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {profiles.map((member) => (
                <div
                  key={member.id}
                  className="grid gap-4 py-6 md:grid-cols-[1.5fr_1fr_1fr]"
                >
                  <div>
                    <p className="font-semibold">
                      {member.full_name ||
                        member.email ||
                        "Unnamed member"}
                    </p>

                    {member.full_name && (
                      <p className="mt-1 text-sm text-white/40">
                        {member.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Membership
                    </p>

                    <p className="mt-1 capitalize">
                      {member.membership_status}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/30">
                      Hours remaining
                    </p>

                    <p className="mt-1">
                      {getRemainingHours(member.id)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}