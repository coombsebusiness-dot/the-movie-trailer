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

type FeatureSection = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  imageUrl?: string;
  youtubeUrl?: string;
};

type FeatureSource = {
  name?: string;
  url?: string;
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
      return (
        url.pathname
          .split("/")
          .filter(Boolean)[0] ??
        null
      );
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

function getSourceLabel(
  source: FeatureSource,
) {
  if (
    source.name?.trim()
  ) {
    return source.name.trim();
  }

  if (
    source.url?.trim()
  ) {
    try {
      return new URL(
        source.url,
      ).hostname.replace(
        /^www\./,
        "",
      );
    } catch {
      return source.url.trim();
    }
  }

  return "Source";
}

function getSafeSourceUrl(
  value?: string,
) {
  if (!value) {
    return null;
  }

  try {
    const url =
      new URL(value);

    if (
      url.protocol !==
        "http:" &&
      url.protocol !==
        "https:"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

async function getFeature(
  slug: string,
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("features")
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      intro,
      sections,
      sources,
      seo_title,
      meta_description,
      published_at
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

  const feature =
    await getFeature(
      slug,
    );

  if (!feature) {
    return {
      title:
        "Feature Not Found",
    };
  }

  const title =
    feature.seo_title?.trim() ||
    feature.title;

  const description =
    feature.meta_description?.trim() ||
    feature.excerpt?.trim() ||
    undefined;

  const canonicalUrl =
    `/features/${feature.slug}`;

  const images =
    feature.hero_image_url
      ? [
          {
            url:
              feature.hero_image_url,
            alt:
              feature.title,
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
        feature.published_at,
      images,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images:
        feature.hero_image_url
          ? [
              feature.hero_image_url,
            ]
          : undefined,
    },
  };
}

export default async function FeaturePage({
  params,
}: PageProps) {
  const {
    slug,
  } =
    await params;

  const feature =
    await getFeature(
      slug,
    );

  if (!feature) {
    notFound();
  }

  const canonicalUrl =
  `${siteUrl}/features/${feature.slug}`;

const articleDescription =
  feature.meta_description?.trim() ||
  feature.excerpt?.trim() ||
  undefined;

const articleJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "Article",

  "@id":
    `${canonicalUrl}#article`,

  url:
    canonicalUrl,

  mainEntityOfPage: {
    "@type":
      "WebPage",
    "@id":
      canonicalUrl,
  },

  headline:
    feature.title,

  ...(articleDescription
    ? {
        description:
          articleDescription,
      }
    : {}),

  ...(feature.hero_image_url
    ? {
        image: [
          feature.hero_image_url,
        ],
      }
    : {}),

  datePublished:
    feature.published_at,

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

  const supabase =
    await createClient();

  const {
    data:
      featurePeople,
    error:
      featurePeopleError,
  } = await supabase
    .from(
      "feature_people",
    )
    .select(
      "person_id",
    )
    .eq(
      "feature_id",
      feature.id,
    );

  if (
    featurePeopleError
  ) {
    console.error(
      "[TMT FEATURES] Failed to load feature people:",
      featurePeopleError.message,
    );
  }

  const linkedPersonIds =
    new Set(
      (
        featurePeople ??
        []
      ).map(
        (
          relationship,
        ) =>
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
      (
        person,
      ) =>
        linkedPersonIds.has(
          person.id,
        ),
    );

  const sections =
    Array.isArray(
      feature.sections,
    )
      ? (
          feature.sections as FeatureSection[]
        )
      : [];

  const sources =
    Array.isArray(
      feature.sources,
    )
      ? (
          feature.sources as FeatureSource[]
        ).filter(
          (
            source,
          ) =>
            Boolean(
              source.name?.trim() ||
                source.url?.trim(),
            ),
        )
      : [];

  const publishedDate =
    feature.published_at
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
            feature.published_at,
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
            articleJsonLd,
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
      name: "Features",
      url: "/features",
    },
    {
      name:
        feature.title,
      url:
        `/features/${feature.slug}`,
    },
  ]}
/>

      <BreakingBar />

      <article>
        <header className="site-shell pt-10 sm:pt-14">
          <div className="border-b border-white/10 pb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <Link
                href="/features"
                className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b] transition hover:text-white"
              >
                Feature
              </Link>

              {publishedDate ? (
                <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                  {
                    publishedDate
                  }
                </span>
              ) : null}
            </div>

            <h1 className="mt-5 max-w-6xl text-4xl font-black leading-[0.96] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              {
                feature.title
              }
            </h1>

            {feature.excerpt ? (
              <p className="mt-6 max-w-4xl text-lg leading-8 text-white/55 sm:text-xl">
                {
                  feature.excerpt
                }
              </p>
            ) : null}
          </div>
        </header>

        {feature.hero_image_url ? (
          <div className="site-shell mt-8">
            <div className="aspect-[16/8] overflow-hidden bg-[#090b0d]">
              <img
                src={
                  feature.hero_image_url
                }
                alt={
                  feature.title
                }
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        ) : null}

        <div className="site-shell py-10 sm:py-14">
          <div className="mx-auto max-w-3xl">
            {feature.intro ? (
              <div className="mb-14 text-lg leading-8 text-white/75">
                {feature.intro
                  .split(
                    "\n",
                  )
                  .filter(
                    Boolean,
                  )
                  .map(
                    (
                      paragraph:
                        string,
                      index:
                        number,
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
                    className="mb-16"
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
                              paragraph:
                                string,
                              paragraphIndex:
                                number,
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
                            feature.title
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
                            feature.title
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

            {linkedPeople.length >
            0 ? (
              <section className="mt-14 border-t border-white/10 pt-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                    In This Feature
                  </p>

                  <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                    People
                  </h2>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {linkedPeople.map(
                    (
                      person,
                    ) => (
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

            {sources.length >
            0 ? (
              <section className="mt-14 border-t border-white/10 pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                  Research
                </p>

                <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em] text-white">
                  Sources &amp; Further Reading
                </h2>

                <div className="mt-6 divide-y divide-white/10 border-y border-white/10">
                  {sources.map(
                    (
                      source,
                      index,
                    ) => {
                      const sourceUrl =
                        getSafeSourceUrl(
                          source.url,
                        );

                      const label =
                        getSourceLabel(
                          source,
                        );

                      return (
                        <div
                          key={
                            `${label}-${index}`
                          }
                          className="flex items-center justify-between gap-5 py-4"
                        >
                          <div className="min-w-0">
                            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/25">
                              Source{" "}
                              {String(
                                index +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <p className="mt-1 truncate text-sm font-bold text-white/70">
                              {
                                label
                              }
                            </p>
                          </div>

                          {sourceUrl ? (
                            <a
                              href={
                                sourceUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-[9px] font-black uppercase tracking-[0.12em] text-[#f21f2b] transition hover:text-white"
                            >
                              Visit Source →
                            </a>
                          ) : null}
                        </div>
                      );
                    },
                  )}
                </div>
              </section>
            ) : null}

            <div className="mt-12 border-t border-white/10 pt-8">
              <Link
                href="/features"
                className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
              >
                ← More Features
              </Link>
            </div>
          </div>
        </div>
      </article>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}