"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
  <Button
    variant="ghost"
    size="sm"
    onClick={logout}
    className="mt-2 h-auto p-0 text-xs font-normal text-white/40 hover:bg-transparent hover:text-white"
  >
    Log out
  </Button>
);
}
