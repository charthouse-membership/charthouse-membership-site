import Link from "next/link";

const sections = [
  {
    title: "1. Who we are",
    text: [
      "ChartHouse Studios is responsible for the personal information described in this policy.",
      "Our address is 36–40 Middle Street, Old Portsmouth, Southsea, PO5 4BP. You can contact us at info@charthousestudios.com.",
    ],
  },
  {
    title: "2. Information we collect",
    text: [
      "We may collect your name, email address, account details, membership status, selected plan, booking history and communications with us.",
      "We also process technical information needed to operate and secure the website, such as login records, IP address, browser information and essential cookie data.",
      "If an under-18 uses the studios, we may collect the details and written consent of their parent or legal guardian.",
    ],
  },
  {
    title: "3. Payment information",
    text: [
      "Membership payments are processed securely by Stripe. ChartHouse Studios does not receive or store your complete payment-card number.",
      "We may receive limited payment information from Stripe, including payment status, customer reference, subscription plan and transaction history.",
    ],
  },
  {
    title: "4. How we use your information",
    text: [
      "We use personal information to create and secure your account, administer memberships, process payments, manage bookings, allocate studio-hour credits and provide customer support.",
      "We may also use it to prevent misuse, resolve disputes, maintain business records and comply with legal or regulatory requirements.",
      "We will only send marketing communications where we have an appropriate lawful basis. You can opt out of marketing at any time.",
    ],
  },
  {
    title: "5. Our lawful bases",
    text: [
      "We process information where it is necessary to perform our contract with you, including providing your membership and bookings.",
      "We also process information to meet legal obligations and for legitimate interests such as protecting our facilities, preventing fraud, improving our service and responding to enquiries.",
      "Where we rely on consent, including for certain marketing or optional cookies, you may withdraw that consent at any time.",
    ],
  },
  {
    title: "6. Service providers",
    text: [
      "We use trusted service providers to operate the membership platform. These currently include Supabase for accounts and database services, Stripe for payments, Vercel for website hosting and Resend for transactional emails.",
      "These providers process information on our behalf or under their own legal responsibilities. We only share information reasonably required for them to provide their services.",
    ],
  },
  {
    title: "7. International transfers",
    text: [
      "Some service providers may process information outside the United Kingdom.",
      "Where required, we rely on recognised safeguards such as UK adequacy regulations, approved contractual protections or other lawful transfer mechanisms.",
    ],
  },
  {
    title: "8. How long we retain information",
    text: [
      "We retain account and membership information while your account is active and for a reasonable period afterward.",
      "Payment, contractual and accounting records may normally be retained for up to six years where required for legal, tax or dispute-resolution purposes.",
      "Enquiries and routine communications are deleted when they are no longer reasonably needed. Security records are retained only for an appropriate period.",
    ],
  },
  {
    title: "9. Cookies",
    text: [
      "The website uses essential cookies and similar technologies for login sessions, security, account access and payment-related functions.",
      "Essential cookies are required for the service to work and cannot normally be disabled through our website.",
      "If we introduce non-essential analytics, advertising or tracking cookies, we will request consent where required and update this policy.",
    ],
  },
  {
    title: "10. Under-18s",
    text: [
      "Under-18s may only use the studios with written consent from a parent or legal guardian and in accordance with our membership terms.",
      "We only collect information about an under-18 where it is reasonably necessary to manage consent, safety, access or a booking.",
    ],
  },
  {
    title: "11. Data security",
    text: [
      "We use reasonable technical and organisational measures to protect personal information against unauthorised access, alteration, disclosure or loss.",
      "No internet service can guarantee complete security, but we regularly review how information is handled and restrict access where appropriate.",
    ],
  },
  {
    title: "12. Your rights",
    text: [
      "Depending on the circumstances, you may have rights to access, correct or delete your personal information, restrict or object to its use, and receive certain information in a portable format.",
      "You may also withdraw consent where consent is our lawful basis. Some rights are subject to legal exceptions.",
      "To exercise a right, email info@charthousestudios.com. We may need to verify your identity before responding.",
    ],
  },
  {
    title: "13. Complaints",
    text: [
      "Please contact us first if you have concerns about how we use your information so that we can try to resolve them.",
      "You also have the right to complain to the Information Commissioner’s Office, the UK data-protection regulator, at ico.org.uk.",
    ],
  },
  {
    title: "14. Changes to this policy",
    text: [
      "We may update this policy when our services, providers or legal responsibilities change.",
      "The latest version will always be published on this page with its updated date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.25em]"
          >
            ChartHouse Studios
          </Link>

          <Link
            href="/"
            className="text-sm text-white/50 transition hover:text-white"
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20 md:py-28">
        <p className="text-sm uppercase tracking-[0.3em] text-[#d6a85f]">
          Legal
        </p>

        <h1 className="mt-5 text-5xl font-semibold tracking-tight md:text-7xl">
          Privacy Policy
        </h1>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/50">
          This policy explains what information ChartHouse Studios collects
          through its membership website and how we use and protect it.
        </p>

        <p className="mt-4 text-sm text-white/30">
          Last updated: 11 August 2026
        </p>
      </section>

      <section className="border-y border-white/10 bg-white/[0.025]">
        <div className="mx-auto max-w-5xl divide-y divide-white/10 px-6 py-12">
          {sections.map((section) => (
            <article key={section.title} className="py-10">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {section.title}
              </h2>

              <div className="mt-5 max-w-3xl space-y-4">
                {section.text.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-7 text-white/55"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-5 px-6 py-10 text-sm text-white/40">
          <Link href="/terms" className="hover:text-white">
            Terms & Conditions
          </Link>

          <a
            href="mailto:info@charthousestudios.com"
            className="hover:text-white"
          >
            Contact ChartHouse
          </a>
        </div>
      </footer>
    </main>
  );
}