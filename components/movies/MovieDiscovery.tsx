"use client";

import {
  useMemo,
  useState,
} from "react";

import Link from "next/link";

type Movie = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  genre: string | null;
  poster_url: string | null;
  release_date: string | null;
  published_at: string | null;
};

type SortOption =
  | "newest"
  | "az"
  | "year";

type MovieDiscoveryProps = {
  movies: Movie[];
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
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

export default function MovieDiscovery({
  movies,
}: MovieDiscoveryProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const [
    genre,
    setGenre,
  ] = useState("all");

  const [
    year,
    setYear,
  ] = useState("all");

  const [
    sort,
    setSort,
  ] =
    useState<SortOption>(
      "newest",
    );

  const genres =
    useMemo(() => {
      return Array.from(
        new Set(
          movies
            .flatMap(
              (movie) =>
                movie.genre
                  ?.split(
                    /[,/]/,
                  )
                  .map(
                    (item) =>
                      item.trim(),
                  ) ??
                [],
            )
            .filter(Boolean),
        ),
      ).sort((a, b) =>
        a.localeCompare(b),
      );
    }, [movies]);

  const years =
    useMemo(() => {
      return Array.from(
        new Set(
          movies
            .map(
              (movie) =>
                movie.year,
            )
            .filter(
              (
                value,
              ): value is number =>
                typeof value ===
                "number",
            ),
        ),
      ).sort(
        (a, b) => b - a,
      );
    }, [movies]);

  const filteredMovies =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const filtered =
        movies.filter(
          (movie) => {
            const matchesSearch =
              !query ||
              movie.title
                .toLowerCase()
                .includes(
                  query,
                );

            const movieGenres =
              movie.genre
                ?.split(
                  /[,/]/,
                )
                .map(
                  (item) =>
                    item
                      .trim()
                      .toLowerCase(),
                ) ??
              [];

            const matchesGenre =
              genre === "all" ||
              movieGenres.includes(
                genre.toLowerCase(),
              );

            const matchesYear =
              year === "all" ||
              String(
                movie.year,
              ) === year;

            return (
              matchesSearch &&
              matchesGenre &&
              matchesYear
            );
          },
        );

      return [
        ...filtered,
      ].sort(
        (a, b) => {
          if (
            sort === "az"
          ) {
            return a.title.localeCompare(
              b.title,
            );
          }

          if (
            sort === "year"
          ) {
            return (
              (b.year ?? 0) -
              (a.year ?? 0)
            );
          }

          return (
            new Date(
              b.published_at ??
                0,
            ).getTime() -
            new Date(
              a.published_at ??
                0,
            ).getTime()
          );
        },
      );
    }, [
      movies,
      search,
      genre,
      year,
      sort,
    ]);

  function surpriseMe() {
    if (
      filteredMovies.length ===
      0
    ) {
      return;
    }

    const movie =
      filteredMovies[
        Math.floor(
          Math.random() *
            filteredMovies.length,
        )
      ];

    window.location.href =
      `/movies/${movie.slug}`;
  }

  return (
    <section className="site-shell py-12">
      <div className="border-b border-white/10 pb-6">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
          Browse
        </p>

        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-[-0.04em] text-white">
              All Movies
            </h2>

            <p className="mt-2 text-sm font-medium text-white/35">
              {
                filteredMovies.length
              }{" "}
              {filteredMovies.length ===
              1
                ? "movie"
                : "movies"}{" "}
              found
            </p>
          </div>

          <button
            type="button"
            onClick={
              surpriseMe
            }
            className="border border-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#f21f2b]"
          >
            Surprise Me →
          </button>
        </div>
      </div>

      <div className="grid gap-3 border-b border-white/10 py-6 md:grid-cols-2 lg:grid-cols-4">
        <input
          type="search"
          value={search}
          onChange={(
            event,
          ) =>
            setSearch(
              event.target
                .value,
            )
          }
          placeholder="Search movies..."
          className="h-12 border border-white/10 bg-[#0b0d0f] px-4 text-sm font-bold text-white outline-none placeholder:text-white/25 focus:border-[#f21f2b]"
        />

        <select
          value={genre}
          onChange={(
            event,
          ) =>
            setGenre(
              event.target
                .value,
            )
          }
          className="h-12 border border-white/10 bg-[#0b0d0f] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white outline-none focus:border-[#f21f2b]"
        >
          <option value="all">
            All Genres
          </option>

          {genres.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>

        <select
          value={year}
          onChange={(
            event,
          ) =>
            setYear(
              event.target
                .value,
            )
          }
          className="h-12 border border-white/10 bg-[#0b0d0f] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white outline-none focus:border-[#f21f2b]"
        >
          <option value="all">
            All Years
          </option>

          {years.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>

        <select
          value={sort}
          onChange={(
            event,
          ) =>
            setSort(
              event.target
                .value as SortOption,
            )
          }
          className="h-12 border border-white/10 bg-[#0b0d0f] px-4 text-[10px] font-black uppercase tracking-[0.14em] text-white outline-none focus:border-[#f21f2b]"
        >
          <option value="newest">
            Newest
          </option>

          <option value="az">
            A–Z
          </option>

          <option value="year">
            Year
          </option>
        </select>
      </div>

      {filteredMovies.length ? (
        <div className="grid gap-x-6 gap-y-10 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMovies.map(
            (movie) => (
              <Link
                key={
                  movie.id
                }
                href={`/movies/${movie.slug}`}
                className="group block"
              >
                <div className="relative aspect-[2/3] overflow-hidden border border-white/10 bg-[#0b0d0f]">
                  {movie.poster_url ? (
                    <img
                      src={
                        movie.poster_url
                      }
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/15">
                        The Movie
                        Trailer
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />

                  {movie.release_date ? (
                    <div className="absolute bottom-3 left-3 bg-black/85 px-3 py-2 backdrop-blur-sm">
                      <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                        Release
                      </p>

                      <p className="mt-0.5 text-[10px] font-black uppercase tracking-[0.1em] text-white">
                        {formatDate(
                          movie.release_date,
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>

                <div className="pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {movie.year ? (
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                        {
                          movie.year
                        }
                      </span>
                    ) : null}

                    {movie.genre ? (
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
                        {
                          movie.genre
                        }
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-2 text-xl font-black uppercase leading-tight tracking-[-0.035em] text-white transition group-hover:text-[#f21f2b]">
                    {
                      movie.title
                    }
                  </h3>
                </div>
              </Link>
            ),
          )}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-sm font-black uppercase tracking-[0.15em] text-white/30">
            No movies match
            those filters.
          </p>
        </div>
      )}
    </section>
  );
}