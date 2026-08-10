export const instant = false;

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function BookStudioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("id, name, slug, description")
    .eq("active", true)
    .order("id", { ascending: true });

  if (error) {
    console.error("ROOMS ERROR:", error);
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              ChartHouse
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/25">
              Studios
            </p>
          </div>

          <Link
            href="/protected"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white/60 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
          >
            Back to dashboard
          </Link>

        </div>
      </header>


      {/* PAGE */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">

        {/* HERO */}
        <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#0d0d0d]">

          {/* STUDIO IMAGE */}
          <div
            className="pointer-events-none absolute inset-y-0 right-[-10%] w-[75%] bg-contain bg-right bg-no-repeat opacity-[0.20] md:w-[65%] md:opacity-[0.28]"
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/95 to-[#0d0d0d]/30" />

          {/* CONTENT */}
          <div className="relative z-10 px-8 py-14 md:px-14 md:py-20">

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6a85f]">
              Book a Studio
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
              Choose your
              <br />
              creative space.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
              Choose the room that fits your session. On the next step,
              you’ll select your date, time and session length.
            </p>

          </div>

        </section>


        {/* ROOM SELECTION */}
        <section className="mt-16 md:mt-20">

          <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/30">
                Available spaces
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
                Select your studio
              </h2>
            </div>

            <p className="text-sm text-white/35">
              {rooms?.length ?? 0} studio
              {(rooms?.length ?? 0) !== 1 ? "s" : ""} available
            </p>

          </div>


          {/* ROOMS */}
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {rooms?.map((room, index) => (

              <Link
                key={room.id}
                href={`/protected/book/${room.slug}`}
                className="group relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-8 transition duration-300 hover:-translate-y-1 hover:border-[#d6a85f]/40 hover:bg-white/[0.055]"
              >

                {/* NUMBER */}
                <div className="flex items-center justify-between">

                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-white/25">
                    Studio {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-sm text-white/30 transition group-hover:border-[#d6a85f]/50 group-hover:text-[#d6a85f]">
                    →
                  </span>

                </div>


                {/* ROOM INFO */}
                <div>

                  <h3 className="text-3xl font-semibold tracking-tight">
                    {room.name}
                  </h3>

                  <div className="mt-4 h-px w-12 bg-[#d6a85f]/50 transition-all duration-300 group-hover:w-20" />

                  <p className="mt-5 text-sm leading-7 text-white/45">
                    {room.description}
                  </p>

                </div>


                {/* CTA */}
                <div className="mt-8 flex items-center justify-between">

                  <span className="text-sm font-semibold text-white">
                    Select studio
                  </span>

                  <span className="text-sm text-[#d6a85f] transition-transform duration-300 group-hover:translate-x-1">
                    Continue →
                  </span>

                </div>

              </Link>

            ))}

          </div>


          {/* EMPTY STATE */}
          {(!rooms || rooms.length === 0) && (

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.03] px-8 py-20 text-center">

              <p className="text-xl font-semibold">
                No studios are available right now.
              </p>

              <p className="mt-3 text-sm text-white/40">
                Please check back shortly.
              </p>

              <Link
                href="/protected"
                className="mt-7 inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
              >
                Back to dashboard
              </Link>

            </div>

          )}

        </section>


        {/* FOOTER NOTE */}
        <section className="mt-20 border-t border-white/10 pt-10">

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <p className="text-xs uppercase tracking-[0.3em] text-white/25">
              ChartHouse Studios
            </p>

            <p className="text-sm text-white/30">
              Your space to create, record and make things happen.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}