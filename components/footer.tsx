import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">

          {/* BRAND */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">
              ChartHouse Studios
            </p>

            <p className="mt-4 max-w-sm text-sm leading-6 text-white/40">
              Creative spaces for music, content and media.
            </p>
          </div>

          {/* CONTACT */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/30">
              Contact
            </p>

            <a
              href="mailto:info@charthousestudios.com"
              className="mt-4 block text-sm text-white/60 transition hover:text-white"
            >
              info@charthousestudios.com
            </a>

            <p className="mt-3 max-w-xs text-sm leading-6 text-white/40">
              36–40 Middle Street,
              <br />
              Old Portsmouth, Southsea,
              <br />
              PO5 4BP
            </p>
          </div>

          {/* LINKS */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/30">
              Explore
            </p>

            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link
                href="/studios"
                className="text-white/60 transition hover:text-white"
              >
                Studios
              </Link>

              <Link
                href="/"
                className="text-white/60 transition hover:text-white"
              >
                Membership
              </Link>

              <Link
                href="/auth/login"
                className="text-white/60 transition hover:text-white"
              >
                Member Sign in
              </Link>

              <a
                href="https://charthousestudios.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d6a85f] transition hover:text-white"
              >
                Visit ChartHouse →
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/25 md:flex-row md:items-center md:justify-between">
          <p>© 2026 ChartHouse Studios</p>

          <div className="flex gap-5">
  <Link
    href="/privacy"
    className="transition hover:text-white"
  >
    Privacy Policy
  </Link>

  <Link
    href="/terms"
    className="transition hover:text-white"
  >
    Terms & Conditions
  </Link>
</div>
        </div>
      </div>
    </footer>
  );
}