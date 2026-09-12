import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type FeaturedContent = {
  type: "news" | "movie" | "trailer";
  eyebrow: string;
  headline: string;
  excerpt: string | null;
  imageUrl: string | null;
  href: string;
};

export default async function FeaturedStory() {
  const featured =
    await getFeaturedContent();

  const supabase =
    createAdminClient();

  const now =
    new Date().toISOString();

  const {
    data: trendingStories,
    error: trendingError,
  } = await supabase
    .from("news")
    .select(`
      id,
      slug,
      title,
      category,
      published_at
    `)
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
    .limit(8);

  if (trendingError) {
    console.error(
      "Unable to load Trending Now stories:",
      trendingError,
    );
  }

  const filteredTrending =
    (trendingStories ?? [])
      .filter(
        (story) =>
          `/news/${story.slug}` !==
          featured?.href,
      )
      .slice(
        0,
        6,
      );

  if (!featured) {
    return (
      <div className="border-x border-white/10 px-0 lg:px-7">
        <h2 className="mb-5 text-2xl font-black uppercase tracking-[-0.04em]">
          Featured
        </h2>

        <div className="border border-white/10 bg-[#090b0d] p-8">
          <p className="text-sm font-bold text-white/30">
            Featured stories coming soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-x border-white/10 px-0 lg:px-7">
      <h2 className="mb-5 text-2xl font-black uppercase tracking-[-0.04em]">
        Featured
      </h2>

      <article>
        <Link
          href={featured.href}
          className="group block"
        >
          {featured.imageUrl ? (
            <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-[#090b0d]">
              <img
                src={
                  featured.imageUrl
                }
                alt={
                  featured.headline
                }
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            </div>
          ) : (
            <div className="movie-card-image relative aspect-[16/9] overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_50%,rgba(242,31,43,0.23),transparent_42%)]" />
            </div>
          )}

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.14em] text-[#f21f2b]">
            {
              featured.eyebrow
            }
          </p>

          <h3 className="mt-2 text-3xl font-black leading-[0.98] tracking-[-0.04em] transition group-hover:text-[#f21f2b]">
            {
              featured.headline
            }
          </h3>

          {featured.excerpt ? (
            <p className="mt-4 text-sm leading-6 text-white/55">
              {
                featured.excerpt
              }
            </p>
          ) : null}
        </Link>
      </article>

      {filteredTrending.length >
      0 ? (
        <section className="mt-10 border-t border-white/10 pt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Right Now
              </p>

              <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">
                Trending Now
              </h3>
            </div>

            <Link
              href="/news"
              className="text-[9px] font-black uppercase tracking-[0.14em] text-white/45 transition hover:text-[#f21f2b]"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-white/[0.08]">
            {filteredTrending.map(
              (
                story,
                index,
              ) => (
                <Link
                  key={
                    story.id
                  }
                  href={`/news/${story.slug}`}
                  className="group grid grid-cols-[34px_1fr] gap-3 py-4 first:pt-0"
                >
                  <div className="pt-0.5 text-sm font-black text-[#f21f2b]">
                    {String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.13em] text-white/30">
                      {story.category.replace(
                        /-/g,
                        " ",
                      )}
                    </p>

                    <h4 className="mt-1 text-sm font-black leading-5 text-white/85 transition group-hover:text-[#f21f2b]">
                      {
                        story.title
                      }
                    </h4>
                  </div>
                </Link>
              ),
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}

async function getFeaturedContent():
  Promise<FeaturedContent | null> {
  const supabase =
    createAdminClient();

  const now =
    new Date().toISOString();

  /*
   * First look for the item chosen
   * manually in Homepage Admin.
   */
  const {
    data: featuredRow,
    error: featuredError,
  } = await supabase
    .from("homepage_featured")
    .select(
      `
        content_type,
        content_id,
        eyebrow,
        headline,
        excerpt,
        image_url
      `,
    )
    .eq("is_active", true)
    .order(
      "updated_at",
      {
        ascending: false,
      },
    )
    .limit(1)
    .maybeSingle();

  if (featuredError) {
    console.error(
      "Unable to load homepage featured row:",
      featuredError,
    );
  }

  if (featuredRow) {
    const manualFeatured =
      await resolveFeaturedContent(
        featuredRow.content_type,
        featuredRow.content_id,
        {
          eyebrow:
            featuredRow.eyebrow,

          headline:
            featuredRow.headline,

          excerpt:
            featuredRow.excerpt,

          imageUrl:
            featuredRow.image_url,
        },
        now,
      );

    if (manualFeatured) {
      return manualFeatured;
    }
  }

  /*
   * Fallback:
   * newest published news story.
   *
   * This means the homepage never
   * has an empty Featured position.
   */
  const {
    data: fallbackNews,
    error: fallbackError,
  } = await supabase
    .from("news")
    .select(
      `
        slug,
        title,
        excerpt,
        hero_image_url
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
    .limit(1)
    .maybeSingle();

  if (
    fallbackError ||
    !fallbackNews
  ) {
    if (fallbackError) {
      console.error(
        "Unable to load homepage Featured fallback:",
        fallbackError,
      );
    }

    return null;
  }

  return {
    type: "news",
    eyebrow: "News",
    headline:
      fallbackNews.title,
    excerpt:
      fallbackNews.excerpt,
    imageUrl:
      fallbackNews.hero_image_url,
    href: `/news/${fallbackNews.slug}`,
  };
}

async function resolveFeaturedContent(
  contentType: string,
  contentId: string,
  overrides: {
    eyebrow: string | null;
    headline: string | null;
    excerpt: string | null;
    imageUrl: string | null;
  },
  now: string,
): Promise<FeaturedContent | null> {
  const supabase =
    createAdminClient();

  if (contentType === "news") {
    const {
      data,
      error,
    } = await supabase
      .from("news")
      .select(
        `
          slug,
          title,
          excerpt,
          hero_image_url
        `,
      )
      .eq(
        "id",
        contentId,
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
      if (error) {
        console.error(
          "Unable to resolve featured news:",
          error,
        );
      }

      return null;
    }

    return {
      type: "news",

      eyebrow:
        overrides.eyebrow ||
        "News",

      headline:
        overrides.headline ||
        data.title,

      excerpt:
        overrides.excerpt ||
        data.excerpt,

      imageUrl:
        overrides.imageUrl ||
        data.hero_image_url,

      href:
        `/news/${data.slug}`,
    };
  }

  if (contentType === "movie") {
    const {
      data,
      error,
    } = await supabase
      .from("movies")
      .select(
        `
          slug,
          title,
          tagline,
          synopsis,
          backdrop_url,
          poster_url
        `,
      )
      .eq(
        "id",
        contentId,
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
      if (error) {
        console.error(
          "Unable to resolve featured movie:",
          error,
        );
      }

      return null;
    }

    return {
      type: "movie",

      eyebrow:
        overrides.eyebrow ||
        "Movie",

      headline:
        overrides.headline ||
        data.title,

      excerpt:
        overrides.excerpt ||
        data.tagline ||
        data.synopsis,

      imageUrl:
        overrides.imageUrl ||
        data.backdrop_url ||
        data.poster_url,

      href:
        `/movies/${data.slug}`,
    };
  }

  if (
    contentType ===
    "trailer"
  ) {
    const {
      data,
      error,
    } = await supabase
      .from("trailers")
      .select(
        `
          slug,
          title,
          description,
          thumbnail_url
        `,
      )
      .eq(
        "id",
        contentId,
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
      if (error) {
        console.error(
          "Unable to resolve featured trailer:",
          error,
        );
      }

      return null;
    }

    return {
      type: "trailer",

      eyebrow:
        overrides.eyebrow ||
        "Trailer",

      headline:
        overrides.headline ||
        data.title,

      excerpt:
        overrides.excerpt ||
        data.description,

      imageUrl:
        overrides.imageUrl ||
        data.thumbnail_url,

      href:
        `/trailers/${data.slug}`,
    };
  }

  return null;
}