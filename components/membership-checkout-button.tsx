"use client";

import { useState } from "react";

const MEMBERSHIPS = [
  {
    hours: 4,
    price: "£30",
    priceId: "price_1U3JbJGPuFHpS79dXBil4qZ9",
  },
  {
    hours: 8,
    price: "£50",
    priceId: "price_1U3JcLGPuFHpS79dE5w83NQe",
  },
  {
    hours: 12,
    price: "£70",
    priceId: "price_1U3JcQGPuFHpS79dNmuxixK5",
  },
];

export default function MembershipCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  async function handleCheckout(priceId: string) {
    try {
      setLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Could not start membership checkout.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowOptions(true)}
        disabled={loading}
        className="mt-6 w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:bg-gray-200"
      >
        Join now — choose your membership
      </button>

      {showOptions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 text-black">
            <h2 className="text-2xl font-bold">
              Choose your membership
            </h2>

            <p className="mt-2 text-gray-600">
              Choose how much studio time you need each month.
            </p>

            <div className="mt-6 space-y-3">
              {MEMBERSHIPS.map((membership) => (
                <button
                  key={membership.priceId}
                  type="button"
                  disabled={loading}
                  onClick={() => handleCheckout(membership.priceId)}
                  className="flex w-full items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 text-left transition hover:border-black"
                >
                  <span>
                    <span className="block text-lg font-semibold">
                      {membership.hours} hours / month
                    </span>
                    <span className="text-sm text-gray-500">
                      Studio membership
                    </span>
                  </span>

                  <span className="text-lg font-bold">
                    {membership.price} / month
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowOptions(false)}
              disabled={loading}
              className="mt-5 w-full rounded-full border border-gray-300 px-6 py-3 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}