import Link from "next/link";

type Movie = {
  slug: string;
  title: string;
  year: number | null;
  synopsis: string | null;
  release_date: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  director: string | null;
  genre: string | null;
  tagline: string | null;
};

type FeaturedMovieProps = {
  movie: Movie;
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

export default function FeaturedMovie({
  movie,
}: FeaturedMovieProps) {
  return (
    <section className="border-b border-white/10 bg-[#050607]">
      <div className="site-shell py-10 md:py-14">
        {/* SECTION LABEL */}

        <div className="mb-6 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-[#f21f2b]" />

          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/35">
            Featured Movie
          </p>
        </div>

        {/* FEATURE */}

        <div className="relative overflow-hidden border border-white/10 bg-[#0b0d0f]">
          {/* BACKDROP */}

          {movie.backdrop_url ? (
            <img
              src={movie.backdrop_url}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
          ) : null}

          {/* OVERLAYS */}

          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-black/25" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* CONTENT */}

          <div className="relative z-10 grid min-h-[520px] lg:grid-cols-[300px_1fr] xl:grid-cols-[340px_1fr]">
            {/* POSTER */}

            <div className="hidden p-8 lg:block xl:p-10">
              <Link
                href={`/movies/${movie.slug}`}
                className="group/poster block"
              >
                <div className="aspect-[2/3] overflow-hidden border border-white/10 bg-black shadow-2xl">
                  {movie.poster_url ? (
                    <img
                      src={movie.poster_url}
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover transition duration-500 group-hover/poster:scale-[1.025]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="px-6 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white/20">
                        The Movie Trailer
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>

            {/* DETAILS */}

            <div className="flex items-end p-7 md:p-10 lg:items-center lg:px-12 xl:px-16">
              <div className="max-w-3xl">
                {/* META */}

                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-[#f21f2b] px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white">
                    Movie
                  </span>

                  {movie.year ? (
                    <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                      {movie.year}
                    </span>
                  ) : null}

                  {movie.genre ? (
                    <>
                      <span className="text-white/20">
                        •
                      </span>

                      <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/50">
                        {movie.genre}
                      </span>
                    </>
                  ) : null}
                </div>

                {/* TITLE */}

                <h2 className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-[-0.055em] text-white md:text-6xl xl:text-7xl">
                  {movie.title}
                </h2>

                {/* TAGLINE */}

                {movie.tagline ? (
                  <p className="mt-5 max-w-2xl text-lg font-bold leading-7 text-white/70">
                    {movie.tagline}
                  </p>
                ) : null}

                {/* SYNOPSIS */}

                {movie.synopsis ? (
                  <p className="mt-5 max-w-2xl text-sm font-medium leading-7 text-white/45 md:text-base">
                    {movie.synopsis}
                  </p>
                ) : null}

                {/* FACTS */}

                <div className="mt-7 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
                  {movie.director ? (
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                        Director
                      </p>

                      <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-white/65">
                        {movie.director}
                      </p>
                    </div>
                  ) : null}

                  {movie.release_date ? (
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                        Release
                      </p>

                      <p className="mt-1 text-xs font-black uppercase tracking-[0.08em] text-white/65">
                        {formatDate(
                          movie.release_date,
                        )}
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* CTA */}

                <div className="mt-8">
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="inline-flex items-center bg-[#f21f2b] px-6 py-4 text-[10px] font-black uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                  >
                    Explore Movie
                    <span className="ml-3">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}