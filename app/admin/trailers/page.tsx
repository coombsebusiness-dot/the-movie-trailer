import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export default async function AdminTrailersPage() {
  const supabase =
    createAdminClient();

  const {
    data: trailers,
    error,
  } =
    await supabase
      .from("trailers")
      .select(
        `
          id,
          slug,
          title,
          trailer_type,
          status,
          published_at,
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
    throw new Error(
      `Failed to load trailers: ${error.message}`,
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Editorial
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-[-0.045em] text-white">
            Trailers
          </h1>

          <p className="mt-3 text-sm text-white/40">
            {trailers.length} trailer
            {trailers.length ===
            1
              ? ""
              : "s"}
          </p>
        </div>

        <Link
          href="/admin/trailers/new"
          className="bg-[#f21f2b] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
        >
          New Trailer
        </Link>
      </div>

      {trailers.length ===
      0 ? (
        <div className="mt-8 border border-white/10 bg-[#0b0d0f] px-6 py-14 text-center">
          <p className="text-lg font-black text-white/40">
            No trailers yet.
          </p>

          <p className="mt-2 text-sm text-white/25">
            Add the first trailer to start building the catalogue.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden border border-white/10 bg-[#0b0d0f]">
          {trailers.map(
            (
              trailer,
            ) => (
              <Link
                key={
                  trailer.id
                }
                href={`/admin/trailers/${trailer.id}/edit`}
                className="grid gap-4 border-b border-white/10 px-5 py-5 transition last:border-b-0 hover:bg-white/[0.025] md:grid-cols-[1fr_180px_120px]"
              >
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                    {trailer.trailer_type.replace(
                      /-/g,
                      " ",
                    )}
                  </p>

                  <h2 className="mt-2 text-lg font-black tracking-[-0.025em] text-white">
                    {
                      trailer.title
                    }
                  </h2>

                  <p className="mt-1 text-xs text-white/25">
                    /
                    {
                      trailer.slug
                    }
                  </p>
                </div>

                <div className="flex items-center">
                  <span
                    className={`text-[10px] font-black uppercase tracking-[0.12em] ${
                      trailer.status ===
                      "published"
                        ? "text-emerald-400"
                        : "text-[#f21f2b]"
                    }`}
                  >
                    {
                      trailer.status
                    }
                  </span>
                </div>

                <div className="flex items-center text-xs text-white/30">
                  {trailer.published_at
                    ? new Date(
                        trailer.published_at,
                      ).toLocaleDateString(
                        "en-GB",
                        {
                          day:
                            "numeric",
                          month:
                            "short",
                          year:
                            "numeric",
                        },
                      )
                    : "Not published"}
                </div>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}