import type {
  Metadata,
} from "next";

import Link from "next/link";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import MovieDiscovery from "@/components/movies/MovieDiscovery";
import FeaturedMovie from "@/components/movies/FeaturedMovie";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Movies",

  description:
    "Explore the latest movies, upcoming releases, trailers, cast information, release dates and everything we know on The Movie Trailer.",

  alternates: {
    canonical:
      "/movies",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "Movies | The Movie Trailer",
    description:
      "Explore the latest movies, upcoming releases, trailers, cast information, release dates and everything we know on The Movie Trailer.",
    url:
      "/movies",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Movies | The Movie Trailer",
    description:
      "Explore the latest movies, upcoming releases, trailers, cast information, release dates and everything we know on The Movie Trailer.",
  },
};

function formatDate(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day:
        "numeric",
      month:
        "short",
      year:
        "numeric",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

export default async function MoviesPage() {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const { data: movies, error } = await supabase
  .from("movies")
  .select(`
    id,
    slug,
    title,
    year,
    synopsis,
    release_date,
    poster_url,
    backdrop_url,
    director,
    genre,
    tagline,
    published_at,
    is_featured
  `)
  .eq("status", "published")
  .lte("published_at", now)
  .order("published_at", { ascending: false });

  if (error) {
    console.error(
      "Unable to load movies:",
      error,
    );
  }

 const publishedMovies =
  movies ?? [];

const featuredMovie =
  publishedMovies.find(
    (
      movie,
    ) =>
      movie.is_featured,
  ) ??
  publishedMovies[0] ??
  null;

const remainingMovies =
  publishedMovies.filter(
    (
      movie,
    ) =>
      movie.id !==
      featuredMovie?.id,
  );

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      {/* PAGE HEADER */}
      <section className="border-b border-white/10 bg-[#08090b]">
        <div className="site-shell py-12 md:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f21f2b]">
                The Movie Trailer
              </p>

              <h1 className="mt-3 text-5xl font-black uppercase leading-none tracking-[-0.055em] md:text-7xl">
                Movies
              </h1>

              <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/50">
                Upcoming releases, new movies, trailers,
                cast information, release dates and
                everything we know.
              </p>
            </div>

            {publishedMovies.length ? (
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                {
                  publishedMovies.length
                }{" "}
                {publishedMovies.length === 1
                  ? "Movie"
                  : "Movies"}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      {featuredMovie ? (
        <>
          {/* FEATURED MOVIE */}
          <FeaturedMovie
  movie={featuredMovie}
/>

          {/* MOVIE GRID */}
          <MovieDiscovery
  movies={remainingMovies}
/>
        </>
      ) : (
        /* EMPTY STATE */
        <section className="site-shell py-20">
          <div className="border border-white/10 bg-[#0b0d0f] px-6 py-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
              Movies
            </p>

            <h2 className="mt-4 text-3xl font-black uppercase tracking-[-0.04em]">
              Movie coverage is coming soon
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/40">
              We&apos;re building our movie library with
              trailers, release dates, cast information
              and the latest updates.
            </p>
          </div>
        </section>
      )}

      <NewsletterSignup />

      <SiteFooter />

    </main>
  );
}