import Image from "next/image";
import Link from "next/link";

import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";

import {
  createClient,
} from "@/lib/supabase/server";

export const metadata = {
  title: "Movie & TV News",

  description:
    "The latest movie and TV news, casting updates, release dates, trailers and entertainment stories from The Movie Trailer.",

  alternates: {
    canonical: "/news",
  },

  openGraph: {
    type: "website",
    siteName: "The Movie Trailer",
    title: "Movie & TV News",
    description:
      "The latest movie and TV news, casting updates, release dates, trailers and entertainment stories from The Movie Trailer.",
    url: "/news",
  },

  twitter: {
    card: "summary_large_image",
    title: "Movie & TV News",
    description:
      "The latest movie and TV news, casting updates, release dates, trailers and entertainment stories from The Movie Trailer.",
  },
};

export default async function NewsIndexPage() {
  const supabase =
    await createClient();

  const {
    data: stories,
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
          hero_image_url,
          published_at
        `,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        new Date().toISOString(),
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      );

  if (error) {
    throw new Error(
      `Failed to load news: ${error.message}`,
    );
  }

  const [
    leadStory,
    ...otherStories
  ] = stories;

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />
      <BreakingBar />

      <section className="site-shell py-12">
        <div className="border-b border-white/10 pb-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            The News Desk
          </p>

          <h1 className="mt-3 text-5xl font-black uppercase tracking-[-0.055em] md:text-6xl">
            Latest News
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-white/50">
            Movie and TV news, trailers, casting,
            release dates and the stories shaping
            entertainment right now.
          </p>
        </div>

        {!leadStory ? (
          <div className="py-20 text-center">
            <p className="text-xl font-black">
              No published stories yet.
            </p>
          </div>
        ) : (
          <>
            <Link
              href={`/news/${leadStory.slug}`}
              className="group mt-8 grid gap-7 border-b border-white/10 pb-10 lg:grid-cols-[1.4fr_1fr]"
            >
              <div className="movie-card-image relative aspect-video overflow-hidden border border-white/10">
                {leadStory.hero_image_url ? (
                  <Image
                    src={
                      leadStory.hero_image_url
                    }
                    alt={
                      leadStory.title
                    }
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                ) : null}
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                  {leadStory.category.replace(
                    /-/g,
                    " ",
                  )}
                </p>

                <h2 className="mt-4 text-3xl font-black leading-tight tracking-[-0.045em] transition group-hover:text-[#f21f2b] md:text-5xl">
                  {leadStory.title}
                </h2>

                {leadStory.excerpt ? (
                  <p className="mt-5 text-base leading-7 text-white/50">
                    {
                      leadStory.excerpt
                    }
                  </p>
                ) : null}

                {leadStory.published_at ? (
                  <p className="mt-6 text-[10px] font-black uppercase tracking-[0.12em] text-white/30">
                    {new Date(
                      leadStory.published_at,
                    ).toLocaleDateString(
                      "en-GB",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                ) : null}
              </div>
            </Link>

            {otherStories.length >
            0 ? (
              <div className="grid gap-x-6 gap-y-10 py-10 md:grid-cols-2 xl:grid-cols-3">
                {otherStories.map(
                  (
                    story,
                  ) => (
                    <Link
                      key={
                        story.id
                      }
                      href={`/news/${story.slug}`}
                      className="group"
                    >
                      <div className="movie-card-image relative aspect-video overflow-hidden border border-white/10">
                        {story.hero_image_url ? (
                          <Image
                            src={
                              story.hero_image_url
                            }
                            alt={
                              story.title
                            }
                            fill
                            unoptimized
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                          />
                        ) : null}
                      </div>

                      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.15em] text-[#f21f2b]">
                        {story.category.replace(
                          /-/g,
                          " ",
                        )}
                      </p>

                      <h2 className="mt-2 text-xl font-black leading-tight tracking-[-0.03em] transition group-hover:text-[#f21f2b]">
                        {
                          story.title
                        }
                      </h2>

                      {story.excerpt ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                          {
                            story.excerpt
                          }
                        </p>
                      ) : null}
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </>
        )}
     </section>

      <NewsletterSignup />

      <SiteFooter />

    </main>
  );
}