import Link from "next/link";

const studios = [
  {
    name: "Recording Studio",
    slug: "recording-studio",
    description: "Professional recording space for music, vocals and production.",
  },
  {
    name: "Podcast Studio",
    slug: "podcast-studio",
    description: "A dedicated space for podcasts, interviews and spoken content.",
  },
  {
  name: "DJ Suite",
  slug: "dj-suite",
  description: "A dedicated DJ environment for practice, set preparation and content creation.",
},
{
  name: "TikTok / Live Studio",
  slug: "tiktok-live-studio",
  description: "A flexible space for livestreams, TikTok, social media and creator content.",
},
{
  name: "Band Rehearsal Room",
  slug: "band-rehearsal-room",
  description: "A dedicated rehearsal space for bands, musicians and live performers.",
},
{
  name: "Photo & Video Studio",
  slug: "photo-video-studio",
  description: "A flexible production space for photography, video shoots and creative projects.",
},
];


export default function StudiosPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8">
        <Link href="/" className="text-lg font-semibold uppercase tracking-[0.3em]">
          ChartHouse
        </Link>

        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/protected"
            className="transition hover:text-[#d6a85f]"
          >
            Member Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-12">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d6a85f]">
          ChartHouse Studios
        </p>

        <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight md:text-7xl">
          Your space.
          <br />
          Your sound.
          <br />
          Your content.
        </h1>

        <p className="mt-8 max-w-2xl text-lg leading-8 text-white/60">
          Explore our creative spaces and find the studio that fits your next
          session.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {studios.map((studio) => (
            <Link
              key={studio.slug}
              href={`/studios/${studio.slug}`}
              className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 transition hover:border-[#d6a85f]/60 hover:bg-white/[0.06]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-[#d6a85f]">
                Studio
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                {studio.name}
              </h2>

              <p className="mt-4 leading-7 text-white/60">
                {studio.description}
              </p>

              <div className="mt-8 text-sm font-medium">
                Explore studio <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}