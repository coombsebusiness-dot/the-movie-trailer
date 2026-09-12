import type {
  Metadata,
} from "next";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata:
  Metadata = {
    title:
      "Contact The Movie Trailer",
    description:
      "Contact The Movie Trailer for entertainment news tips, press releases, screeners, interview opportunities, corrections and editorial enquiries.",
    alternates: {
      canonical:
        "/contact",
    },
  };

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Contact
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                GOT A
                <br />
                <span className="text-[#f21f2b]">
                  STORY?
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                News Tips · Press ·
                Screeners · Interviews ·
                Corrections
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              Whether you have breaking
              movie news, a trailer,
              casting announcement,
              release-date update or
              something you think our
              readers should know about,
              we want to hear from you.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-8">
              <section className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Press & Publicity
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                  PRESS RELEASES &
                  ENTERTAINMENT NEWS
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  Publicists, studios,
                  distributors, networks,
                  streaming platforms and
                  production companies
                  are welcome to send us
                  press releases, official
                  announcements, trailer
                  launches, first-look
                  material, casting news
                  and release updates.
                </p>
              </section>

              <section className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Reviews
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                  SCREENERS & REVIEW
                  OPPORTUNITIES
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  We welcome enquiries
                  regarding film and
                  television screeners,
                  preview screenings,
                  premieres and other
                  review opportunities.
                  Providing access does
                  not guarantee coverage
                  or a positive review.
                </p>
              </section>

              <section className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Interviews
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                  TALENT & FILMMAKER
                  INTERVIEWS
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  For interview
                  opportunities involving
                  actors, directors,
                  writers, producers and
                  other people working
                  across film and
                  television, please get
                  in touch with the
                  relevant details and
                  availability.
                </p>
              </section>

              <section className="border border-white/10 bg-white/[0.025] p-6 sm:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  News Tips
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.035em] sm:text-3xl">
                  SPOTTED SOMETHING?
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  Readers can send us
                  potential stories,
                  corrections or useful
                  information relating to
                  something we have
                  covered. Please include
                  a source or supporting
                  information wherever
                  possible.
                </p>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Email
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  GET IN TOUCH
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-white/60">
                  For press releases,
                  editorial enquiries,
                  news tips, screeners,
                  interviews and general
                  enquiries, contact:
                </p>

                <a
                  href="mailto:editor@the-movie-trailer.com"
                  className="mt-7 inline-flex break-all border border-[#f21f2b] bg-[#f21f2b] px-6 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-transparent"
                >
                  editor@the-movie-trailer.com
                </a>

                <p className="mt-5 text-xs leading-6 text-white/35">
                  Please include a clear
                  subject line and any
                  relevant links,
                  embargo information or
                  publication dates.
                </p>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Corrections
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  FOUND AN ERROR?
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  Accuracy matters to us.
                  If you believe
                  something published on
                  The Movie Trailer is
                  inaccurate, please
                  contact us with the
                  article URL, the
                  information you
                  believe needs
                  correcting and, where
                  possible, a reliable
                  source supporting the
                  correction.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}