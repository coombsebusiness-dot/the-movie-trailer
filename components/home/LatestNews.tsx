import Link from "next/link";

import SectionHeader from "@/components/ui/SectionHeader";

import StoryCard from "@/components/ui/StoryCard";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function LatestNews() {
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
      )
      .limit(15);

  if (error) {
    throw new Error(
      `Failed to load latest news: ${error.message}`,
    );
  }

  const latestStories =
    stories.slice(
      0,
      6,
    );

  const moreHeadlines =
    stories.slice(
      6,
      15,
    );

  return (
    <div className="flex h-full flex-col">
      <SectionHeader
        title="Latest News"
        actionLabel="View all →"
        actionHref="/news"
      />

      {stories.length ===
      0 ? (
        <p className="text-sm text-white/40">
          No published stories yet.
        </p>
      ) : (
        <>
          <div className="space-y-5">
            {latestStories.map(
              (
                story,
              ) => (
                <Link
                  key={
                    story.id
                  }
                  href={`/news/${story.slug}`}
                  className="group block"
                >
                  <StoryCard
                    title={
                      story.title
                    }
                    meta={story.category.replace(
                      /-/g,
                      " ",
                    )}
                    imageUrl={
                      story.hero_image_url
                    }
                    compact
                  />
                </Link>
              ),
            )}
          </div>

          {moreHeadlines.length >
          0 ? (
            <div className="mt-8 border-t border-white/10 pt-6">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                    News Desk
                  </p>

                  <h3 className="mt-1 text-xl font-black uppercase tracking-[-0.035em] text-white">
                    More Headlines
                  </h3>
                </div>

                <Link
                  href="/news"
                  className="text-[9px] font-black uppercase tracking-[0.14em] text-white/30 transition hover:text-[#f21f2b]"
                >
                  All News →
                </Link>
              </div>

              <div className="border-y border-white/10">
                {moreHeadlines.map(
                  (
                    story,
                    index,
                  ) => (
                    <Link
                      key={
                        story.id
                      }
                      href={`/news/${story.slug}`}
                      className="group grid grid-cols-[34px_1fr] gap-3 border-b border-white/10 py-4 last:border-b-0"
                    >
                      <div className="pt-[2px] text-[10px] font-black tabular-nums text-white/20 transition group-hover:text-[#f21f2b]">
                        {String(
                          index +
                            1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </div>

                      <div>
                        <p className="mb-1 text-[8px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                          {story.category.replace(
                            /-/g,
                            " ",
                          )}
                        </p>

                        <h4 className="text-sm font-black leading-[1.3] tracking-[-0.015em] text-white/85 transition group-hover:text-white">
                          {
                            story.title
                          }
                        </h4>
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}