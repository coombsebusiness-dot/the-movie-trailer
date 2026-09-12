import Image from "next/image";
import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

function formatDate(
  date: string | null,
) {
  if (!date) {
    return "";
  }

  return new Date(
    date,
  )
    .toLocaleDateString(
      "en-GB",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      },
    )
    .toUpperCase();
}

export default async function HeroNewsGrid() {
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
      )
      .limit(4);

  if (error) {
    throw new Error(
      `Failed to load homepage stories: ${error.message}`,
    );
  }

  const [
    leadStory,
    ...sideStories
  ] = stories;

  if (!leadStory) {
    return (
      <section className="site-shell py-8">
        <div className="movie-card-image flex min-h-[430px] items-center justify-center border border-white/10">
          <p className="text-sm font-black uppercase tracking-[0.14em] text-white/30">
            Latest stories coming soon
          </p>
        </div>
      </section>
    );
  }

  const [
    topStory,
    ...smallStories
  ] = sideStories;

  return (
    <section className="site-shell py-8">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.85fr)]">
        {/* Main hero */}
        <Link
          href={`/news/${leadStory.slug}`}
          className="group relative h-[430px] overflow-hidden border border-white/10 bg-[#0b0d0f]"
        >
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
              priority
              sizes="(max-width: 1280px) 100vw, 65vw"
              className="object-cover transition duration-700 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="movie-card-image absolute inset-0" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              {leadStory.category.replace(
                /-/g,
                " ",
              )}
            </p>

            <h1 className="mt-3 max-w-4xl text-3xl font-black leading-[1] tracking-[-0.045em] text-white transition-colors group-hover:text-[#f21f2b] md:text-4xl xl:text-5xl">
              {
                leadStory.title
              }
            </h1>

            {leadStory.excerpt ? (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
                {
                  leadStory.excerpt
                }
              </p>
            ) : null}

            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-black uppercase tracking-[0.12em] text-white">
                Read Story
              </span>

              <span className="text-lg text-[#f21f2b]">
                →
              </span>
            </div>
          </div>
        </Link>

        {/* Top Stories */}
        <aside className="flex h-[430px] flex-col overflow-hidden border border-white/10 bg-[#0b0d0f]">
          <div className="flex h-[57px] shrink-0 items-center justify-between border-b border-white/10 px-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              Top Stories
            </p>

            <Link
              href="/news"
              className="text-[9px] font-black uppercase tracking-[0.12em] text-white/35 transition hover:text-white"
            >
              View All News →
            </Link>
          </div>

          {topStory ? (
            <>
              {/* Story 01 - image-led mini hero */}
              <Link
                href={`/news/${topStory.slug}`}
                className="group relative block h-[205px] shrink-0 overflow-hidden border-b border-white/10 bg-black"
              >
                {topStory.hero_image_url ? (
                  <Image
                    src={
                      topStory.hero_image_url
                    }
                    alt={
                      topStory.title
                    }
                    fill
                    unoptimized
                    sizes="500px"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="movie-card-image absolute inset-0" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/5" />

                <div className="absolute inset-x-0 bottom-0 z-10 p-5">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.14em] text-[#f21f2b]">
                        {topStory.category.replace(
                          /-/g,
                          " ",
                        )}
                      </p>

                      <h2 className="mt-2 max-w-[340px] text-lg font-black leading-[1.1] tracking-[-0.025em] text-white">
                        {
                          topStory.title
                        }
                      </h2>

                      <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.1em] text-white/40">
                        {formatDate(
                          topStory.published_at,
                        )}
                      </p>
                    </div>

                    <span className="pb-1 text-xl text-[#f21f2b] transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>

                <span className="absolute left-5 top-4 z-10 text-2xl font-black tracking-[-0.05em] text-white/35">
                  01
                </span>
              </Link>

              {/* Stories 02 + 03 */}
              <div className="grid flex-1 grid-rows-2">
                {smallStories.map(
                  (
                    story,
                    index,
                  ) => (
                    <Link
                      key={
                        story.id
                      }
                      href={`/news/${story.slug}`}
                      className="group grid min-h-0 grid-cols-[46px_86px_minmax(0,1fr)_22px] items-center gap-3 border-b border-white/10 px-4 last:border-b-0"
                    >
                      <span className="text-xl font-black tracking-[-0.05em] text-white/15 transition group-hover:text-[#f21f2b]">
                        {String(
                          index +
                            2,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      <div className="movie-card-image relative h-[54px] overflow-hidden">
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
                            sizes="86px"
                            className="object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[8px] font-black uppercase tracking-[0.12em] text-[#f21f2b]">
                          {story.category.replace(
                            /-/g,
                            " ",
                          )}
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-xs font-black leading-snug tracking-[-0.015em] text-white transition group-hover:text-[#f21f2b]">
                          {
                            story.title
                          }
                        </h3>

                        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.08em] text-white/25">
                          {formatDate(
                            story.published_at,
                          )}
                        </p>
                      </div>

                      <span className="text-sm text-[#f21f2b] transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  ),
                )}

                {smallStories.length <
                2
                  ? Array.from({
                      length:
                        2 -
                        smallStories.length,
                    }).map(
                      (
                        _,
                        index,
                      ) => (
                        <div
                          key={`empty-${index}`}
                          className="flex items-center border-b border-white/10 px-5 last:border-b-0"
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/15">
                            More news coming soon
                          </p>
                        </div>
                      ),
                    )
                  : null}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-8 text-center">
              <div>
                <p className="text-lg font-black tracking-[-0.03em] text-white/35">
                  More stories incoming.
                </p>

                <p className="mx-auto mt-3 max-w-[240px] text-xs leading-6 text-white/25">
                  The latest movie and TV news will appear here as it breaks.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}