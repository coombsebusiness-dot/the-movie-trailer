import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import Image from "next/image";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

type NewsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type NewsBody = {
  intro?: string;
  sections?: {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl?: string;
  youtubeUrl?: string;
}[];
};

async function getStory(
  slug: string,
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("news")
      .select(
        `
          id,
          slug,
          title,
          excerpt,
          category,
          body,
          hero_image_url,
          seo_title,
          seo_description,
          source_name,
          source_url,
          published_at,
          publisher_audio_article_id,
          publisher_audio_status,
          publisher_audio_enabled
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
}: NewsPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const story =
    await getStory(
      slug,
    );

  if (!story) {
    return {};
  }

  const title =
    story.seo_title?.trim() ||
    story.title;

  const description =
    story.seo_description?.trim() ||
    story.excerpt?.trim() ||
    undefined;

  const canonicalUrl =
    `/news/${story.slug}`;

  const images =
    story.hero_image_url
      ? [
          {
            url:
              story.hero_image_url,
            alt:
              story.title,
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
        story.published_at,
      images,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images:
        story.hero_image_url
          ? [
              story.hero_image_url,
            ]
          : undefined,
    },
  };
}

export default async function NewsPage({
  params,
}: NewsPageProps) {
  const {
    slug,
  } =
    await params;

  const story =
    await getStory(
      slug,
    );

  if (
    !story
  ) {
    notFound();
  }

  const canonicalUrl =
  `${siteUrl}/news/${story.slug}`;

const articleDescription =
  story.seo_description?.trim() ||
  story.excerpt?.trim() ||
  undefined;

const newsArticleJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "NewsArticle",

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
    story.title,

  ...(articleDescription
    ? {
        description:
          articleDescription,
      }
    : {}),

  ...(story.hero_image_url
    ? {
        image: [
          story.hero_image_url,
        ],
      }
    : {}),

  datePublished:
    story.published_at,

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

  const body =
    (story.body ??
      {}) as NewsBody;

      const supabase =
  await createClient();

const {
  data: newsPeopleData,
  error: newsPeopleError,
} = await supabase
  .from(
    "news_people",
  )
  .select(
    "person_id",
  )
  .eq(
    "news_id",
    story.id,
  );

if (
  newsPeopleError
) {
  console.error(
    "Failed to load story people:",
    newsPeopleError,
  );
}

const storyPersonIds =
  new Set(
    (
      newsPeopleData ??
      []
    ).map(
      (
        relationship,
      ) =>
        relationship.person_id as string,
    ),
  );

const curatedPeople =
  storyPersonIds.size > 0
    ? await getCuratedPeople()
    : [];

const storyPeople =
  curatedPeople.filter(
    (
      person,
    ) =>
      storyPersonIds.has(
        person.id,
      ),
  );

  const publishedDate =
    story.published_at
      ? new Date(
          story.published_at,
        ).toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
          },
        )
      : null;

      function getYouTubeVideoId(
  value?: string | null,
) {
  if (!value) {
    return null;
  }

  try {
    const url =
      new URL(value);

    const hostname =
      url.hostname
        .replace(
          /^www\./,
          "",
        )
        .toLowerCase();

    if (
      hostname ===
        "youtu.be"
    ) {
      return (
        url.pathname
          .split("/")
          .filter(Boolean)[0] ??
        null
      );
    }

    if (
      hostname ===
        "youtube.com" ||
      hostname ===
        "m.youtube.com"
    ) {
      if (
        url.pathname ===
        "/watch"
      ) {
        return (
          url.searchParams.get(
            "v",
          ) ?? null
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

  return (
  <main className="min-h-screen bg-[#050607] text-white">
   <script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html:
      JSON.stringify(
        newsArticleJsonLd,
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
      name: "News",
      url: "/news",
    },
    {
      name:
        story.title,
      url:
        `/news/${story.slug}`,
    },
  ]}
/>

<SiteHeader />

    <BreakingBar />

    <article className="site-shell py-14">
        <header className="mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            {story.category.replace(
              /-/g,
              " ",
            )}
          </p>

          <h1 className="mt-5 text-4xl font-black leading-[0.98] tracking-[-0.055em] md:text-6xl">
            {story.title}
          </h1>

          {story.excerpt ? (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/60">
              {story.excerpt}
            </p>
          ) : null}

          {publishedDate ? (
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
              Published{" "}
              {publishedDate}
            </p>
          ) : null}
        </header>

        {story.hero_image_url ? (
          <div className="mx-auto mt-10 max-w-6xl overflow-hidden border border-white/10 bg-[#0b0d0f]">
            <div className="relative aspect-[16/9] w-full">
  <Image
    src={
      story.hero_image_url
    }
    alt={
      story.title
    }
    fill
    unoptimized
    sizes="(max-width: 1280px) 100vw, 1152px"
    className="object-cover"
  />
</div>
          </div>
        ) : (
          <div className="movie-card-image mx-auto mt-10 aspect-[16/9] max-w-6xl border border-white/10" />
        )}

        {story.publisher_audio_enabled &&
        story.publisher_audio_status ===
          "ready" &&
        story.publisher_audio_article_id ? (
          <iframe
            src={`${process.env.NEXT_PUBLIC_PUBLISHER_AUDIO_URL ?? "http://localhost:3000"}/player/${encodeURIComponent(
              story.publisher_audio_article_id,
            )}`}
            title={`Listen to ${story.title}`}
            loading="lazy"
            allow="autoplay"
            className="mx-auto mt-8 block w-full max-w-3xl border-0"
            style={{
              height: "200px",
              backgroundColor: "#000000",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          />
        ) : null}

        <div className="mx-auto mt-12 max-w-3xl">
          {body.intro ? (
            <div className="space-y-6 text-[17px] leading-8 text-white/80">
              {body.intro
                .split(
                  "\n",
                )
                .filter(
                  Boolean,
                )
                .map(
                  (
                    paragraph,
                  ) => (
                    <p
                      key={
                        paragraph
                      }
                    >
                      {paragraph}
                    </p>
                  ),
                )}
            </div>
          ) : null}

          {body.sections?.map(
            (
              section,
              index,
            ) => (
              <section
                key={
                  index
                }
                className="mt-12 border-t border-white/10 pt-9"
              >
                {section.eyebrow ? (
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                    {
                      section.eyebrow
                    }
                  </p>
                ) : null}

                {section.headline ? (
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.04em]">
                    {
                      section.headline
                    }
                  </h2>
                ) : null}

                {section.body ? (
                  <div className="mt-5 space-y-6 text-[17px] leading-8 text-white/75">
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
                        ) => (
                          <p
                            key={
                              paragraph
                            }
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
  <figure className="mt-8 overflow-hidden border border-white/10 bg-black">
    <img
      src={
        section.imageUrl
      }
      alt={
        section.headline ||
        story.title
      }
      className="h-auto w-full object-cover"
    />
  </figure>
) : null}

{(() => {
  const videoId =
    getYouTubeVideoId(
      section.youtubeUrl,
    );

  if (!videoId) {
    return null;
  }

  return (
    <div className="mt-8 overflow-hidden border border-white/10 bg-black">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={
            section.headline
              ? `${section.headline} video`
              : `${story.title} video`
          }
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </div>
  );
})()}
              </section>
            ),
          )}

          {storyPeople.length >
0 ? (
  <section className="mt-12 border-t border-white/10 pt-9">
    <div className="mb-6">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
        In This Story
      </p>

      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">
        People
      </h2>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      {storyPeople.map(
        (
          person,
        ) => (
          <Link
            key={
              person.id
            }
            href={`/people/${person.slug}`}
            className="group flex items-center gap-4 border border-white/10 bg-[#0b0d0f] p-3 transition hover:border-[#f21f2b]/60"
          >
            <div className="h-16 w-12 shrink-0 overflow-hidden bg-white/5">
              {person.profile_image_url ? (
                <Image
                  src={
                    person.profile_image_url
                  }
                  alt={
                    person.name
                  }
                  width={
                    96
                  }
                  height={
                    128
                  }
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Person
              </div>

              <div className="mt-1 truncate text-sm font-black text-white transition group-hover:text-[#f21f2b]">
                {
                  person.name
                }
              </div>
            </div>

            <span
              aria-hidden="true"
              className="text-lg font-black text-white/20 transition group-hover:translate-x-1 group-hover:text-[#f21f2b]"
            >
              →
            </span>
          </Link>
        ),
      )}
    </div>
  </section>
) : null}

          {story.source_name ||
          story.source_url ? (
            <section className="mt-12 border-t border-white/10 pt-7">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/35">
                Source
              </p>

              {story.source_url ? (
                <a
                  href={
                    story.source_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-bold text-[#f21f2b] transition hover:text-white"
                >
                  {story.source_name ??
                    story.source_url}
                </a>
              ) : (
                <p className="mt-2 text-sm text-white/60">
                  {
                    story.source_name
                  }
                </p>
              )}
            </section>
          ) : null}
        </div>
            </article>

      <NewsletterSignup />

      <SiteFooter />

    </main>
  );
}