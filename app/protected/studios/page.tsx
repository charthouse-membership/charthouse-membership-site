import Link from "next/link";

const studios = [
  {
    name: "Recording Studio",
    slug: "recording-studio",
    description:
      "Professional recording space for music, vocals and production.",
  },
  {
    name: "Podcast Studio",
    slug: "podcast-studio",
    description:
      "A dedicated space for podcasts, interviews and spoken content.",
  },
  {
    name: "DJ Suite",
    slug: "dj-suite",
    description:
      "A dedicated DJ environment for practice, set preparation and content creation.",
  },
  {
    name: "TikTok / Live Studio",
    slug: "tiktok-live-studio",
    description:
      "A flexible space for livestreams, TikTok, social media and creator content.",
  },
  {
    name: "Band Rehearsal Room",
    slug: "band-rehearsal-room",
    description:
      "A dedicated rehearsal space for bands, musicians and live performers.",
  },
  {
    name: "Photo & Video Studio",
    slug: "photo-video-studio",
    description:
      "A flexible production space for photography, video shoots and creative projects.",
  },
];

export default function MemberStudiosPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.3em] text-white/35">
          Member Studios
        </p>

        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Explore Studios
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/50">
          Choose a studio and book your next session using your membership
          hours.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <div
              key={studio.slug}
              className="flex min-h-[280px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 transition hover:border-white/20 hover:bg-white/[0.06]"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/30">
                  Studio
                </p>

                <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                  {studio.name}
                </h2>

                <p className="mt-4 text-sm leading-6 text-white/40">
                  {studio.description}
                </p>
              </div>

              <Link
                href={`/protected/book/${studio.slug}`}
                className="mt-8 flex items-center justify-between rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                <span>Book this studio</span>
                <span>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}