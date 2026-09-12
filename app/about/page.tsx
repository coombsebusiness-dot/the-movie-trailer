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
      "About The Movie Trailer",

    description:
      "About The Movie Trailer, an independent movie and TV entertainment site covering breaking news, trailers, casting, release dates, reviews and features.",

    alternates: {
      canonical:
        "/about",
    },
  };

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell py-12 sm:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <aside>
            <div className="lg:sticky lg:top-28">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                About Us
              </p>

              <h1 className="mt-4 max-w-lg text-5xl font-black leading-[0.9] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                MOVIES.
                <br />
                TV.
                <br />
                <span className="text-[#f21f2b]">
                  NOISE.
                </span>
              </h1>

              <div className="mt-8 h-px w-20 bg-[#f21f2b]" />

              <p className="mt-8 max-w-sm text-sm font-bold uppercase leading-6 tracking-[0.08em] text-white/45">
                Movie & TV News ·
                Trailers · Casting ·
                Release Dates
              </p>
            </div>
          </aside>

          <div className="max-w-3xl">
            <p className="text-xl font-bold leading-9 text-white/85 sm:text-2xl sm:leading-10">
              The Movie Trailer is an
              independent entertainment
              publication covering the
              stories, trailers and
              announcements shaping
              movies and television.
            </p>

            <div className="my-10 border-t border-white/10" />

            <div className="space-y-10">
              <section>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  What We Cover
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  FROM BREAKING NEWS TO
                  THE BIG SCREEN
                </h2>

                <div className="mt-5 space-y-5 text-base leading-8 text-white/60">
                  <p>
                    We follow the movie
                    and television world
                    every day, covering
                    breaking entertainment
                    news, new trailers,
                    casting developments,
                    release dates,
                    production updates
                    and the stories
                    audiences are talking
                    about.
                  </p>

                  <p>
                    Alongside the daily
                    news cycle, The Movie
                    Trailer publishes
                    reviews, features,
                    interviews,
                    explainers and deeper
                    looks at the films,
                    shows, filmmakers and
                    performers behind
                    them.
                  </p>
                </div>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Our Approach
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  FAST WHEN IT MATTERS.
                  CAREFUL ALWAYS.
                </h2>

                <div className="mt-5 space-y-5 text-base leading-8 text-white/60">
                  <p>
                    Entertainment news
                    moves quickly. We aim
                    to report important
                    developments while
                    they are still fresh,
                    without treating
                    speed as an excuse
                    for poor sourcing or
                    misleading headlines.
                  </p>

                  <p>
                    Our news coverage
                    distinguishes between
                    confirmed information,
                    reporting from
                    established sources
                    and rumours or claims
                    that have not yet
                    been independently
                    confirmed.
                  </p>

                  <p>
                    When another
                    publication breaks a
                    story, we believe in
                    crediting the original
                    reporting and linking
                    readers to the source
                    wherever appropriate.
                  </p>
                </div>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Independent
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  BUILT FOR PEOPLE WHO
                  LOVE MOVIES
                </h2>

                <div className="mt-5 space-y-5 text-base leading-8 text-white/60">
                  <p>
                    The Movie Trailer is
                    independently
                    operated. Our
                    editorial coverage
                    is not controlled by
                    film studios,
                    streaming services
                    or entertainment
                    companies.
                  </p>

                  <p>
                    Reviews represent the
                    views of their
                    individual writers.
                    Commercial
                    relationships,
                    promotional material
                    or affiliate
                    partnerships will be
                    identified where
                    appropriate.
                  </p>
                </div>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  The Mission
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  FIND THE STORY.
                  <br />
                  FOLLOW THE MOVIE.
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  Whether it is a trailer
                  dropping without
                  warning, a major
                  casting announcement,
                  a release-date change
                  or a film everybody is
                  suddenly talking about,
                  our aim is simple:
                  make The Movie Trailer
                  a useful place to find
                  out what is happening,
                  why it matters and
                  what is coming next.
                </p>
              </section>

              <section className="border-t border-white/10 pt-10">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Get In Touch
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                  GOT A STORY?
                </h2>

                <p className="mt-5 text-base leading-8 text-white/60">
                  For press releases,
                  corrections, editorial
                  enquiries, interview
                  opportunities or
                  general enquiries,
                  visit our contact page.
                </p>

                <a
                  href="/contact"
                  className="mt-7 inline-flex items-center border border-[#f21f2b] bg-[#f21f2b] px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-transparent"
                >
                  Contact The Movie
                  Trailer →
                </a>
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