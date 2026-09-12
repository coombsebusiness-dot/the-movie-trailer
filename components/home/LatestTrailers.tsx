import Image from "next/image";
import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

function formatTrailerType(
  value: string,
) {
  return value
    .replace(
      /-/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

export default async function LatestTrailers() {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

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
          thumbnail_url,
          youtube_video_id,
          published_at
        `,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        now,
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      )
      .limit(6);

  if (error) {
    console.error(
      "Failed to load latest trailers:",
      error,
    );
  }

  const items =
    trailers ?? [];

  return (
    <section className="site-shell section-rule py-9">
      <div className="mb-6 flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Watch Now
          </p>

          <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.035em] text-white">
            Latest Trailers
          </h2>
        </div>

        <Link
          href="/trailers"
          className="text-[10px] font-black uppercase tracking-[0.12em] text-white/35 transition hover:text-[#f21f2b]"
        >
          View All Trailers →
        </Link>
      </div>

      {items.length ===
      0 ? (
        <div className="border border-white/10 bg-[#0b0d0f] px-6 py-12 text-center">
          <p className="text-sm font-black uppercase tracking-[0.1em] text-white/30">
            Trailers coming soon
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {items.map(
            (
              trailer,
            ) => {
              const thumbnail =
                trailer.thumbnail_url ||
                (trailer.youtube_video_id
                  ? `https://i.ytimg.com/vi/${trailer.youtube_video_id}/hqdefault.jpg`
                  : null);

              return (
                <Link
                  key={
                    trailer.id
                  }
                  href={`/trailers/${trailer.slug}`}
                  className="group block"
                >
                  <div className="movie-card-image relative aspect-video overflow-hidden border border-white/10 bg-[#0b0d0f]">
                    {thumbnail ? (
                      <Image
                        src={
                          thumbnail
                        }
                        alt={
                          trailer.title
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 17vw"
                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/20">
                          No Thumbnail
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white bg-black/45 text-sm text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[#f21f2b]">
                        ▶
                      </div>
                    </div>

                    <div className="absolute bottom-2 left-2">
                      <span className="bg-[#f21f2b] px-2 py-1 text-[8px] font-black uppercase tracking-[0.1em] text-white">
                        {formatTrailerType(
                          trailer.trailer_type,
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-3 line-clamp-2 text-sm font-black leading-5 tracking-[-0.02em] text-white transition group-hover:text-[#f21f2b]">
                    {
                      trailer.title
                    }
                  </h3>
                </Link>
              );
            },
          )}
        </div>
      )}
    </section>
  );
}