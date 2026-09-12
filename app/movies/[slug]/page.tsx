import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import {
  notFound,
} from "next/navigation";

import BreakingBar from "@/components/site/BreakingBar";

import NewsletterSignup from "@/components/home/NewsletterSignup";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

import {
  createClient,
} from "@/lib/supabase/server";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

type MovieSection = {
  id?: string;
  eyebrow?: string;
  heading?: string;
  content?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
};

type MoviePageProps = {
  params: Promise<{
    slug: string;
  }>;
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
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

export async function generateMetadata({
  params,
}: MoviePageProps): Promise<Metadata> {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const {
    data: movie,
  } = await supabase
    .from("movies")
    .select(
      `
        slug,
        title,
        synopsis,
        seo_title,
        meta_description,
        poster_url,
        backdrop_url
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
      new Date().toISOString(),
    )
    .maybeSingle();

  if (!movie) {
    return {
      title:
        "Movie Not Found",
    };
  }

  const title =
    movie.seo_title?.trim() ||
    movie.title;

  const description =
    movie.meta_description?.trim() ||
    movie.synopsis?.trim() ||
    undefined;

  const canonicalUrl =
    `/movies/${movie.slug}`;

  const socialImage =
    movie.backdrop_url ||
    movie.poster_url ||
    undefined;

  const images =
    socialImage
      ? [
          {
            url:
              socialImage,
            alt:
              movie.title,
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
      type: "website",
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
        socialImage
          ? [
              socialImage,
            ]
          : undefined,
    },
  };
}

export default async function MoviePage({
  params,
}: MoviePageProps) {
  const {
    slug,
  } = await params;

  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const {
    data: movie,
    error,
  } = await supabase
    .from("movies")
    .select(
      `
        id,
        slug,
        title,
        year,
        synopsis,
        release_date,
        poster_url,
        backdrop_url,
        director,
        status,
        genre,
        tagline,
        intro,
        runtime,
        certification,
        studio,
        distributor,
        cast_members,
        sections,
        sidebar_quote,
        published_at
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
    !movie
  ) {
    notFound();
  }

  const sections =
    Array.isArray(
      movie.sections,
    )
      ? (
          movie.sections as MovieSection[]
        )
      : [];

  const cast =
    Array.isArray(
      movie.cast_members,
    )
      ? movie.cast_members
      : [];

      const curatedPeople =
  await getCuratedPeople();

const curatedPeopleByName =
  new Map(
    curatedPeople.map(
      (person) => [
        person.name
          .trim()
          .toLowerCase(),
        person.slug,
      ],
    ),
  );

const {
  data: moviePeopleRelationships,
} = await supabase
  .from(
    "movie_people",
  )
  .select(
    "person_id",
  )
  .eq(
    "movie_id",
    movie.id,
  );

const moviePersonIds =
  new Set(
    (
      moviePeopleRelationships ??
      []
    ).map(
      (relationship) =>
        relationship.person_id,
    ),
  );

const moviePeople =
  curatedPeople.filter(
    (person) =>
      moviePersonIds.has(
        person.id,
      ),
  );

const releaseDate =
    formatDate(
      movie.release_date,
    );

    const canonicalUrl =
  `${siteUrl}/movies/${movie.slug}`;

const movieDescription =
  movie.synopsis?.trim() ||
  movie.intro?.trim() ||
  undefined;

  const runtimeMinutes =
  movie.runtime
    ? Number.parseInt(
        String(
          movie.runtime,
        ),
        10,
      )
    : null;

const hasValidRuntime =
  runtimeMinutes !== null &&
  Number.isFinite(
    runtimeMinutes,
  ) &&
  runtimeMinutes > 0;

const movieJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "Movie",

  "@id":
    `${canonicalUrl}#movie`,

  url:
    canonicalUrl,

  name:
    movie.title,

  ...(movieDescription
    ? {
        description:
          movieDescription,
      }
    : {}),

  ...(movie.poster_url
    ? {
        image:
          movie.poster_url,
      }
    : {}),

  ...(movie.release_date
    ? {
        dateCreated:
          movie.release_date,
      }
    : movie.year
      ? {
          dateCreated:
            String(
              movie.year,
            ),
        }
      : {}),

  ...(movie.genre
    ? {
        genre:
          movie.genre,
      }
    : {}),

  ...(movie.director
    ? {
        director: {
          "@type":
            "Person",
          name:
            movie.director,
        },
      }
    : {}),

  ...(moviePeople.length > 0
    ? {
        actor:
          moviePeople.map(
            (person) => ({
              "@type":
                "Person",
              "@id":
                `${siteUrl}/people/${person.slug}#person`,
              name:
                person.name,
              url:
                `${siteUrl}/people/${person.slug}`,
            }),
          ),
      }
    : {}),

 ...(hasValidRuntime
  ? {
      duration:
        `PT${runtimeMinutes}M`,
    }
  : {}),

  ...(movie.certification
    ? {
        contentRating:
          movie.certification,
      }
    : {}),

  ...(movie.studio
    ? {
        productionCompany: {
          "@type":
            "Organization",
          name:
            movie.studio,
        },
      }
    : {}),

  mainEntityOfPage: {
    "@type":
      "WebPage",
    "@id":
      canonicalUrl,
  },

  isPartOf: {
    "@id":
      `${siteUrl}/#website`,
  },

  inLanguage:
    "en-GB",
};

  const {
    data: relatedTrailers,
  } = await supabase
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
      "movie_id",
      movie.id,
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
        ascending:
          false,
      },
    );

 return (
  <main className="min-h-screen bg-[#050607] text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(
            movieJsonLd,
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
      name: "Movies",
      url: "/movies",
    },
    {
      name:
        movie.title,
      url:
        `/movies/${movie.slug}`,
    },
  ]}
/>

  <BreakingBar />

  <article>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-white/10 bg-[#08090b]">
          {movie.backdrop_url ? (
            <>
              <img
                src={
                  movie.backdrop_url
                }
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#050607] via-[#050607]/90 to-[#050607]/35" />

              <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-transparent to-[#050607]/30" />
            </>
          ) : null}

          <div className="site-shell relative z-10 grid gap-10 py-14 lg:grid-cols-[260px_1fr] lg:py-20">
            {movie.poster_url ? (
              <div>
                <img
                  src={
                    movie.poster_url
                  }
                  alt={`${movie.title} poster`}
                  className="w-full border border-white/10 object-cover shadow-2xl"
                />
              </div>
            ) : null}

            <div className="flex flex-col justify-end">
              <div className="mb-5 flex flex-wrap items-center gap-3">
                <span className="bg-[#f21f2b] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  Movie
                </span>

                {movie.year ? (
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-white/45">
                    {
                      movie.year
                    }
                  </span>
                ) : null}

                {movie.genre ? (
                  <span className="text-xs font-black uppercase tracking-[0.15em] text-white/45">
                    {
                      movie.genre
                    }
                  </span>
                ) : null}
              </div>

              <h1 className="max-w-5xl text-5xl font-black uppercase leading-[0.92] tracking-[-0.055em] md:text-7xl lg:text-8xl">
                {
                  movie.title
                }
              </h1>

              {movie.tagline ? (
                <p className="mt-6 max-w-3xl text-xl font-bold leading-relaxed text-white/65">
                  {
                    movie.tagline
                  }
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
                {movie.director ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                      Director
                    </p>

                    <p className="mt-1 text-sm font-bold text-white/80">
                      {
                        movie.director
                      }
                    </p>
                  </div>
                ) : null}

                {releaseDate ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                      Release
                    </p>

                    <p className="mt-1 text-sm font-bold text-white/80">
                      {
                        releaseDate
                      }
                    </p>
                  </div>
                ) : null}

                {movie.runtime ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                      Runtime
                    </p>

                    <p className="mt-1 text-sm font-bold text-white/80">
                      {
                        movie.runtime
                      }
                    </p>
                  </div>
                ) : null}

                {movie.certification ? (
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                      Certificate
                    </p>

                    <p className="mt-1 text-sm font-bold text-white/80">
                      {
                        movie.certification
                      }
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* SYNOPSIS */}
        {movie.synopsis ? (
          <section className="border-y border-white/10 bg-[#0a0c0e]">
            <div className="site-shell py-12">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                Synopsis
              </p>

              <p className="mt-4 max-w-5xl text-xl font-bold leading-8 text-white/70">
                {
                  movie.synopsis
                }
              </p>
            </div>
          </section>
        ) : null}

        {/* ARTICLE + SIDEBAR */}
        <div className="site-shell grid items-start gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* MAIN ARTICLE */}
          <div className="min-w-0">
            {movie.intro ? (
              <section className="border-b border-white/10 pb-12">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                  The Movie Trailer
                </p>

                <div className="mt-5 space-y-5 text-lg font-medium leading-8 text-white/75">
                  {movie.intro
                    .split("\n")
                    .filter(Boolean)
                    .map(
                      (
                        paragraph: string,
                        index: number,
                      ) => (
                        <p
                          key={
                            index
                          }
                        >
                          {
                            paragraph
                          }
                        </p>
                      ),
                    )}
                </div>
              </section>
            ) : null}

            {sections.map(
              (
                section,
                index,
              ) => (
                <section
                  key={
                    section.id ||
                    index
                  }
                  id={
                    section.id ||
                    undefined
                  }
                  className="border-b border-white/10 py-12 last:border-b-0"
                >
                  {section.eyebrow ? (
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                      {
                        section.eyebrow
                      }
                    </p>
                  ) : null}

                  {section.heading ? (
                    <h2 className="mt-3 max-w-4xl text-3xl font-black uppercase leading-tight tracking-[-0.04em] md:text-4xl">
                      {
                        section.heading
                      }
                    </h2>
                  ) : null}

                  {section.youtubeVideoId ? (
                    <div className="mt-8 overflow-hidden border border-white/10 bg-black">
                      <div className="aspect-video">
                        <iframe
                          src={`https://www.youtube.com/embed/${section.youtubeVideoId}?rel=0`}
                          title={
                            section.heading ||
                            `${movie.title} video`
                          }
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : null}

                  {section.content ? (
                    <div
                      className="movie-rich-text mt-7 max-w-4xl"
                      dangerouslySetInnerHTML={{
                        __html:
                          section.content,
                      }}
                    />
                  ) : null}
                </section>
              ),
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="h-fit self-start space-y-6">
            {/* RELATED TRAILERS */}
            {relatedTrailers?.length ? (
              <div className="overflow-hidden border border-white/10 bg-[#0b0d0f]">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                    Trailers
                  </p>

                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                    {
                      relatedTrailers.length
                    }
                  </span>
                </div>

                <div className="divide-y divide-white/10">
                  {relatedTrailers.map(
                    (
                      trailer,
                    ) => (
                      <Link
                        key={
                          trailer.id
                        }
                        href={`/trailers/${trailer.slug}`}
                        className="group block"
                      >
                        {trailer.thumbnail_url ? (
                          <div className="relative aspect-video overflow-hidden bg-black">
                            <img
                              src={
                                trailer.thumbnail_url
                              }
                              alt={`${trailer.title} thumbnail`}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                            />

                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f21f2b] text-lg font-black text-white shadow-xl transition duration-200 group-hover:scale-110">
                                ▶
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="p-5">
                          <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                            {trailer.trailer_type
                              ?.replaceAll(
                                "-",
                                " ",
                              )}
                          </p>

                          <h3 className="mt-2 text-base font-black leading-snug text-white transition group-hover:text-[#f21f2b]">
                            {
                              trailer.title
                            }
                          </h3>

                          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/30 transition group-hover:text-white/60">
                            Watch Trailer →
                          </p>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {/* SIDEBAR QUOTE */}
            {movie.sidebar_quote ? (
              <div className="border-l-4 border-[#f21f2b] bg-[#0b0d0f] p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  The Movie Trailer
                </p>

                <blockquote className="mt-4 text-xl font-black leading-snug tracking-[-0.02em] text-white">
                  “
                  {
                    movie.sidebar_quote
                  }
                  ”
                </blockquote>
              </div>
            ) : null}

            {/* MOVIE DETAILS */}
            <div className="border border-white/10 bg-[#0b0d0f]">
              <div className="border-b border-white/10 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                  Movie Details
                </p>
              </div>

              <div className="divide-y divide-white/10 px-5">
                {movie.director ? (
                  <Detail
                    label="Director"
                    value={
                      movie.director
                    }
                  />
                ) : null}

                {movie.studio ? (
                  <Detail
                    label="Studio"
                    value={
                      movie.studio
                    }
                  />
                ) : null}

                {movie.distributor ? (
                  <Detail
                    label="Distributor"
                    value={
                      movie.distributor
                    }
                  />
                ) : null}

                {movie.genre ? (
                  <Detail
                    label="Genre"
                    value={
                      movie.genre
                    }
                  />
                ) : null}

                {releaseDate ? (
                  <Detail
                    label="Release Date"
                    value={
                      releaseDate
                    }
                  />
                ) : null}

                {movie.runtime ? (
                  <Detail
                    label="Runtime"
                    value={
                      movie.runtime
                    }
                  />
                ) : null}

                {movie.certification ? (
                  <Detail
                    label="Certificate"
                    value={
                      movie.certification
                    }
                  />
                ) : null}
              </div>
            </div>

            {/* CAST */}
            {cast.length ? (
              <div className="border border-white/10 bg-[#0b0d0f]">
                <div className="border-b border-white/10 px-5 py-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                    Cast
                  </p>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                   {cast.map(
  (
    name,
  ) => {
    const personSlug =
      curatedPeopleByName.get(
        name
          .trim()
          .toLowerCase(),
      );

    return (
      <p
        key={
          name
        }
        className="border-b border-white/5 pb-3 text-sm font-bold text-white/70 last:border-b-0 last:pb-0"
      >
        {personSlug ? (
          <Link
            href={`/people/${personSlug}`}
            className="transition hover:text-[#f21f2b]"
          >
            {name}
            <span
              aria-hidden="true"
              className="ml-2 text-[#f21f2b]"
            >
              →
            </span>
          </Link>
        ) : (
          name
        )}
      </p>
    );
  },
)}
                  </div>
                </div>
              </div>
                          ) : null}

              {/* CURATED PEOPLE */}

              {moviePeople.length ? (
                <div className="border border-white/10 bg-[#0b0d0f]">
                  <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                      People
                    </p>

                    <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/25">
                      {
                        moviePeople.length
                      }
                    </span>
                  </div>

                  <div className="divide-y divide-white/10">
                    {moviePeople.map(
                      (
                        person,
                      ) => (
                        <Link
                          key={
                            person.id
                          }
                          href={`/people/${person.slug}`}
                          className="group flex items-center gap-4 p-4 transition hover:bg-white/[0.03]"
                        >
                          {person.profile_image_url ? (
                            <img
                              src={
                                person.profile_image_url
                              }
                              alt={
                                person.name
                              }
                              className="h-16 w-16 shrink-0 rounded-full border border-white/10 object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#111317] text-xl font-black text-white/25">
                              {person.name
                                .charAt(
                                  0,
                                )
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="text-sm font-black text-white transition group-hover:text-[#f21f2b]">
                              {
                                person.name
                              }
                            </p>

                            <p className="mt-1 text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
                              View Profile →
                            </p>
                          </div>
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              ) : null}

            </aside>
        </div>
            </article>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-4">
      <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/30">
        {
          label
        }
      </span>

      <span className="max-w-[180px] text-right text-xs font-bold text-white/75">
        {
          value
        }
      </span>
    </div>
  );
}