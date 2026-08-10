import Link from "next/link";

export default async function HowItWorksPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const params = await searchParams;
  const isMember = params.from === "members";
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Link
            href={isMember ? "/protected" : "/"}
            className="text-sm font-semibold uppercase tracking-[0.25em]"
          >
            ChartHouse Studios
          </Link>

          <Link
            href={isMember ? "/protected" : "/"}
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back to ChartHouse
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <p className="text-sm uppercase tracking-[0.3em] text-white/35">
          How It Works
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
          Simple from the moment you join.
        </h1>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/50 md:text-xl">
          We want your experience at ChartHouse Studios to be straightforward.
          Here’s exactly what happens from creating your account to arriving
          for your studio session.
        </p>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <div className="space-y-0">
            {[
              {
                number: "01",
                title: "Create your account",
                text: "Join the members' lounge for free. You don't pay anything until you're ready to book.",
              },
              {
                number: "02",
                title: "Choose your membership",
                text: "Select the membership that gives you the studio hours you need.",
              },
              {
                number: "03",
                title: "Book your studio",
                text: "Choose the studio, date and time that work for you. Your available hours are shown in your member dashboard.",
              },
              {
                number: "04",
                title: "Get your confirmation",
                text: "You'll receive confirmation of your booking with the details you need for your visit.",
              },
              {
                number: "05",
                title: "Arrive at ChartHouse",
                text: "Come to 36–40 Middle Street, Old Portsmouth, Southsea, PO5 4BP and head to reception.",
              },
              {
                number: "06",
                title: "We'll show you in",
                text: "A member of the ChartHouse team will meet you, get you checked in and show you to your studio.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="grid gap-6 border-b border-white/10 py-10 md:grid-cols-[100px_1fr]"
              >
                <p className="text-sm tracking-[0.25em] text-white/25">
                  {step.number}
                </p>

                <div>
                  <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {step.title}
                  </h2>

                  <p className="mt-4 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.045] p-8 md:p-12">
          <p className="text-sm uppercase tracking-[0.25em] text-white/35">
            Your first visit
          </p>

          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            You won't be left wondering what to do.
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-7 text-white/50 md:text-lg">
            Once your booking is confirmed, you’ll have the details you need
            for your visit. When you arrive at ChartHouse, simply head to
            reception. A member of our team will meet you and make sure you’re
            shown to the right studio.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white text-black">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-24">
          <p className="text-sm uppercase tracking-[0.25em] text-black/40">
            Need a hand?
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Still have questions?
          </h2>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-black/50">
            We’re happy to help. If there’s anything you’re unsure about
            before joining or booking a studio, just send us an email.
          </p>

          <a
            href="mailto:info@charthousestudios.com"
            className="mt-8 inline-flex rounded-full bg-black px-7 py-4 text-sm font-semibold text-white transition hover:bg-black/80"
          >
            Email ChartHouse →
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs text-white/25">
            © 2026 ChartHouse Studios
          </p>
        </div>
      </footer>
    </main>
  );
}