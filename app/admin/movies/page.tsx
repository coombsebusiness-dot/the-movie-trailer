import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "No release date";
  }

  return new Date(
    `${value}T12:00:00`,
  ).toLocaleDateString(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

export default async function AdminMoviesPage() {
  const supabase =
    createAdminClient();

  const {
    data: movies,
    error,
  } =
    await supabase
      .from("movies")
      .select(
        `
          id,
          slug,
          title,
          year,
          release_date,
          director,
          status,
          created_at
        `,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  if (error) {
    console.error(
      "Failed to load movies:",
      error,
    );
  }

  const items =
    movies ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Content
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.04em] text-white">
            Movies
          </h1>

          <p className="mt-3 text-sm text-white/40">
            Manage movie pages, release dates and upcoming titles.
          </p>
        </div>

        <Link
          href="/admin/movies/new"
          className="bg-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#ff3540]"
        >
          + New Movie
        </Link>
      </div>

      <div className="mt-6 flex items-center justify-between border border-white/10 bg-[#0b0d0f] px-5 py-4">
        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
          Movie Library
        </span>

        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#f21f2b]">
          {items.length} movie
          {items.length === 1
            ? ""
            : "s"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 border border-white/10 bg-[#0b0d0f] px-6 py-16 text-center">
          <p className="text-sm font-black uppercase tracking-[0.12em] text-white/30">
            No movies yet
          </p>

          <p className="mt-3 text-sm text-white/25">
            Add the first movie to start building the movie library.
          </p>

          <Link
            href="/admin/movies/new"
            className="mt-6 inline-block bg-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.12em] text-white"
          >
            Create First Movie
          </Link>
        </div>
      ) : (
        <div className="mt-4 overflow-hidden border border-white/10 bg-[#0b0d0f]">
          {items.map(
            (
              movie,
            ) => (
              <Link
                key={
                  movie.id
                }
                href={`/admin/movies/${movie.id}/edit`}
                className="grid gap-4 border-b border-white/[0.07] px-5 py-5 transition last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[1fr_170px_150px_100px]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-black text-white">
                      {
                        movie.title
                      }
                    </h2>

                    {movie.year ? (
                      <span className="text-xs font-bold text-white/25">
                        {
                          movie.year
                        }
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-2 text-xs text-white/30">
                    /movies/
                    {
                      movie.slug
                    }
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                    Release Date
                  </p>

                  <p className="mt-2 text-xs font-bold text-white/65">
                    {formatDate(
                      movie.release_date,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                    Director
                  </p>

                  <p className="mt-2 truncate text-xs font-bold text-white/65">
                    {movie.director ||
                      "—"}
                  </p>
                </div>

                <div className="md:text-right">
                  <span
                    className={`inline-block px-2 py-1 text-[8px] font-black uppercase tracking-[0.12em] ${
                      movie.status ===
                      "published"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-white/35"
                    }`}
                  >
                    {
                      movie.status
                    }
                  </span>
                </div>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}