import Link from "next/link";

const sections = [
  {
    title: "1. About these terms",
    text: [
      "These terms apply to ChartHouse Studios membership subscriptions, studio bookings and use of our facilities at 36–40 Middle Street, Old Portsmouth, Southsea, PO5 4BP.",
      "By purchasing a membership or booking a studio, you agree to these terms.",
    ],
  },
  {
    title: "2. Membership",
    text: [
      "Membership provides the number of studio hours included in the plan selected at checkout. Membership is personal to the account holder and may not be transferred or shared.",
      "Membership fees are charged monthly through Stripe using the payment method supplied by the member.",
    ],
  },
  {
    title: "3. Monthly studio hours",
    text: [
      "Included studio hours renew at the beginning of each monthly billing period. Unused hours expire at the end of that billing period and do not roll over.",
      "Hours have no cash value and cannot be exchanged, transferred or refunded except where required by law.",
    ],
  },
  {
    title: "4. Changing membership",
    text: [
      "Membership upgrades take effect immediately. Stripe will calculate and charge the prorated difference for the remainder of the current billing period.",
      "Membership downgrades take effect at the beginning of the next billing period.",
    ],
  },
  {
    title: "5. Cancelling membership",
    text: [
      "Members may cancel through the membership-management facility in their account. Cancellation normally takes effect at the end of the current paid billing period.",
      "Membership benefits remain available until that date. We do not normally provide partial refunds for unused time, subject to the member’s statutory rights.",
    ],
  },
  {
    title: "6. Cooling-off rights",
    text: [
      "Consumers purchasing online may have a statutory right to cancel during an applicable cooling-off period.",
      "If you ask us to begin providing membership services during that period and use studio hours, we may deduct a proportionate amount for services already supplied where permitted by law. Your statutory rights are not affected by these terms.",
    ],
  },
  {
    title: "7. Booking studios",
    text: [
      "Bookings are subject to availability and must be made through the member dashboard. Members must only book rooms and times they genuinely intend to use.",
      "The member must check that the selected room and included equipment are suitable for their intended session.",
    ],
  },
  {
    title: "8. Booking cancellations",
    text: [
      "If a booking is cancelled more than 24 hours before its scheduled start time, the studio-hour credit will be returned to the member’s account.",
      "If it is cancelled within 24 hours of the start time, the credit will be lost. Missed sessions and late arrivals do not entitle the member to replacement time.",
    ],
  },
  {
    title: "9. Dry hire",
    text: [
      "Membership bookings are for dry hire of the selected room and its included equipment. An engineer, technician or camera operator is not included.",
      "On a member’s first visit, a ChartHouse team member will provide an introductory explanation of the room and how to set up and use its included equipment safely.",
      "Additional production assistance may be arranged in advance for an additional fee, subject to staff availability. Contact info@charthousestudios.com before booking.",
    ],
  },
  {
    title: "10. Access and conduct",
    text: [
      "Members must follow reasonable instructions from ChartHouse staff, use equipment safely and leave rooms in a clean and orderly condition.",
      "Illegal, dangerous, abusive or seriously disruptive behaviour is not permitted. Smoking and unauthorised hazardous equipment are prohibited.",
      "We may refuse access or suspend a membership where reasonably necessary to protect people, property or the operation of the studios.",
    ],
  },
  {
    title: "11. Under-18s",
    text: [
      "Anyone under 18 must have written consent from a parent or legal guardian before using the studios.",
      "We may require an under-18 to be accompanied or supervised depending on their age, the room being used and the nature of the session. Payment and contractual responsibility must be accepted by an adult.",
    ],
  },
  {
    title: "12. Guests",
    text: [
      "Members are responsible for the conduct of anyone they bring into the premises. Guests must follow these terms and all reasonable staff instructions.",
      "The account holder remains responsible for their booking and for any loss or damage caused by their guests.",
    ],
  },
  {
    title: "13. Equipment damage",
    text: [
      "Members must report faults, accidents and damage immediately. Members must not attempt unauthorised repairs.",
      "Where a member or their guest causes damage through misuse, negligence or failure to follow instructions, the member may be charged the reasonable cost of repair or replacement.",
      "Fair wear and tear and pre-existing faults will not be charged to the member.",
    ],
  },
  {
    title: "14. Availability and interruptions",
    text: [
      "We may occasionally need to change or cancel a booking because of equipment failure, maintenance, safety concerns or circumstances beyond our reasonable control.",
      "Where ChartHouse cancels a booking, we will normally return the affected studio-hour credit or offer an appropriate alternative. We are not responsible for indirect losses such as lost profit or lost opportunities, except where liability cannot legally be excluded.",
    ],
  },
  {
    title: "15. Contact and governing law",
    text: [
      "Questions or complaints should be sent to info@charthousestudios.com.",
      "These terms are governed by the laws of England and Wales. Nothing in these terms removes any rights or remedies that consumers have under applicable law.",
    ],
  },
];

export default function TermsPage() {
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
          Membership Terms & Conditions
        </h1>

        <p className="mt-7 max-w-3xl text-lg leading-8 text-white/50">
          These terms explain how ChartHouse membership, studio hours and
          bookings work.
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
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
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