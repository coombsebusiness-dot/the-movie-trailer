type TmdbMovie = {
  id: number;
  title: string;
  release_date: string;
  poster_path: string | null;
  overview: string;
  genre_ids: number[];
};

type TmdbDiscoverResponse = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

export type ComingSoonMovie = {
  id: number;
  title: string;
  releaseDate: string;
  posterUrl: string | null;
  overview: string;
};

function formatDateForApi(
  date: Date,
) {
  return date
    .toISOString()
    .slice(0, 10);
}

function getPosterUrl(
  posterPath: string | null,
) {
  return posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : null;
}

async function discoverMovies(
  startDate: Date,
  endDate: Date,
  page = 1,
): Promise<TmdbDiscoverResponse | null> {
  const apiKey =
    process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error(
      "TMDB_API_KEY is missing.",
    );

    return null;
  }

  const params =
    new URLSearchParams({
      api_key: apiKey,
      language: "en-GB",
      region: "GB",
      include_adult: "false",
      include_video: "false",
      sort_by: "release_date.asc",
      with_release_type: "2|3",
      "release_date.gte":
        formatDateForApi(
          startDate,
        ),
      "release_date.lte":
        formatDateForApi(
          endDate,
        ),
      page:
        String(page),
    });

  try {
    const response =
      await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
        {
          next: {
            revalidate:
              21600,
          },
        },
      );

    if (!response.ok) {
      console.error(
        "TMDB request failed:",
        response.status,
        response.statusText,
      );

      return null;
    }

    return (
      await response.json()
    ) as TmdbDiscoverResponse;
  } catch (error) {
    console.error(
      "Unable to load movies from TMDB:",
      error,
    );

    return null;
  }
}

function normaliseMovies(
  movies: TmdbMovie[],
  startDate: Date,
  endDate: Date,
) {
  const start =
    formatDateForApi(
      startDate,
    );

  const end =
    formatDateForApi(
      endDate,
    );

  return movies
    .filter((movie) => {
      if (
        !movie.release_date
      ) {
        return false;
      }

      return (
        movie.release_date >=
          start &&
        movie.release_date <=
          end
      );
    })
    .sort((a, b) =>
      a.release_date.localeCompare(
        b.release_date,
      ),
    )
    .map(
      (
        movie,
      ): ComingSoonMovie => ({
        id: movie.id,
        title: movie.title,
        releaseDate:
          movie.release_date,
        posterUrl:
          getPosterUrl(
            movie.poster_path,
          ),
        overview:
          movie.overview,
      }),
    );
}

/*
 * Homepage feed:
 * tomorrow through the next 7 days.
 */
export async function getComingSoonMovies(): Promise<
  ComingSoonMovie[]
> {
  const today =
    new Date();

  const startDate =
    new Date(today);

  startDate.setDate(
    startDate.getDate() +
      1,
  );

  const endDate =
    new Date(today);

  endDate.setDate(
    endDate.getDate() +
      7,
  );

  const data =
    await discoverMovies(
      startDate,
      endDate,
    );

  if (!data) {
    return [];
  }

  return normaliseMovies(
    data.results,
    startDate,
    endDate,
  ).slice(0, 6);
}

/*
 * Full Coming Soon archive:
 * tomorrow through the next 90 days.
 *
 * TMDB returns 20 results per page,
 * so fetch the first five pages.
 */
export async function getComingSoonArchive(): Promise<
  ComingSoonMovie[]
> {
  const today =
    new Date();

  const startDate =
    new Date(today);

  startDate.setDate(
    startDate.getDate() +
      1,
  );

  const endDate =
    new Date(today);

  endDate.setDate(
    endDate.getDate() +
      90,
  );

  const firstPage =
    await discoverMovies(
      startDate,
      endDate,
      1,
    );

  if (!firstPage) {
    return [];
  }

  const pageCount =
    Math.min(
      firstPage.total_pages,
      5,
    );

  const remainingPages =
    pageCount > 1
      ? await Promise.all(
          Array.from(
            {
              length:
                pageCount -
                1,
            },
            (_, index) =>
              discoverMovies(
                startDate,
                endDate,
                index + 2,
              ),
          ),
        )
      : [];

  const allMovies = [
    ...firstPage.results,
    ...remainingPages.flatMap(
      (page) =>
        page?.results ??
        [],
    ),
  ];

  /*
   * De-duplicate by TMDB ID.
   */
  const uniqueMovies =
    Array.from(
      new Map(
        allMovies.map(
          (movie) => [
            movie.id,
            movie,
          ],
        ),
      ).values(),
    );

  return normaliseMovies(
    uniqueMovies,
    startDate,
    endDate,
  );
}
/*
 * Homepage digital release feed:
 * tomorrow through the next 14 days.
 */
export async function getComingToDigitalMovies(): Promise<
  ComingSoonMovie[]
> {
  const today =
    new Date();

  const startDate =
    new Date(today);

  startDate.setDate(
    startDate.getDate() +
      1,
  );

  const endDate =
    new Date(today);

  endDate.setDate(
    endDate.getDate() +
      14,
  );

  const apiKey =
    process.env.TMDB_API_KEY;

  if (!apiKey) {
    console.error(
      "TMDB_API_KEY is missing.",
    );

    return [];
  }

  const params =
    new URLSearchParams({
      api_key:
        apiKey,
      language:
        "en-GB",
      region:
        "GB",
      include_adult:
        "false",
      include_video:
        "false",
      sort_by:
        "release_date.asc",
      with_release_type:
        "4",
      "release_date.gte":
        formatDateForApi(
          startDate,
        ),
      "release_date.lte":
        formatDateForApi(
          endDate,
        ),
    });

  try {
    const response =
      await fetch(
        `https://api.themoviedb.org/3/discover/movie?${params.toString()}`,
        {
          next: {
            revalidate:
              21600,
          },
        },
      );

    if (
      !response.ok
    ) {
      console.error(
        "TMDB digital release request failed:",
        response.status,
        response.statusText,
      );

      return [];
    }

    const data =
      (await response.json()) as TmdbDiscoverResponse;

    return normaliseMovies(
      data.results,
      startDate,
      endDate,
    ).slice(
      0,
      5,
    );
  } catch (
    error
  ) {
    console.error(
      "Unable to load digital releases from TMDB:",
      error,
    );

    return [];
  }
}