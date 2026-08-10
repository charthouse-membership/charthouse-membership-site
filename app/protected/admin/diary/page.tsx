

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    room?: string;
    message?: string;
    error?: string;
  }>;
};

export default async function AdminDiaryPage({
  searchParams,
}: PageProps) {
  const {
    room: selectedRoomSlug,
    message,
    error: pageError,
  } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.is_admin) {
    redirect("/protected");
  }

  const { data: rooms } = await supabase
    .from("rooms")
    .select("id, name, slug")
    .eq("active", true)
    .order("id");

  const selectedRoom =
    rooms?.find((room) => room.slug === selectedRoomSlug) ??
    rooms?.[0];

  if (!selectedRoom) {
    return (
      <main className="min-h-screen bg-black p-10 text-white">
        No studios found.
      </main>
    );
  }

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      starts_at,
      ends_at,
      hours_used,
      status,
      booking_type,
      admin_note
    `)
    .eq("room_id", selectedRoom.id)
    .eq("status", "confirmed")
    .order("starts_at", { ascending: true });

  const { data: members } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      membership_status,
      monthly_hours,
      bonus_hours
    `)
    .order("email");

  const upcomingBookings =
    bookings?.filter(
      (booking) =>
        new Date(booking.ends_at).getTime() >= Date.now()
    ) ?? [];

  function getMember(userId: string) {
    return members?.find((member) => member.id === userId);
  }

  const groupedBookings = upcomingBookings.reduce(
    (groups: Record<string, typeof upcomingBookings>, booking) => {
      const date = new Date(
        booking.starts_at
      ).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      if (!groups[date]) {
        groups[date] = [];
      }

      groups[date].push(booking);

      return groups;
    },
    {}
  );

  async function blockStudio(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      redirect("/protected");
    }

    const roomId = Number(formData.get("roomId"));
    const roomSlug = String(formData.get("roomSlug") ?? "");
    const date = String(formData.get("date") ?? "");
    const startTime = String(formData.get("startTime") ?? "");
    const endTime = String(formData.get("endTime") ?? "");
    const note = String(formData.get("note") ?? "").trim();

    if (!roomId || !date || !startTime || !endTime) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "Please choose a date, start time and end time."
        )}`
      );
    }

    const startsAt = new Date(`${date}T${startTime}:00`);
    const endsAt = new Date(`${date}T${endTime}:00`);

    if (
      Number.isNaN(startsAt.getTime()) ||
      Number.isNaN(endsAt.getTime()) ||
      endsAt <= startsAt
    ) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "The end time must be later than the start time."
        )}`
      );
    }

    const durationHours =
      (endsAt.getTime() - startsAt.getTime()) /
      (1000 * 60 * 60);

    const { error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        room_id: roomId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        hours_used: durationHours,
        status: "confirmed",
        booking_type: "admin_block",
        admin_note: note || "Studio unavailable",
      });

    if (error) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "That time overlaps an existing booking or block."
        )}`
      );
    }

    redirect(
      `/protected/admin/diary?room=${roomSlug}&message=${encodeURIComponent(
        "Studio blocked successfully."
      )}`
    );
  }

  async function manualBooking(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      redirect("/protected");
    }

    const roomId = Number(formData.get("roomId"));
    const roomSlug = String(formData.get("roomSlug") ?? "");
    const memberId = String(formData.get("memberId") ?? "");
    const date = String(formData.get("memberDate") ?? "");
    const time = String(formData.get("memberTime") ?? "");
    const duration = Number(formData.get("duration"));

    if (
      !roomId ||
      !memberId ||
      !date ||
      !time ||
      ![1, 2].includes(duration)
    ) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "Please complete all member booking details."
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
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "Please choose a valid future booking time."
        )}`
      );
    }

    const { data: member } = await supabase
      .from("profiles")
      .select(`
        membership_status,
        monthly_hours,
        bonus_hours
      `)
      .eq("id", memberId)
      .maybeSingle();

    if (!member) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "That member could not be found."
        )}`
      );
    }

    const { data: memberBookings } = await supabase
      .from("bookings")
      .select(`
        hours_used,
        status,
        credit_refunded,
        booking_type
      `)
      .eq("user_id", memberId)
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

    const allowance =
      Number(member.monthly_hours ?? 0) +
      Number(member.bonus_hours ?? 0);

    if (allowance - usedHours < duration) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "That member does not have enough studio hours remaining."
        )}`
      );
    }

    const { error } = await supabase
      .from("bookings")
      .insert({
        user_id: memberId,
        room_id: roomId,
        starts_at: startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        hours_used: duration,
        status: "confirmed",
        booking_type: "member",
      });

    if (error) {
      redirect(
        `/protected/admin/diary?room=${roomSlug}&error=${encodeURIComponent(
          "That time overlaps an existing booking or block."
        )}`
      );
    }

    redirect(
      `/protected/admin/diary?room=${roomSlug}&message=${encodeURIComponent(
        "Member booking created successfully."
      )}`
    );
  }

  async function removeBlock(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.is_admin) {
      redirect("/protected");
    }

    const bookingId = Number(formData.get("bookingId"));
    const roomSlug = String(formData.get("roomSlug") ?? "");

    await supabase
      .from("bookings")
      .update({
        status: "cancelled",
        credit_refunded: false,
      })
      .eq("id", bookingId)
      .eq("booking_type", "admin_block");

    redirect(
      `/protected/admin/diary?room=${roomSlug}&message=${encodeURIComponent(
        "Studio block removed."
      )}`
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="font-semibold tracking-[0.2em]">
            CHARTHOUSE STUDIOS
          </Link>

          <Link
            href="/protected/admin"
            className="text-sm text-white/50 hover:text-white"
          >
            Admin dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Studio Diary
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          {selectedRoom.name}
        </h1>

        <div className="mt-12 flex flex-wrap gap-3">
          {rooms?.map((room) => (
            <Link
              key={room.id}
              href={`/protected/admin/diary?room=${room.slug}`}
              className={[
                "rounded-full border px-5 py-3 text-sm",
                room.id === selectedRoom.id
                  ? "border-white bg-white text-black"
                  : "border-white/10 text-white/60",
              ].join(" ")}
            >
              {room.name}
            </Link>
          ))}
        </div>

        {message && (
          <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 px-5 py-4">
            {message}
          </div>
        )}

        {pageError && (
          <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-200">
            {pageError}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-white/35">
              Admin control
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Block Studio
            </h2>

            <form action={blockStudio} className="mt-8 space-y-5">
              <input type="hidden" name="roomId" value={selectedRoom.id} />
              <input
                type="hidden"
                name="roomSlug"
                value={selectedRoom.slug}
              />

              <input
                name="date"
                type="date"
                required
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="startTime"
                  type="time"
                  required
                  className="rounded-2xl border border-white/10 bg-black px-4 py-4"
                />

                <input
                  name="endTime"
                  type="time"
                  required
                  className="rounded-2xl border border-white/10 bg-black px-4 py-4"
                />
              </div>

              <input
                name="note"
                type="text"
                placeholder="Maintenance, private use, etc."
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              />

              <button className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black">
                Block Studio
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-white/35">
              Admin booking
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Book for Member
            </h2>

            <form action={manualBooking} className="mt-8 space-y-5">
              <input type="hidden" name="roomId" value={selectedRoom.id} />
              <input
                type="hidden"
                name="roomSlug"
                value={selectedRoom.slug}
              />

              <select
                name="memberId"
                required
                defaultValue=""
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              >
                <option value="" disabled>
                  Choose member
                </option>

                {members?.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.full_name || member.email}
                  </option>
                ))}
              </select>

              <input
                name="memberDate"
                type="date"
                required
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              />

              <input
                name="memberTime"
                type="time"
                required
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              />

              <select
                name="duration"
                required
                defaultValue="1"
                className="w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
              </select>

              <button className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black">
                Book for Member
              </button>
            </form>
          </section>
        </div>

        <section className="mt-16">
          {Object.keys(groupedBookings).length === 0 ? (
            <div className="rounded-3xl border border-white/10 p-10 text-white/40">
              No upcoming bookings or blocks.
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedBookings).map(
                ([date, dayBookings]) => (
                  <div key={date}>
                    <h2 className="border-b border-white/10 pb-4 text-2xl font-semibold">
                      {date}
                    </h2>

                    <div className="divide-y divide-white/10">
                      {dayBookings.map((booking) => {
                        const member = getMember(booking.user_id);
                        const isBlock =
                          booking.booking_type === "admin_block";

                        return (
                          <div
                            key={booking.id}
                            className="grid gap-5 py-6 md:grid-cols-[160px_1fr_1fr_auto]"
                          >
                            <div>
                              <p className="text-xl font-semibold">
                                {new Date(
                                  booking.starts_at
                                ).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>

                              <p className="text-sm text-white/35">
                                to{" "}
                                {new Date(
                                  booking.ends_at
                                ).toLocaleTimeString("en-GB", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase text-white/30">
                                {isBlock ? "Admin Block" : "Member"}
                              </p>

                              <p className="mt-1">
                                {isBlock
                                  ? booking.admin_note
                                  : member?.full_name ||
                                    member?.email}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs uppercase text-white/30">
                                Type
                              </p>

                              <p className="mt-1">
                                {isBlock
                                  ? "Studio blocked"
                                  : "Member booking"}
                              </p>
                            </div>

                            {isBlock && (
                              <form action={removeBlock}>
                                <input
                                  type="hidden"
                                  name="bookingId"
                                  value={booking.id}
                                />
                                <input
                                  type="hidden"
                                  name="roomSlug"
                                  value={selectedRoom.slug}
                                />

                                <button className="rounded-full border border-white/20 px-4 py-2 text-sm">
                                  Remove block
                                </button>
                              </form>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}