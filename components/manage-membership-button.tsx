"use client";

import { useState } from "react";

export default function ManageMembershipButton() {
  const [loading, setLoading] = useState(false);

  async function handleManageMembership() {
    try {
      setLoading(true);

      const response = await fetch("/api/billing-portal", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Unable to open billing portal"
        );
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
      alert("Could not open membership management.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleManageMembership}
      disabled={loading}
      className="mt-6 w-full rounded-full border border-white/20 px-6 py-4 font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading ? "Opening..." : "Manage Membership"}
    </button>
  );
}