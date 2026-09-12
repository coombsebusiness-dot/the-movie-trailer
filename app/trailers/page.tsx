import Image from "next/image";
import Link from "next/link";
import type {
  Metadata,
} from "next";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Movie Trailers",

  description:
    "Watch the latest movie trailers, teasers and official previews, with upcoming films and new releases on The Movie Trailer.",

  alternates: {
    canonical:
      "/trailers",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "Movie Trailers | The Movie Trailer",
    description:
      "Watch the latest movie trailers, teasers and official previews, with upcoming films and new releases on The Movie Trailer.",
    url:
      "/trailers",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Movie Trailers | The Movie Trailer",
    description:
      "Watch the latest movie trailers, teasers and official previews, with upcoming films and new releases on The Movie Trailer.",
  },
};

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
      (
        letter,
      ) =>
        letter.toUpperCase(),
    );
}

function formatDate(
  value: string,
) {
  return new Date(
    value,
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
  );
}

export default async function TrailersPage() {
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
          description,
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
      );

  if (error) {
    console.error(
      "Failed to load trailers:",
      error,
    );
  }

  const items =
    trailers ?? [];

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />
      <BreakingBar />

      <section className="site-shell py-10">
        <div className="border-b border-white/10 pb-7">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Watch Now
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-5">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
                Trailers
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                Watch the latest movie and TV teasers, official trailers, clips and featurettes.
              </p>
            </div>

            <p className="text-xs font-black uppercase tracking-[0.12em] text-white/25">
              {items.length} trailer
              {items.length ===
              1
                ? ""
                : "s"}
            </p>
          </div>
        </div>

        {items.length ===
        0 ? (
          <div className="mt-8 border border-white/10 bg-[#0b0d0f] px-6 py-16 text-center">
            <p className="text-sm font-black uppercase tracking-[0.12em] text-white/30">
              No trailers published yet
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                  <article
                    key={
                      trailer.id
                    }
                    className="group"
                  >
                    <Link
                      href={`/trailers/${trailer.slug}`}
                      className="block"
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
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                            className="object-cover transition duration-300 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/20">
                              No Thumbnail
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/45 text-base text-white backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-[#f21f2b]">
                            ▶
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3">
                          <span className="bg-[#f21f2b] px-2 py-1 text-[8px] font-black uppercase tracking-[0.11em] text-white">
                            {formatTrailerType(
                              trailer.trailer_type,
                            )}
                          </span>
                        </div>
                      </div>

                      <h2 className="mt-4 text-xl font-black leading-6 tracking-[-0.03em] text-white transition group-hover:text-[#f21f2b]">
                        {
                          trailer.title
                        }
                      </h2>
                    </Link>

                    <div className="mt-3 flex items-center gap-3">
                      {trailer.published_at ? (
                        <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                          {formatDate(
                            trailer.published_at,
                          )}
                        </span>
                      ) : null}

                      <span className="h-px w-5 bg-white/10" />

                      <span className="text-[9px] font-black uppercase tracking-[0.12em] text-[#f21f2b]">
                        Watch Trailer
                      </span>
                    </div>

                    {trailer.description ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                        {
                          trailer.description
                        }
                      </p>
                    ) : null}
                  </article>
                );
              },
            )}
          </div>
        )}
            </section>

      <NewsletterSignup />

      <SiteFooter />

    </main>
  );
}