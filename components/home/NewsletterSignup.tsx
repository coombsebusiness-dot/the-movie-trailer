"use client";

import {
  FormEvent,
  useState,
} from "react";

export default function NewsletterSignup() {
  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const [
    success,
    setSuccess,
  ] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!email.trim()) {
      setSuccess(false);
      setMessage(
        "Enter your email address first.",
      );
      return;
    }

    setSubmitting(true);
    setMessage("");
    setSuccess(false);

    try {
      const response =
        await fetch(
          "/api/newsletter/subscribe",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                email,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to subscribe.",
        );
      }

      setSuccess(true);

      setMessage(
        data.message ||
          "You're subscribed.",
      );

      setEmail("");
    } catch (error) {
      setSuccess(false);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="site-shell section-rule py-10">
      <div className="relative overflow-hidden border border-[#f21f2b]/50 bg-[#090b0d]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(242,31,43,0.18),transparent_38%)]" />

        <div className="relative grid gap-8 p-7 md:p-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
              Stay In The Loop
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-black uppercase leading-[0.95] tracking-[-0.045em] md:text-5xl">
              Get The Latest Movie
              & TV News
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-white/45">
              Breaking stories,
              trailers, casting,
              release dates and the
              biggest entertainment
              updates delivered
              straight to your inbox.
            </p>
          </div>

          <div>
            <form
              onSubmit={
                handleSubmit
              }
              className="flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                value={email}
                onChange={(
                  event,
                ) =>
                  setEmail(
                    event.target
                      .value,
                  )
                }
                placeholder="Your email address..."
                autoComplete="email"
                disabled={
                  submitting
                }
                className="min-w-0 flex-1 border border-white/10 bg-white px-4 py-4 text-sm font-bold text-black outline-none placeholder:text-black/35 focus:border-[#f21f2b] disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  submitting
                }
                className="bg-[#f21f2b] px-7 py-4 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Joining..."
                  : "Subscribe"}
              </button>
            </form>

            {message ? (
              <p
                className={`mt-3 text-xs font-bold ${
                  success
                    ? "text-white/70"
                    : "text-[#f21f2b]"
                }`}
              >
                {
                  message
                }
              </p>
            ) : (
              <p className="mt-3 text-[10px] leading-5 text-white/25">
                No spam. Just the
                movie and TV stories
                worth knowing about.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}