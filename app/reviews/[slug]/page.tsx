import type {
  Metadata,
} from "next";

import Link from "next/link";
import {
  notFound,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type ReviewSection = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  imageUrl?: string;
  youtubeUrl?: string;
};

type LinkedMovie = {
  slug: string;
  title: string;
  year: number | null;
};

function getYouTubeVideoId(
  value: string,
) {
  try {
    const url =
      new URL(value);

    if (
      url.hostname ===
        "youtu.be" ||
      url.hostname ===
        "www.youtu.be"
    ) {
      return url.pathname
        .split("/")
        .filter(Boolean)[0] ??
        null;
    }

    if (
      url.hostname.includes(
        "youtube.com",
      )
    ) {
      if (
        url.pathname ===
        "/watch"
      ) {
        return url.searchParams.get(
          "v",
        );
      }

      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      if (
        [
          "embed",
          "shorts",
          "live",
        ].includes(
          parts[0] ?? "",
        )
      ) {
        return (
          parts[1] ??
          null
        );
      }
    }
  } catch {
    return null;
  }

  return null;
}

async function getReview(
  slug: string,
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("reviews")
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      intro,
      sections,
      verdict,
      rating,
      seo_title,
      seo_description,
      published_at,
      movies (
        slug,
        title,
        year
      )
    `)
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
      new Date()
        .toISOString(),
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
}: PageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const review =
    await getReview(
      slug,
    );

  if (!review) {
    return {
      title:
        "Review Not Found",
    };
  }

  const title =
    review.seo_title?.trim() ||
    review.title;

  const description =
    review.seo_description?.trim() ||
    review.excerpt?.trim() ||
    undefined;

  const canonicalUrl =
    `/reviews/${review.slug}`;

  const images =
    review.hero_image_url
      ? [
          {
            url:
              review.hero_image_url,
            alt:
              review.title,
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
      type: "article",
      siteName:
        "The Movie Trailer",
      title,
      description,
      url:
        canonicalUrl,
      publishedTime:
        review.published_at,
      images,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images:
        review.hero_image_url
          ? [
              review.hero_image_url,
            ]
          : undefined,
    },
  };
}

export default async function ReviewPage({
  params,
}: PageProps) {
  const {
    slug,
  } =
    await params;

  const review =
    await getReview(
      slug,
    );

    if (!review) {
    notFound();
  }

  const supabase =
    await createClient();

  const {
    data: reviewPeople,
    error: reviewPeopleError,
  } = await supabase
    .from(
      "review_people",
    )
    .select(
      "person_id",
    )
    .eq(
      "review_id",
      review.id,
    );

  if (reviewPeopleError) {
    console.error(
      "[TMT REVIEWS] Failed to load review people:",
      reviewPeopleError.message,
    );
  }

  const linkedPersonIds =
    new Set(
      (
        reviewPeople ?? []
      ).map(
        (relationship) =>
          relationship.person_id,
      ),
    );

  const curatedPeople =
    linkedPersonIds.size >
    0
      ? await getCuratedPeople()
      : [];

  const linkedPeople =
    curatedPeople.filter(
      (person) =>
        linkedPersonIds.has(
          person.id,
        ),
    );

  const sections =
    Array.isArray(
      review.sections,
    )
      ? (
          review.sections as ReviewSection[]
        )
      : [];

  const movie =
    Array.isArray(
      review.movies,
    )
      ? (
          review.movies[0] as
            | LinkedMovie
            | undefined
        )
      : (
          review.movies as
            | LinkedMovie
            | null
        );

        const canonicalUrl =
  `${siteUrl}/reviews/${review.slug}`;

const reviewDescription =
  review.seo_description?.trim() ||
  review.excerpt?.trim() ||
  undefined;

const numericRating =
  review.rating !== null &&
  review.rating !== undefined
    ? Number(
        review.rating,
      )
    : null;

const hasValidRating =
  numericRating !== null &&
  Number.isFinite(
    numericRating,
  ) &&
  numericRating >= 1 &&
  numericRating <= 10;

const reviewJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "Review",

  "@id":
    `${canonicalUrl}#review`,

  url:
    canonicalUrl,

  name:
    review.title,

  ...(reviewDescription
    ? {
        description:
          reviewDescription,
      }
    : {}),

  ...(review.hero_image_url
    ? {
        image:
          review.hero_image_url,
      }
    : {}),

  datePublished:
    review.published_at,

  publisher: {
    "@id":
      `${siteUrl}/#organization`,
  },

  ...(hasValidRating
    ? {
        reviewRating: {
          "@type":
            "Rating",
          ratingValue:
            numericRating,
          bestRating:
            10,
          worstRating:
            1,
        },
      }
    : {}),

  ...(movie
    ? {
        itemReviewed: {
          "@type":
            "Movie",

          "@id":
            `${siteUrl}/movies/${movie.slug}#movie`,

          name:
            movie.title,

          url:
            `${siteUrl}/movies/${movie.slug}`,

          ...(movie.year
            ? {
                dateCreated:
                  String(
                    movie.year,
                  ),
              }
            : {}),
        },
      }
    : {}),

  isPartOf: {
    "@id":
      `${siteUrl}/#website`,
  },

  inLanguage:
    "en-GB",
};

  const publishedDate =
    review.published_at
      ? new Intl.DateTimeFormat(
          "en-GB",
          {
            day:
              "numeric",
            month:
              "long",
            year:
              "numeric",
          },
        ).format(
          new Date(
            review.published_at,
          ),
        )
      : null;

return (
  <main className="min-h-screen bg-[#050607] text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(
            reviewJsonLd,
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
      name: "Reviews",
      url: "/reviews",
    },
    {
      name:
        review.title,
      url:
        `/reviews/${review.slug}`,
    },
  ]}
/>

    <BreakingBar />

    <article>
        <header className="site-shell pt-10 sm:pt-14">
          <div className="border-b border-white/10 pb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/reviews"
                className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b] transition hover:text-white"
              >
                Review
              </Link>

              {publishedDate ? (
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                  {
                    publishedDate
                  }
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-5xl text-4xl font-black leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              {
                review.title
              }
            </h1>

            {review.excerpt ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
                {
                  review.excerpt
                }
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-5">
              {review.rating !==
              null ? (
                <div className="flex items-baseline gap-1 border-l-4 border-[#f21f2b] pl-4">
                  <span className="text-4xl font-black tracking-[-0.05em] text-white">
                    {
                      review.rating
                    }
                  </span>

                  <span className="text-sm font-black text-white/30">
                    /10
                  </span>
                </div>
              ) : null}

              {movie ? (
                <Link
                  href={`/movies/${movie.slug}`}
                  className="text-[10px] font-black uppercase tracking-[0.13em] text-white/40 transition hover:text-[#f21f2b]"
                >
                  {movie.title}
                  {movie.year
                    ? ` (${movie.year})`
                    : ""}
                  {" "}→
                </Link>
              ) : null}
            </div>
          </div>
        </header>

        {review.hero_image_url ? (
          <div className="site-shell mt-8">
            <div className="aspect-[16/8] overflow-hidden bg-[#090b0d]">
              <img
                src={
                  review.hero_image_url
                }
                alt={
                  review.title
                }
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="site-shell py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            {review.intro ? (
              <div className="mb-12 text-lg leading-8 text-white/75">
                {review.intro
                  .split(
                    "\n",
                  )
                  .filter(
                    Boolean,
                  )
                  .map(
  (
    paragraph: string,
    index: number,
  ) => (
                      <p
                        key={
                          index
                        }
                        className="mb-5"
                      >
                        {
                          paragraph
                        }
                      </p>
                    ),
                  )}
              </div>
            ) : null}

            {sections.map(
              (
                section,
                index,
              ) => {
                const videoId =
                  section.youtubeUrl
                    ? getYouTubeVideoId(
                        section.youtubeUrl,
                      )
                    : null;

                return (
                  <section
                    key={
                      index
                    }
                    className="mb-14"
                  >
                    {section.eyebrow ? (
                      <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                        {
                          section.eyebrow
                        }
                      </p>
                    ) : null}

                    {section.headline ? (
                      <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-white sm:text-4xl">
                        {
                          section.headline
                        }
                      </h2>
                    ) : null}

                    {section.body ? (
                      <div className="mt-5 text-base leading-8 text-white/70">
                        {section.body
                          .split(
                            "\n",
                          )
                          .filter(
                            Boolean,
                          )
                          .map(
                            (
                              paragraph,
                              paragraphIndex,
                            ) => (
                              <p
                                key={
                                  paragraphIndex
                                }
                                className="mb-5"
                              >
                                {
                                  paragraph
                                }
                              </p>
                            ),
                          )}
                      </div>
                    ) : null}

                    {section.imageUrl ? (
                      <div className="mt-7 overflow-hidden border border-white/10 bg-[#090b0d]">
                        <img
                          src={
                            section.imageUrl
                          }
                          alt={
                            section.headline ||
                            review.title
                          }
                          className="h-auto w-full"
                        />
                      </div>
                    ) : null}

                    {videoId ? (
                      <div className="mt-7 aspect-video overflow-hidden border border-white/10 bg-black">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={
                            section.headline ||
                            review.title
                          }
                          className="h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : null}
                  </section>
                );
              },
            )}

            {review.verdict ? (
              <section className="mt-16 border-y border-white/10 py-8">
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                  The Verdict
                </p>

                <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                  <p className="text-lg font-bold leading-8 text-white/80">
                    {
                      review.verdict
                    }
                  </p>

                  {review.rating !==
                  null ? (
                    <div className="min-w-28 border-l-4 border-[#f21f2b] pl-4">
                      <span className="block text-5xl font-black tracking-[-0.06em] text-white">
                        {
                          review.rating
                        }
                      </span>

                      <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                        Out of 10
                      </span>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            <div className="mt-10">
              <Link
                href="/reviews"
                className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
              >
                ← More Movie Reviews
              </Link>
            </div>
                        {linkedPeople.length > 0 ? (
              <section className="mt-12 border-t border-white/10 pt-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                      In This Review
                    </p>

                    <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                      People
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {linkedPeople.map(
                    (person) => (
                      <Link
                        key={
                          person.id
                        }
                        href={`/people/${person.slug}`}
                        className="group flex items-center gap-4 border border-white/10 bg-[#090b0d] p-3 transition hover:border-[#f21f2b]/60"
                      >
                        {person.profile_image_url ? (
                          <img
                            src={
                              person.profile_image_url
                            }
                            alt={
                              person.name
                            }
                            className="h-16 w-16 shrink-0 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-white/5 text-lg font-black text-white/30">
                            {person.name
                              .slice(
                                0,
                                1,
                              )
                              .toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-white transition group-hover:text-[#f21f2b]">
                            {
                              person.name
                            }
                          </p>

                          <p className="mt-1 text-[9px] font-black uppercase tracking-[0.12em] text-white/30">
                            View Profile →
                          </p>
                        </div>
                      </Link>
                    ),
                  )}
                </div>
              </section>
            ) : null}
          </div>
        </div>
       </article>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}
