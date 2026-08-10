import Link from "next/link";

const rooms = [
  {
    slug: "recording-studio",
    title: "Recording Studio",
    subtitle: "Record · Produce · Mix",
    description:
      "A professional creative space for vocal recording, music production and mixing.",
  },
  {
    slug: "podcast-studio",
    title: "Podcast Studio",
    subtitle: "Podcast · Interview · Broadcast",
    description:
      "A ready-to-go podcast space for interviews, shows, content and branded conversations.",
  },
  {
    slug: "dj-suite",
    title: "DJ Suite",
    subtitle: "Practice · Perform · Film",
    description:
      "A dedicated DJ room for learning, rehearsing, performing and filming content.",
  },
  {
    slug: "tiktok-live-studio",
    title: "TikTok / Live Studio",
    subtitle: "Stream · Create · Grow",
    description:
      "A purpose-built live content room for TikTok, streaming, social media and presenter-led content.",
  },
  {
    slug: "band-rehearsal-room",
    title: "Band Rehearsal Room",
    subtitle: "Rehearse · Write · Perform",
    description:
      "A comfortable rehearsal space for bands, artists, writers and live performance preparation.",
  },
  {
    slug: "photo-video-studio",
    title: "Photo & Video Studio",
    subtitle: "Shoot · Create · Produce",
    description:
      "A flexible studio for photography, video shoots, social content and creative production.",
  },
];

const memberships = [
  {
    hours: "4 hours",
    price: "£30",
    description: "A great starting point for regular studio time.",
  },
  {
    hours: "8 hours",
    price: "£50",
    description: "More time to create, record and develop your work.",
    featured: true,
  },
  {
    hours: "12 hours",
    price: "£70",
    description: "For creators who want serious studio time every month.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">

      {/* HEADER */}
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-7">

          <Link href="/" className="group">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              ChartHouse
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/30">
              Studios
            </p>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-white/60 md:flex">
            <a
              href="#studios"
              className="transition hover:text-white"
            >
              Studios
            </a>

            <a
              href="#membership"
              className="transition hover:text-white"
            >
              Membership
            </a>

            <Link
              href="/auth/login"
              className="transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/auth/sign-up"
              className="rounded-full bg-[#d6a85f] px-5 py-2.5 font-semibold text-black transition hover:bg-[#e0b873]"
            >
              Join
            </Link>
          </nav>

        </div>
      </header>


      {/* HERO */}
      <section className="relative min-h-[88vh] overflow-hidden">

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

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/90 to-[#080808]/30" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 py-28">

          <div className="max-w-4xl">

            <div className="flex items-center gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d6a85f]" />

              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6a85f]">
                ChartHouse Membership
              </p>
            </div>

            <h1 className="mt-7 text-5xl font-semibold leading-[0.94] tracking-tight sm:text-6xl md:text-8xl">
              Your space.
              <br />
              Your sound.
              <br />
              Your content.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/55 md:text-xl">
              One membership. Six professional creative spaces.
              Choose the amount of studio time that fits your month.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/auth/sign-up"
                className="rounded-full bg-[#d6a85f] px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-[#e0b873]"
              >
                Choose your membership →
              </Link>

              <a
                href="#studios"
                className="rounded-full border border-white/20 px-7 py-4 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
              >
                Explore the studios
              </a>

            </div>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-8 text-sm">

              <div>
                <p className="text-white/30">
                  From
                </p>

                <p className="mt-1 font-medium">
                  £30 / month
                </p>
              </div>

              <div>
                <p className="text-white/30">
                  Studio time
                </p>

                <p className="mt-1 font-medium">
                  4–12 hours / month
                </p>
              </div>

              <div>
                <p className="text-white/30">
                  Access
                </p>

                <p className="mt-1 font-medium">
                  6 creative spaces
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* STUDIOS */}
      <section
        id="studios"
        className="bg-white text-black"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">

          <div className="flex flex-col gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">

            <div className="max-w-2xl">

              <p className="text-xs font-medium uppercase tracking-[0.3em] text-black/40">
                The Studios
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
                Six spaces.
                <br />
                One membership.
              </h2>

            </div>

            <p className="max-w-xs text-sm leading-6 text-black/45">
              From recording and rehearsal to podcasts,
              live content and photography — there’s a
              space for whatever you’re creating.
            </p>

          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {rooms.map((room, index) => (
  <Link
    key={room.slug}
  href={`/studios/${room.slug}`}
  className="group flex min-h-[320px] flex-col justify-between rounded-3xl border border-black/10 bg-[#f3f3f1] p-8 transition hover:-translate-y-1"
>
  <div>
    <div className="flex items-center justify-between">
      <p className="text-sm text-black/35">
        0{index + 1}
      </p>

      <span className="text-black/35 transition group-hover:text-black">
        →
      </span>
    </div>

    <h3 className="mt-8 text-3xl font-semibold tracking-tight">
      {room.title}
    </h3>

    <p className="mt-2 text-sm font-medium text-black/45">
      {room.subtitle}
    </p>

    <p className="mt-6 leading-7 text-black/60">
      {room.description}
    </p>
  </div>

  <p className="mt-8 text-sm font-semibold">
    Explore studio →
  </p>
</Link>

            ))}

          </div>

        </div>

      </section>


      {/* MEMBERSHIP */}
      <section
        id="membership"
        className="bg-[#111111]"
      >

        <div className="mx-auto max-w-7xl px-6 py-24 md:py-28">

          <div className="max-w-3xl">

            <div className="flex items-center gap-3">

              <span className="h-2.5 w-2.5 rounded-full bg-[#d6a85f]" />

              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6a85f]">
                ChartHouse Membership
              </p>

            </div>

            <h2 className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl">
              Choose your studio time.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/50">
              Three simple membership levels. Choose the amount of
              studio time you want each month and use it across any
              available ChartHouse creative space.
            </p>

          </div>


          {/* MEMBERSHIP OPTIONS */}
          <div className="mt-12 grid gap-5 md:grid-cols-3">

            {memberships.map((membership) => (

              <div
                key={membership.hours}
                className={[
                  "relative flex flex-col rounded-[2rem] border p-8 transition duration-300",
                  membership.featured
                    ? "border-[#d6a85f]/60 bg-[#d6a85f]/[0.08]"
                    : "border-white/10 bg-white/[0.04]",
                ].join(" ")}
              >

                {membership.featured && (
                  <div className="absolute right-6 top-6 rounded-full bg-[#d6a85f] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-black">
                    Most popular
                  </div>
                )}

                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Monthly membership
                </p>

                <div className="mt-6">

                  <p className="text-4xl font-semibold tracking-tight">
                    {membership.hours}
                  </p>

                  <p className="mt-2 text-sm text-white/35">
                    included every month
                  </p>

                </div>

                <div className="mt-7 flex items-end gap-2 border-t border-white/10 pt-7">

                  <span className="text-5xl font-semibold tracking-tight">
                    {membership.price}
                  </span>

                  <span className="pb-1 text-sm text-white/35">
                    / month
                  </span>

                </div>

                <p className="mt-5 min-h-[48px] text-sm leading-6 text-white/45">
                  {membership.description}
                </p>

                <div className="mt-7 space-y-3 border-t border-white/10 pt-7 text-sm text-white/60">

                  <p>
                    <span className="mr-2 text-[#d6a85f]">✓</span>
                    Access to all 6 studios
                  </p>

                  <p>
                    <span className="mr-2 text-[#d6a85f]">✓</span>
                    Book 1 or 2 hour sessions
                  </p>

                  <p>
                    <span className="mr-2 text-[#d6a85f]">✓</span>
                    Manage bookings online
                  </p>

                </div>

                <Link
                  href="/auth/sign-up"
                  className={[
                    "mt-8 block rounded-full px-6 py-4 text-center text-sm font-semibold transition",
                    membership.featured
                      ? "bg-[#d6a85f] text-black hover:bg-[#e0b873]"
                      : "border border-white/15 text-white hover:bg-white/10",
                  ].join(" ")}
                >
                  Choose {membership.hours} →
                </Link>

              </div>

            ))}

          </div>


          {/* SIMPLE EXPLANATION */}
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.025] px-6 py-6 md:px-8">

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

              <p className="font-medium text-white/70">
                More hours. More flexibility. One creative home.
              </p>

              <p className="text-sm text-white/30">
                Your chosen membership determines your monthly included studio hours.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#080808]">

        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">

          <div className="max-w-3xl">

            <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#d6a85f]">
              Your next session starts here
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-tight md:text-6xl">
              Make something worth hearing.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/45">
              Choose the membership that fits your creative routine
              and make the studio part of your month.
            </p>

            <Link
              href="/auth/sign-up"
              className="mt-9 inline-flex rounded-full bg-[#d6a85f] px-7 py-4 text-sm font-semibold text-black transition hover:scale-[1.02] hover:bg-[#e0b873]"
            >
              Choose your membership →
            </Link>

          </div>

        </div>

      </section>


      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">

        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-white/35 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="font-medium uppercase tracking-[0.25em] text-white/50">
              ChartHouse Studios
            </p>

            <p className="mt-2">
              Creative spaces for music, content and media.
            </p>

          </div>

          <div className="flex gap-6">

            <Link
              href="/auth/login"
              className="transition hover:text-white"
            >
              Sign in
            </Link>

            <Link
              href="/auth/sign-up"
              className="transition hover:text-white"
            >
              Join
            </Link>

          </div>

        </div>

      </footer>

    </main>
  );
}