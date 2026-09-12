import type {
  Metadata,
} from "next";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";

import {
  getComingSoonArchive,
} from "@/lib/tmdb/comingSoon";

export const metadata: Metadata = {
  title:
    "Coming Soon: Upcoming Movies & UK Cinema Release Dates",

  description:
    "Discover movies coming soon to UK cinemas, with upcoming release dates, posters and the latest film information.",

  alternates: {
    canonical:
      "/coming-soon",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "Coming Soon: Upcoming Movies & UK Cinema Release Dates | The Movie Trailer",
    description:
      "Discover movies coming soon to UK cinemas, with upcoming release dates, posters and the latest film information.",
    url:
      "/coming-soon",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Coming Soon: Upcoming Movies & UK Cinema Release Dates | The Movie Trailer",
    description:
      "Discover movies coming soon to UK cinemas, with upcoming release dates, posters and the latest film information.",
  },
};

function formatReleaseDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    new Date(
      `${value}T00:00:00Z`,
    ),
  );
}

function formatMonth(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    },
  ).format(
    new Date(
      `${value}T00:00:00Z`,
    ),
  );
}

export default async function ComingSoonPage() {
  const movies =
    await getComingSoonArchive();

  const groupedMovies =
    movies.reduce<
      Record<
        string,
        typeof movies
      >
    >(
      (
        groups,
        movie,
      ) => {
        const month =
          movie.releaseDate.slice(
            0,
            7,
          );

        if (!groups[month]) {
          groups[month] =
            [];
        }

        groups[month].push(
          movie,
        );

        return groups;
      },
      {},
    );

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="site-shell relative overflow-hidden py-14 md:py-20">
        <div className="pointer-events-none absolute -right-24 top-0 h-[360px] w-[360px] rounded-full bg-[#f21f2b]/10 blur-[120px]" />

        <div className="relative max-w-4xl">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
            Release Calendar
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase leading-[0.88] tracking-[-0.06em] md:text-7xl lg:text-8xl">
            Coming
            <br />
            Soon
          </h1>

          <p className="mt-7 max-w-2xl text-sm leading-7 text-white/50 md:text-base">
            Upcoming movies
            heading to UK cinemas
            over the next 90 days.
            Browse release dates,
            posters and the films
            arriving on the big
            screen.
          </p>
        </div>
      </section>

      <section className="site-shell section-rule pb-16 pt-9">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
              On The Horizon
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] md:text-4xl">
              UK Cinema Releases
            </h2>
          </div>

          {movies.length >
          0 ? (
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
              {
                movies.length
              }{" "}
              upcoming{" "}
              {movies.length ===
              1
                ? "release"
                : "releases"}
            </p>
          ) : null}
        </div>

        {movies.length ===
        0 ? (
          <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
              Release Calendar
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
              Coming Soon
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/40">
              Upcoming cinema
              information is
              currently unavailable.
              Check back soon for the
              latest UK release
              dates.
            </p>
          </div>
        ) : (
          <div className="space-y-14">
            {Object.entries(
              groupedMovies,
            ).map(
              ([
                month,
                monthMovies,
              ]) => (
                <section
                  key={month}
                >
                  <div className="mb-6 flex items-center gap-5">
                    <h2 className="shrink-0 text-xl font-black uppercase tracking-[-0.035em] md:text-2xl">
                      {formatMonth(
                        `${month}-01`,
                      )}
                    </h2>

                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  <div className="grid gap-x-5 gap-y-9 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {monthMovies.map(
                      (
                        movie,
                      ) => (
                        <article
                          key={
                            movie.id
                          }
                          className="group"
                        >
                          <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0b0d0f]">
                            {movie.posterUrl ? (
                              <img
                                src={
                                  movie.posterUrl
                                }
                                alt={`${movie.title} poster`}
                                loading="lazy"
                                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/20">
                                  Poster
                                  Coming
                                  Soon
                                </span>
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent px-4 pb-4 pt-16">
                              <p className="text-[9px] font-black uppercase tracking-[0.15em] text-[#f21f2b]">
                                {formatReleaseDate(
                                  movie.releaseDate,
                                )}
                              </p>
                            </div>
                          </div>

                          <h3 className="mt-4 text-lg font-black leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-[#f21f2b]">
                            {
                              movie.title
                            }
                          </h3>

                          {movie.overview ? (
                            <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/40">
                              {
                                movie.overview
                              }
                            </p>
                          ) : (
                            <p className="mt-2 text-xs leading-5 text-white/25">
                              More
                              information
                              coming soon.
                            </p>
                          )}
                        </article>
                      ),
                    )}
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </section>

      <section className="site-shell pb-12">
        <div className="border-t border-white/[0.08] pt-6">
          <p className="max-w-3xl text-[10px] leading-5 text-white/25">
            Release information
            can change. Dates shown
            are based on current UK
            theatrical release data
            and may be updated by
            distributors.
          </p>

          <p className="mt-2 text-[10px] leading-5 text-white/25">
            This product uses the
            TMDB API but is not
            endorsed or certified by
            TMDB.
          </p>
        </div>
       </section>

      <NewsletterSignup />

      <SiteFooter />

    </main>
  );
}