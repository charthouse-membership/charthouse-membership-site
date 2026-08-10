

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BookingCalendar from "./booking-calendar";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function StudioBookingPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { error: pageError } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: room } = await supabase
    .from("rooms")
    .select("id, name, slug, description")
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (!room) {
    redirect("/protected/book");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_status, monthly_hours, bonus_hours, membership_period_start")
    .eq("id", user.id)
    .maybeSingle();

  const { data: memberBookings } = await supabase
  .from("bookings")
  .select("hours_used, status, credit_refunded, booking_type")
  .eq("user_id", user.id)
  .eq("booking_type", "member");

const usedHours =
  memberBookings?.reduce((total, booking) => {
    const shouldCount =
      booking.status === "confirmed" ||
      (booking.status === "cancelled" &&
        booking.credit_refunded === false);

    return shouldCount
      ? total + Number(booking.hours_used)
      : total;
  }, 0) ?? 0;

  const totalHours =
    Number(profile?.monthly_hours ?? 0) +
    Number(profile?.bonus_hours ?? 0);

  const hoursRemaining = Math.max(totalHours - usedHours, 0);

  const now = new Date();
  const thirtyDaysLater = new Date();
  thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 31);

  const { data: roomBookings } = await supabase
    .from("bookings")
    .select("starts_at, ends_at")
    .eq("room_id", room.id)
    .eq("status", "confirmed")
    .gte("ends_at", now.toISOString())
    .lte("starts_at", thirtyDaysLater.toISOString())
    .order("starts_at");

  async function createBooking(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const date = String(formData.get("date") ?? "");
    const time = String(formData.get("time") ?? "");
    const duration = Number(formData.get("duration"));

    if (!date || !time || ![1, 2].includes(duration)) {
      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "Please choose a date, time and session length."
        )}`
      );
    }

    const { data: currentRoom } = await supabase
      .from("rooms")
      .select("id")
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (!currentRoom) {
      redirect("/protected/book");
    }

    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("membership_status, monthly_hours, bonus_hours")
      .eq("id", user.id)
      .maybeSingle();

    if (currentProfile?.membership_status !== "active") {
      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "You need an active membership to book a studio."
        )}`
      );
    }

    const { data: currentBookings } = await supabase
  .from("bookings")
  .select("hours_used, status, credit_refunded, booking_type")
  .eq("user_id", user.id)
  .eq("booking_type", "member");

const used =
  currentBookings?.reduce((total, booking) => {
    const shouldCount =
      booking.status === "confirmed" ||
      (booking.status === "cancelled" &&
        booking.credit_refunded === false);

    return shouldCount
      ? total + Number(booking.hours_used)
      : total;
  }, 0) ?? 0;
    

    const allowance =
      Number(currentProfile.monthly_hours ?? 0) +
      Number(currentProfile.bonus_hours ?? 0);

    if (allowance - used < duration) {
      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "You do not have enough studio hours remaining."
        )}`
      );
    }

    const startsAt = new Date(`${date}T${time}:00`);
    const endsAt = new Date(
      startsAt.getTime() + duration * 60 * 60 * 1000
    );

    if (
      Number.isNaN(startsAt.getTime()) ||
      startsAt.getTime() <= Date.now()
    ) {
      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "Please choose a valid future booking time."
        )}`
      );
    }

    const thirtyDaysFromNow =
      Date.now() + 30 * 24 * 60 * 60 * 1000;

    if (startsAt.getTime() > thirtyDaysFromNow) {
      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "Bookings can only be made up to 30 days ahead."
        )}`
      );
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      room_id: currentRoom.id,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      hours_used: duration,
      membership_period_start: profile?.membership_period_start,
      status: "confirmed",
    });

    if (error) {
      console.error("BOOKING ERROR:", error);

      redirect(
        `/protected/book/${slug}?error=${encodeURIComponent(
          "That time may already be booked. Please choose another slot."
        )}`
      );
    }

    redirect("/protected");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/protected" className="font-semibold tracking-[0.2em]">
            CHARTHOUSE STUDIOS
          </Link>

          <Link
            href="/protected/book"
            className="text-sm text-white/50 transition hover:text-white"
          >
            Choose another studio
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Book a Studio
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          {room.name}
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/50">
          {room.description}
        </p>

        {pageError && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-200">
            {pageError}
          </div>
        )}

        <BookingCalendar
          roomName={room.name}
          existingBookings={roomBookings ?? []}
          hoursRemaining={hoursRemaining}
          createBooking={createBooking}
        />
      </div>
    </main>
  );
}