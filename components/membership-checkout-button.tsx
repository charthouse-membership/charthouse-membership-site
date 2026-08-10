"use client";

import { useState } from "react";

export default function MembershipCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    try {
      setLoading(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Unable to start checkout");
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Could not start membership checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCheckout}
      disabled={loading}
      className="mt-6 w-full rounded-full bg-white px-6 py-4 font-semibold text-black transition hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Opening checkout..." : "Join for £30 / month"}
    </button>
  );
}