import type {
  Metadata,
} from "next";

import Link from "next/link";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata: Metadata = {
  title:
    "Movie & TV Features",

  description:
    "Movie and TV features, deep dives, lists, analysis and entertainment stories from The Movie Trailer.",

  alternates: {
    canonical:
      "/features",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "Movie & TV Features | The Movie Trailer",
    description:
      "Movie and TV features, deep dives, lists, analysis and entertainment stories from The Movie Trailer.",
    url:
      "/features",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Movie & TV Features | The Movie Trailer",
    description:
      "Movie and TV features, deep dives, lists, analysis and entertainment stories from The Movie Trailer.",
  },
};

export const dynamic =
  "force-dynamic";

export default async function FeaturesPage() {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const {
    data: stories,
    error,
  } = await supabase
    .from(
      "features",
    )
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
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
    );

  if (error) {
    throw new Error(
      `Failed to load features: ${error.message}`,
    );
  }

  const featuredStory =
    stories?.[0] ??
    null;

  const remainingStories =
    stories?.slice(1) ??
    [];

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <section className="border-b border-white/10">
        <div className="site-shell py-12 md:py-16">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
            Go Deeper
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.055em] md:text-7xl">
            Features
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
            Deep dives, lists,
            analysis and stories
            exploring the movies,
            television and people
            everyone is talking
            about.
          </p>
        </div>
      </section>

      {featuredStory ? (
        <section className="site-shell py-8 md:py-10">
          <Link
            href={`/features/${featuredStory.slug}`}
            className="group grid overflow-hidden border border-white/10 bg-[#090b0d] lg:grid-cols-[1.35fr_0.85fr]"
          >
            <div className="relative min-h-[320px] overflow-hidden bg-[#0b0d0f] md:min-h-[430px]">
              {featuredStory.hero_image_url ? (
                <img
                  src={
                    featuredStory.hero_image_url
                  }
                  alt={
                    featuredStory.title
                  }
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div className="movie-card-image absolute inset-0" />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/30" />
            </div>

            <div className="flex flex-col justify-end p-7 md:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                Featured Story
              </p>

              <h2 className="mt-4 text-3xl font-black leading-[0.98] tracking-[-0.045em] transition group-hover:text-[#f21f2b] md:text-5xl">
                {
                  featuredStory.title
                }
              </h2>

              {featuredStory.excerpt ? (
                <p className="mt-5 text-sm leading-7 text-white/50">
                  {
                    featuredStory.excerpt
                  }
                </p>
              ) : null}

              <div className="mt-7 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 transition group-hover:border-[#f21f2b] group-hover:bg-[#f21f2b]">
                  →
                </span>

                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-white/55">
                  Read Feature
                </span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="site-shell section-rule py-10">
        <div className="mb-7 flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
              Stories Worth Reading
            </p>

            <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em]">
              Latest Features
            </h2>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/25">
            {stories?.length ?? 0}{" "}
            {stories?.length === 1
              ? "Feature"
              : "Features"}
          </p>
        </div>

        {!featuredStory ? (
          <div className="border border-white/10 bg-[#090b0d] p-10 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              Features Desk
            </p>

            <h2 className="mt-3 text-2xl font-black uppercase tracking-[-0.04em]">
              The Bigger Story
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/35">
              Our first features are
              on the way. Deep dives,
              lists and stories from
              across movies and
              television will appear
              here.
            </p>
          </div>
        ) : remainingStories.length >
          0 ? (
          <div className="grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {remainingStories.map(
              (
                story,
              ) => (
                <Link
                  key={
                    story.id
                  }
                  href={`/features/${story.slug}`}
                  className="group block"
                >
                  <article>
                    <div className="movie-card-image relative aspect-[16/10] overflow-hidden border border-white/10">
                      {story.hero_image_url ? (
                        <img
                          src={
                            story.hero_image_url
                          }
                          alt={
                            story.title
                          }
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : null}
                    </div>

                    <p className="mt-4 text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                      Feature
                    </p>

                    <h3 className="mt-2 text-xl font-black leading-[1.05] tracking-[-0.035em] transition group-hover:text-[#f21f2b]">
                      {
                        story.title
                      }
                    </h3>

                    {story.excerpt ? (
                      <p className="mt-3 line-clamp-3 text-xs leading-5 text-white/40">
                        {
                          story.excerpt
                        }
                      </p>
                    ) : null}
                  </article>
                </Link>
              ),
            )}
          </div>
        ) : (
          <div className="border-t border-white/10 py-8">
            <p className="text-sm text-white/30">
              More features coming
              soon.
            </p>
          </div>
        )}
      </section>

      <NewsletterSignup />

      <SiteFooter />
    </main>
  );
}