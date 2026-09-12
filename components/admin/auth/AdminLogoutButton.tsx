"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";

export default function AdminLogoutButton() {
  const router =
    useRouter();

  const [
    isSigningOut,
    setIsSigningOut,
  ] =
    useState(false);

  async function handleLogout() {
    if (
      isSigningOut
    ) {
      return;
    }

    setIsSigningOut(
      true,
    );

    const supabase =
      createClient();

    await supabase.auth.signOut();

    router.replace(
      "/admin/login",
    );

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={
        handleLogout
      }
      disabled={
        isSigningOut
      }
      className="rounded-md border border-red-500/30 bg-red-500/[0.08] px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-400 transition hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isSigningOut
        ? "Signing Out..."
        : "Log Out"}
    </button>
  );
}