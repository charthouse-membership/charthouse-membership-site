
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const studios = {
  "recording-studio": {
    number: "01",
    name: "Recording Studio",
    subtitle: "Record · Produce · Mix",
    description:
      "A focused production space for artists, vocalists, producers and writers. Built for recording, creating and shaping your next track.",
    intro:
      "Whether you're recording vocals, developing a production or putting the finishing touches to a track, the Recording Studio gives you a dedicated space to work.",
    uses: [
      "Vocal recording",
      "Music production",
      "Songwriting",
      "Mixing",
      "Demo recording",
      "Artist development",
    ],
    equipment: [
      "Professional recording environment",
      "Studio monitoring",
      "Microphone setup",
      "Production workstation",
      "Headphone monitoring",
      "Comfortable artist recording area",
    ],
    features: [
      "Focused recording environment",
      "Suitable for solo artists and producers",
      "Ideal for vocal and music sessions",
      "Flexible one or two hour bookings",
    ],
  },

  "podcast-studio": {
    number: "02",
    name: "Podcast Studio",
    subtitle: "Podcast · Interview · Broadcast",
    description:
      "A dedicated space for podcasts, interviews, conversations and branded content, designed to make recording simple and professional.",
    intro:
      "Bring your guests, your ideas and your conversation. The Podcast Studio gives you a controlled environment for recording engaging audio and video content.",
    uses: [
      "Podcasts",
      "Interviews",
      "Video podcasts",
      "Panel discussions",
      "Branded content",
      "Creator content",
    ],
    equipment: [
      "Podcast recording setup",
      "Professional microphones",
      "Headphone monitoring",
      "Recording workstation",
      "Camera-ready environment",
      "Guest seating area",
    ],
    features: [
      "Ready-to-record setup",
      "Suitable for solo and multi-person sessions",
      "Audio and video content friendly",
      "Ideal for recurring shows",
    ],
  },

  "dj-suite": {
    number: "03",
    name: "DJ Suite",
    subtitle: "Practice · Perform · Film",
    description:
      "A dedicated DJ environment for practising sets, developing your skills, preparing performances and creating content.",
    intro:
      "Use the DJ Suite to sharpen your technique, prepare a set, experiment with new sounds or film your next piece of content.",
    uses: [
      "DJ practice",
      "Set preparation",
      "Mixing",
      "Performance preparation",
      "DJ content",
      "Music discovery",
    ],
    equipment: [
      "DJ performance setup",
      "Professional audio monitoring",
      "Headphone monitoring",
      "Performance workspace",
      "Content-friendly environment",
      "Dedicated DJ area",
    ],
    features: [
      "Private practice environment",
      "Suitable for developing DJs",
      "Ideal for set preparation",
      "Great for DJ-focused content",
    ],
  },

  "tiktok-live-studio": {
    number: "04",
    name: "TikTok / Live Studio",
    subtitle: "Stream · Create · Grow",
    description:
      "A flexible content environment for livestreams, TikTok, social media, presenting and creator-led productions.",
    intro:
      "Create content without trying to turn your bedroom into a production studio. The TikTok / Live Studio gives creators a dedicated environment for going live and producing social content.",
    uses: [
      "TikTok",
      "Live streaming",
      "Social media content",
      "Presenter videos",
      "Creator content",
      "Branded campaigns",
    ],
    equipment: [
      "Streaming-ready setup",
      "Lighting environment",
      "Camera-ready space",
      "Content creation workstation",
      "Presenter-friendly layout",
      "Flexible shooting area",
    ],
    features: [
      "Designed for social-first content",
      "Suitable for livestreaming",
      "Flexible creator setup",
      "Ideal for short-form video",
    ],
  },

  "band-rehearsal-room": {
    number: "05",
    name: "Band Rehearsal Room",
    subtitle: "Rehearse · Write · Perform",
    description:
      "A dedicated rehearsal environment for bands, musicians and live performers to practise, write and prepare for the stage.",
    intro:
      "Get the whole band in one room and get to work. The rehearsal space is designed for productive sessions, songwriting and live preparation.",
    uses: [
      "Band rehearsals",
      "Songwriting",
      "Live preparation",
      "Group practice",
      "Set preparation",
      "Performance development",
    ],
    equipment: [
      "Rehearsal PA setup",
      "Performance monitoring",
      "Musician setup areas",
      "Dedicated rehearsal space",
      "Flexible room layout",
      "Live-performance environment",
    ],
    features: [
      "Suitable for group sessions",
      "Built around productive rehearsal",
      "Ideal for preparing live sets",
      "Flexible creative environment",
    ],
  },

  "photo-video-studio": {
    number: "06",
    name: "Photo & Video Studio",
    subtitle: "Shoot · Create · Produce",
    description:
      "A flexible production space for photography, video shoots, social content, campaigns and creative projects.",
    intro:
      "From portraits and product photography to music visuals and social campaigns, the Photo & Video Studio gives you a flexible space to bring your visual ideas to life.",
    uses: [
      "Photography",
      "Video shoots",
      "Portraits",
      "Social content",
      "Music visuals",
      "Brand campaigns",
    ],
    equipment: [
      "Studio lighting environment",
      "Flexible shooting space",
      "Camera-ready setup",
      "Content production area",
      "Adaptable background space",
      "Creative workspace",
    ],
    features: [
      "Flexible production environment",
      "Suitable for photo and video",
      "Ideal for creators and brands",
      "Adaptable for different shoots",
    ],
  },
} as const;
export function generateStaticParams() {
  return Object.keys(studios).map((slug) => ({
    slug,
  }));
}
type StudioSlug = keyof typeof studios;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function StudioPage({ params }: PageProps) {
  const { slug } = await params;

  if (!Object.hasOwn(studios, slug)) {
    notFound();
  }

  const studio = studios[slug as StudioSlug];
const studioImages: Record<string, string[]> = {
  "recording-studio": [
    "/studio-images/studio 1.png",
    "/studio-images/studio 2.png",
    "/studio-images/studio 3.png",
  ],

  "dj-suite": [
    "/studio-images/dj 1.png",
    "/studio-images/dj 2.png",
    "/studio-images/dj 3.png",
  ],

  "band-rehearsal-room": [
    "/studio-images/rehearsal 1.png",
    "/studio-images/rehearsal 2.png",
    "/studio-images/rehearsal 3.png",
  ],

  "tiktok-live-studio": [
    "/studio-images/live stream 1.png",
    "/studio-images/live stream 2.png",
    "/studio-images/live stream 3.png",
  ],

  "podcast-studio": [
    "/studio-images/podcast 1.png",
    "/studio-images/podcast 2.png",
    "/studio-images/podcast 3.png",
  ],

  "photo-video-studio": [
    "/studio-images/photo 1.png",
    "/studio-images/photo 2.png",
    "/studio-images/photo 3.png",
  ],
};

const studioImageSet = studioImages[slug] ?? [];
  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.25em]"
          >
            ChartHouse Studios
          </Link>

          <Link
            href="/#studios"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← All studios
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-5xl">
          <p className="text-sm uppercase tracking-[0.3em] text-[#d6a85f]">
            Studio {studio.number}
          </p>

          <h1 className="mt-6 text-5xl font-semibold tracking-tight md:text-8xl">
            {studio.name}
          </h1>

          <p className="mt-5 text-lg font-medium text-white/45 md:text-xl">
            {studio.subtitle}
          </p>

          <p className="mt-8 max-w-3xl text-lg leading-8 text-white/55 md:text-xl">
            {studio.description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`/protected/book/${slug}`}
              className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-white/85"
            >
              Book this studio →
            </Link>

            <Link
              href="/#studios"
              className="rounded-full border border-white/15 px-7 py-4 text-sm font-semibold transition hover:bg-white/10"
            >
              Explore all studios
            </Link>
          </div>
        </div>
      </section>

      {/* STUDIO VISUAL */}
<section className="border-y border-white/10 bg-white/[0.025]">
  <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
    <div className="grid gap-4 md:grid-cols-3">

      {/* MAIN IMAGE — PHOTO 1 */}
      <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 md:col-span-2">
        <Image
          src={studioImageSet[0]}
          alt={`${studio.name} studio`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 66vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-7">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d6a85f]">
            {studio.name}
          </p>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">
            A dedicated creative space for making, recording and creating.
          </p>
        </div>
      </div>

      {/* SUPPORTING PHOTOS */}
      <div className="grid gap-4">

        {/* PHOTO 2 */}
        <div className="relative min-h-[180px] overflow-hidden rounded-[2rem] border border-white/10">
          <Image
            src={studioImageSet[1]}
            alt={`${studio.name} interior`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d6a85f]">
              The space
            </p>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Professional environment. Creative freedom.
            </p>
          </div>
        </div>

        {/* PHOTO 3 — CLOSE UP */}
        <div className="relative min-h-[180px] overflow-hidden rounded-[2rem] border border-white/10">
          <Image
            src={studioImageSet[2]}
            alt={`${studio.name} close up`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-[#d6a85f]">
              Members
            </p>

            <p className="mt-2 text-sm leading-6 text-white/70">
              Book by the hour when you need it.
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
      {/* INTRO */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/35">
              The studio
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Built for creating.
            </h2>
          </div>

          <p className="max-w-3xl text-xl leading-9 text-white/55">
            {studio.intro}
          </p>
        </div>
      </section>

      {/* GOOD FOR + FEATURES */}
      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 py-20 md:py-28 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/35">
              Good for
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Make the space work for you.
            </h2>

            <div className="mt-10 border-t border-white/10">
              {studio.uses.map((use) => (
                <div
                  key={use}
                  className="flex items-center justify-between border-b border-white/10 py-5"
                >
                  <span className="text-lg text-white/75">{use}</span>

                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#d6a85f]" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/35">
              Why ChartHouse
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Your time. Your project.
            </h2>

            <div className="mt-10 space-y-4">
              {studio.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-5"
                >
                  <div className="flex items-center gap-4">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-[#d6a85f]" />

                    <span className="text-white/70">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EQUIPMENT */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/35">
            Equipment & facilities
          </p>

          <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
            Everything you need to get creating.
          </h2>

          <p className="mt-6 text-lg leading-8 text-white/45">
            Each space is designed around the kind of work it is built for,
            giving members a dedicated environment without the overhead of
            running their own studio.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {studio.equipment.map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-white/10 bg-white/[0.035] p-7"
            >
              

              <p className="mt-8 text-lg font-medium text-white/80">
                {item}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm leading-6 text-white/25">
          Equipment specifications and individual models will be added as the
          studio inventory is finalised.
        </p>
      </section>

      {/* BOOKING CTA */}
      <section className="border-t border-white/10 bg-white text-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 md:py-24 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-black/40">
              Ready to create?
            </p>

            <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Book the {studio.name}.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-black/50">
              Members can choose an available date and book a one or two hour
              session.
            </p>
          </div>

          <Link
            href={`/protected/book/${slug}`}
            className="shrink-0 rounded-full bg-black px-8 py-4 text-center text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Book this studio →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-10 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ChartHouse Studios</p>

          <p>Creative spaces for music, content and media.</p>
        </div>
      </footer>
    </main>
  );
}