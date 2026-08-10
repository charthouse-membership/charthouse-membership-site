export const instant = false;

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  searchParams: Promise<{
    message?: string;
    error?: string;
  }>;
};

export default async function AdminMembersPage({
  searchParams,
}: PageProps) {
  const { message, error: pageError } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();

  if (!myProfile?.is_admin) {
    redirect("/protected");
  }

  const { data: members } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      membership_status,
      monthly_hours,
      bonus_hours,
      is_admin,
      created_at
    `)
    .order("created_at", { ascending: false });

  const { data: bookings } = await supabase
    .from("bookings")
    .select(`
      id,
      user_id,
      hours_used,
      status,
      credit_refunded,
      booking_type
    `);

  function getUsedHours(userId: string) {
    return (
      bookings
        ?.filter(
          (booking) =>
            booking.user_id === userId &&
            booking.booking_type === "member"
        )
        .reduce((total, booking) => {
          const shouldCount =
            booking.status === "confirmed" ||
            (booking.status === "cancelled" &&
              booking.credit_refunded === false);

          return shouldCount
            ? total + Number(booking.hours_used)
            : total;
        }, 0) ?? 0
    );
  }

  function getRemainingHours(member: any) {
    const allowance =
      Number(member.monthly_hours ?? 0) +
      Number(member.bonus_hours ?? 0);

    return Math.max(
      allowance - getUsedHours(member.id),
      0
    );
  }

  async function updateMember(formData: FormData) {
    "use server";

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const { data: adminProfile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    if (!adminProfile?.is_admin) {
      redirect("/protected");
    }

    const memberId = String(formData.get("memberId") ?? "");
    const membershipStatus = String(
      formData.get("membershipStatus") ?? ""
    );
    const monthlyHours = Number(
      formData.get("monthlyHours")
    );
    const bonusHours = Number(
      formData.get("bonusHours")
    );

    if (!memberId) {
      redirect(
        `/protected/admin/members?error=${encodeURIComponent(
          "Member not found."
        )}`
      );
    }

    if (
      !["inactive", "active", "paused", "cancelled"].includes(
        membershipStatus
      )
    ) {
      redirect(
        `/protected/admin/members?error=${encodeURIComponent(
          "Invalid membership status."
        )}`
      );
    }

    if (
      Number.isNaN(monthlyHours) ||
      Number.isNaN(bonusHours) ||
      monthlyHours < 0 ||
      bonusHours < 0
    ) {
      redirect(
        `/protected/admin/members?error=${encodeURIComponent(
          "Hours must be zero or more."
        )}`
      );
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        membership_status: membershipStatus,
        monthly_hours: monthlyHours,
        bonus_hours: bonusHours,
      })
      .eq("id", memberId);

    if (error) {
      console.error("UPDATE MEMBER ERROR:", error);

      redirect(
        `/protected/admin/members?error=${encodeURIComponent(
          "Could not update that member."
        )}`
      );
    }

    redirect(
      `/protected/admin/members?message=${encodeURIComponent(
        "Member updated successfully."
      )}`
    );
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
              href="/protected/admin"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Admin dashboard
            </Link>

            <Link
              href="/protected/admin/diary"
              className="text-sm text-white/50 transition hover:text-white"
            >
              Studio diary
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.25em] text-white/40">
          Administration
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Members.
        </h1>

        <p className="mt-5 max-w-2xl text-lg text-white/45">
          Manage membership status, monthly allowances and bonus
          studio hours.
        </p>

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

        <section className="mt-14">
          {!members || members.length === 0 ? (
            <div className="rounded-3xl border border-white/10 p-10 text-white/40">
              No members found.
            </div>
          ) : (
            <div className="space-y-5">
              {members.map((member: any) => {
                const usedHours = getUsedHours(member.id);
                const remainingHours =
                  getRemainingHours(member);

                return (
                  <div
                    key={member.id}
                    className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-semibold">
                            {member.full_name ||
                              member.email ||
                              "Unnamed member"}
                          </h2>

                          {member.is_admin && (
                            <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-white/50">
                              Admin
                            </span>
                          )}
                        </div>

                        {member.full_name && (
                          <p className="mt-2 text-white/40">
                            {member.email}
                          </p>
                        )}

                        <div className="mt-6 flex flex-wrap gap-3">
                          <div className="rounded-2xl border border-white/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-white/30">
                              Used
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                              {usedHours}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 px-4 py-3">
                            <p className="text-xs uppercase tracking-wider text-white/30">
                              Remaining
                            </p>

                            <p className="mt-1 text-xl font-semibold">
                              {remainingHours}
                            </p>
                          </div>
                        </div>
                      </div>

                      <form
                        action={updateMember}
                        className="grid w-full gap-4 lg:max-w-2xl md:grid-cols-3"
                      >
                        <input
                          type="hidden"
                          name="memberId"
                          value={member.id}
                        />

                        <div>
                          <label className="text-sm text-white/45">
                            Membership
                          </label>

                          <select
                            name="membershipStatus"
                            defaultValue={
                              member.membership_status
                            }
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
                          >
                            <option value="active">
                              Active
                            </option>
                            <option value="inactive">
                              Inactive
                            </option>
                            <option value="paused">
                              Paused
                            </option>
                            <option value="cancelled">
                              Cancelled
                            </option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm text-white/45">
                            Monthly hours
                          </label>

                          <input
                            type="number"
                            name="monthlyHours"
                            min="0"
                            step="0.5"
                            defaultValue={
                              member.monthly_hours ?? 0
                            }
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
                          />
                        </div>

                        <div>
                          <label className="text-sm text-white/45">
                            Bonus hours
                          </label>

                          <input
                            type="number"
                            name="bonusHours"
                            min="0"
                            step="0.5"
                            defaultValue={
                              member.bonus_hours ?? 0
                            }
                            className="mt-2 w-full rounded-2xl border border-white/10 bg-black px-4 py-4"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <button
                            type="submit"
                            className="w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/85"
                          >
                            Save Member Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}