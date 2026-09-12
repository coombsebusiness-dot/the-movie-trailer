import {
  getComingSoonMovies,
  getComingToDigitalMovies,
} from "@/lib/tmdb/comingSoon";

function formatReleaseDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

export default async function ComingSoon() {
  const [
    comingSoonData,
    digitalData,
  ] = await Promise.all([
    getComingSoonMovies(),
    getComingToDigitalMovies(),
  ]);

  /*
   * Keep the homepage calendar deliberately
   * compact. Full release coverage can live
   * on dedicated calendar pages later.
   */
  const movies =
    comingSoonData.slice(
      0,
      5,
    );

  const digitalMovies =
    digitalData.slice(
      0,
      4,
    );

  return (
    <section>
      <div className="mb-5 flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
            Release Calendar
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">
            Coming Soon
          </h2>
        </div>

        <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
          Next 7 Days
        </span>
      </div>

      {movies.length ? (
        <div className="divide-y divide-white/10">
          {movies.map(
            (
              movie,
            ) => (
              <article
                key={
                  movie.id
                }
                className="group grid grid-cols-[54px_1fr] gap-4 py-3.5 first:pt-0"
              >
                <div className="relative aspect-[2/3] overflow-hidden bg-[#0b0d0f]">
                  {movie.posterUrl ? (
                    <img
                      src={
                        movie.posterUrl
                      }
                      alt={`${movie.title} poster`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center border border-white/10">
                      <span className="text-[7px] font-black uppercase tracking-[0.12em] text-white/15">
                        TMT
                      </span>
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                    {formatReleaseDate(
                      movie.releaseDate,
                    )}
                  </p>

                  <h3 className="mt-1 text-sm font-black leading-snug text-white">
                    {
                      movie.title
                    }
                  </h3>

                  <p className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
                    UK Cinema Release
                  </p>
                </div>
              </article>
            ),
          )}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#0b0d0f] p-5">
          <p className="text-sm font-bold leading-6 text-white/35">
            Coming soon information is currently unavailable.
          </p>
        </div>
      )}

      {digitalMovies.length >
      0 ? (
        <div className="mt-7 border-t border-white/10 pt-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                Home Release
              </p>

              <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.04em] text-white">
                Coming to Digital
              </h3>
            </div>

            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/20">
              Next 14 Days
            </span>
          </div>

          <div className="divide-y divide-white/10">
            {digitalMovies.map(
              (
                movie,
              ) => (
                <article
                  key={
                    movie.id
                  }
                  className="group grid grid-cols-[48px_1fr] gap-4 py-3.5 first:pt-0"
                >
                  <div className="relative aspect-[2/3] overflow-hidden bg-[#0b0d0f]">
                    {movie.posterUrl ? (
                      <img
                        src={
                          movie.posterUrl
                        }
                        alt={`${movie.title} poster`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center border border-white/10">
                        <span className="text-[7px] font-black uppercase tracking-[0.12em] text-white/15">
                          TMT
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                      {formatReleaseDate(
                        movie.releaseDate,
                      )}
                    </p>

                    <h4 className="mt-1 text-sm font-black leading-snug text-white">
                      {
                        movie.title
                      }
                    </h4>

                    <p className="mt-2 text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
                      UK Digital Release
                    </p>
                  </div>
                </article>
              ),
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}