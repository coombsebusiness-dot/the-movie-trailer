import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";

import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

import {
  createClient,
} from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

type TrailerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type LinkedMovie = {
  slug: string;
  title: string;
  year: number | null;
  poster_url: string | null;
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
        "long",
      year:
        "numeric",
    },
  );
}

async function getTrailer(
  slug: string,
) {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const {
    data,
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
          youtube_url,
          youtube_video_id,
          thumbnail_url,
          published_at,
          movie_id,
          movies (
            slug,
            title,
            year,
            poster_url
          )
        `,
      )
      .eq(
        "slug",
        slug,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        now,
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    return null;
  }

  return data;
}

export async function generateMetadata({
  params,
}: TrailerPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const trailer =
    await getTrailer(
      slug,
    );

  if (!trailer) {
    return {
      title:
        "Trailer Not Found",
    };
  }

  const title =
    trailer.title;

  const description =
    trailer.description?.trim() ||
    `Watch ${trailer.title} on The Movie Trailer.`;

  const canonicalUrl =
    `/trailers/${trailer.slug}`;

  const images =
    trailer.thumbnail_url
      ? [
          {
            url:
              trailer.thumbnail_url,
            alt:
              trailer.title,
          },
        ]
      : undefined;

  return {
    title,
    description,

    alternates: {
      canonical:
        canonicalUrl,
    },

    openGraph: {
      type:
        "video.other",
      siteName:
        "The Movie Trailer",
      title,
      description,
      url:
        canonicalUrl,
      images,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images:
        trailer.thumbnail_url
          ? [
              trailer.thumbnail_url,
            ]
          : undefined,
    },
  };
}

export default async function TrailerPage({
  params,
}: TrailerPageProps) {
  const {
    slug,
  } =
    await params;

  const trailer =
    await getTrailer(
      slug,
    );

  if (!trailer) {
    notFound();
  }

  const embedUrl =
    trailer.youtube_video_id
      ? `https://www.youtube.com/embed/${trailer.youtube_video_id}?autoplay=1&mute=1&rel=0`
      : null;

  const linkedMovie =
    Array.isArray(
      trailer.movies,
    )
      ? (
          trailer.movies[0] as LinkedMovie | undefined
        )
      : (
          trailer.movies as LinkedMovie | null
        );

        const canonicalUrl =
  `${siteUrl}/trailers/${trailer.slug}`;

const videoDescription =
  trailer.description?.trim() ||
  `Watch ${trailer.title} on The Movie Trailer.`;

const youtubeWatchUrl =
  trailer.youtube_video_id
    ? `https://www.youtube.com/watch?v=${trailer.youtube_video_id}`
    : trailer.youtube_url?.trim() ||
      undefined;

const youtubeEmbedUrl =
  trailer.youtube_video_id
    ? `https://www.youtube.com/embed/${trailer.youtube_video_id}`
    : undefined;

const videoJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "VideoObject",

  "@id":
    `${canonicalUrl}#video`,

  name:
    trailer.title,

  description:
    videoDescription,

  ...(trailer.thumbnail_url
    ? {
        thumbnailUrl: [
          trailer.thumbnail_url,
        ],
      }
    : {}),

  uploadDate:
    trailer.published_at,

  ...(youtubeWatchUrl
    ? {
        contentUrl:
          youtubeWatchUrl,
      }
    : {}),

  ...(youtubeEmbedUrl
    ? {
        embedUrl:
          youtubeEmbedUrl,
      }
    : {}),

  url:
    canonicalUrl,

  mainEntityOfPage: {
    "@type":
      "WebPage",
    "@id":
      canonicalUrl,
  },

  ...(linkedMovie
    ? {
        about: {
          "@type":
            "Movie",
          "@id":
            `${siteUrl}/movies/${linkedMovie.slug}#movie`,
          name:
            linkedMovie.title,
          url:
            `${siteUrl}/movies/${linkedMovie.slug}`,
        },
      }
    : {}),

  publisher: {
    "@id":
      `${siteUrl}/#organization`,
  },

  isPartOf: {
    "@id":
      `${siteUrl}/#website`,
  },

  inLanguage:
    "en-GB",
};
return (
  <main className="min-h-screen bg-[#050607] text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(
            videoJsonLd,
          ),
      }}
    />

    <BreadcrumbJsonLd
  items={[
    {
      name: "Home",
      url: "/",
    },
    {
      name: "Trailers",
      url: "/trailers",
    },
    {
      name:
        trailer.title,
      url:
        `/trailers/${trailer.slug}`,
    },
  ]}
/>

  <BreakingBar />

  <section className="site-shell py-10">
        <div className="border-b border-white/10 pb-7">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/trailers"
              className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
            >
              Trailers
            </Link>

            <span className="text-white/15">
              /
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#f21f2b]">
              {formatTrailerType(
                trailer.trailer_type,
              )}
            </span>
          </div>

          <h1 className="mt-4 max-w-5xl text-4xl font-black leading-[0.98] tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            {
              trailer.title
            }
          </h1>

          {trailer.published_at ? (
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-white/30">
              Published{" "}
              {formatDate(
                trailer.published_at,
              )}
            </p>
          ) : null}
        </div>

        <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_330px]">
          {/* MAIN TRAILER */}
          <div className="min-w-0">
            <div className="overflow-hidden border border-white/10 bg-black">
              {embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={
                      embedUrl
                    }
                    title={
                      trailer.title
                    }
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="movie-card-image flex aspect-video items-center justify-center">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-white/20">
                    Trailer unavailable
                  </p>
                </div>
              )}
            </div>

            {trailer.description ? (
              <div className="mt-8 max-w-4xl">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                  About This Trailer
                </p>

                <p className="mt-4 text-lg leading-8 text-white/70">
                  {
                    trailer.description
                  }
                </p>
              </div>
            ) : null}
          </div>

          {/* SIDEBAR */}
          <aside className="h-fit self-start space-y-5">
            {/* LINKED MOVIE */}
            {linkedMovie ? (
              <section className="overflow-hidden border border-white/10 bg-[#0b0d0f]">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                    Movie
                  </p>
                </div>

                {linkedMovie.poster_url ? (
                  <Link
                    href={`/movies/${linkedMovie.slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-black">
                      <img
                        src={
                          linkedMovie.poster_url
                        }
                        alt={`${linkedMovie.title} poster`}
                        className="h-full w-full object-cover object-top opacity-80 transition duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-5">
                        {linkedMovie.year ? (
                          <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                            {
                              linkedMovie.year
                            }
                          </p>
                        ) : null}

                        <h2 className="mt-1 text-xl font-black leading-tight text-white">
                          {
                            linkedMovie.title
                          }
                        </h2>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="px-5 pt-5">
                    {linkedMovie.year ? (
                      <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                        {
                          linkedMovie.year
                        }
                      </p>
                    ) : null}

                    <h2 className="mt-1 text-xl font-black leading-tight text-white">
                      {
                        linkedMovie.title
                      }
                    </h2>
                  </div>
                )}

                <div className="p-5">
                  <Link
                    href={`/movies/${linkedMovie.slug}`}
                    className="inline-flex items-center text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:text-[#f21f2b]"
                  >
                    View Movie →
                  </Link>
                </div>
              </section>
            ) : null}

            {/* TRAILER DETAILS */}
            <section className="border border-white/10 bg-[#0b0d0f] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                Trailer Details
              </p>

              <div className="mt-5 space-y-4">
                <div className="border-b border-white/10 pb-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                    Type
                  </p>

                  <p className="mt-1 text-sm font-black text-white">
                    {formatTrailerType(
                      trailer.trailer_type,
                    )}
                  </p>
                </div>

                {trailer.published_at ? (
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                      Added
                    </p>

                    <p className="mt-1 text-sm font-black text-white">
                      {formatDate(
                        trailer.published_at,
                      )}
                    </p>
                  </div>
                ) : null}

                {trailer.youtube_url ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                      Source
                    </p>

                    <a
                      href={
                        trailer.youtube_url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-sm font-black text-white transition hover:text-[#f21f2b]"
                    >
                      Watch on YouTube →
                    </a>
                  </div>
                ) : null}
              </div>
            </section>

            {/* MORE TRAILERS */}
            <section className="border border-white/10 bg-[#0b0d0f] p-5">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                More Trailers
              </p>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Browse the latest movie and TV teasers, official trailers, clips and featurettes.
              </p>

              <Link
                href="/trailers"
                className="mt-5 inline-block text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:text-[#f21f2b]"
              >
                View All Trailers →
              </Link>
            </section>
          </aside>
        </div>
            </section>

      <NewsletterSignup />

      <SiteFooter />
    </main>
)
}