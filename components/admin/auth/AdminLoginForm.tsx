"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/client";

export default function AdminLoginForm() {
  const router =
    useRouter();

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    password,
    setPassword,
  ] =
    useState("");

  const [
    isSigningIn,
    setIsSigningIn,
  ] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    );

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      isSigningIn
    ) {
      return;
    }

    setIsSigningIn(
      true,
    );

    setErrorMessage(
      null,
    );

    try {
      const supabase =
        createClient();

      const {
        error,
      } =
        await supabase.auth.signInWithPassword({
          email:
            email.trim(),
          password,
        });

      if (
        error
      ) {
        throw error;
      }

      router.replace(
        "/admin",
      );

      router.refresh();
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to sign in.",
      );
    } finally {
      setIsSigningIn(
        false,
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="mt-8 space-y-5"
    >
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-white/40"
        >
          Email
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={
            email
          }
          onChange={
            event =>
              setEmail(
                event.target.value,
              )
          }
          className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-red-500"
          placeholder="editor@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-xs font-black uppercase tracking-[0.18em] text-white/40"
        >
          Password
        </label>

        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={
            password
          }
          onChange={
            event =>
              setPassword(
                event.target.value,
              )
          }
          className="w-full rounded-md border border-white/10 bg-black px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-red-500"
          placeholder="••••••••••••"
        />
      </div>

      {errorMessage && (
        <div className="rounded-md border border-red-500/20 bg-red-500/[0.08] px-4 py-3 text-sm font-bold text-red-300">
          {
            errorMessage
          }
        </div>
      )}

      <button
        type="submit"
        disabled={
          isSigningIn
        }
        className="w-full rounded-md bg-red-600 px-5 py-3.5 text-sm font-black uppercase tracking-[0.15em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSigningIn
          ? "Signing In..."
          : "Enter Newsroom"}
      </button>
    </form>
  );
}