import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

type BreakingStory = {
  id: string;
  slug: string;
  title: string;
};

export default async function BreakingBar() {
  const supabase =
    await createClient();

  const now =
    new Date().toISOString();

  const {
    data,
    error,
  } = await supabase
    .from("news")
    .select(`
      id,
      slug,
      title
    `)
    .eq("status", "published")
    .lte("published_at", now)
    .order("published_at", {
      ascending: false,
    })
    .limit(8);

  if (error) {
    console.error(
      "Failed to load breaking news ticker:",
      error,
    );
  }

  const stories =
    (data ?? []) as BreakingStory[];

  if (stories.length === 0) {
    return null;
  }

  /*
   * Duplicate the same sequence so the
   * ticker can loop continuously.
   */
  const tickerStories = [
    ...stories,
    ...stories,
  ];

  return (
    <section className="border-b border-white/10 bg-[#090a0c]">
      <div className="site-shell flex min-h-12 items-stretch overflow-hidden">
        <Link
          href="/news"
          className="relative z-10 flex shrink-0 items-center bg-[#f21f2b] px-5 text-[11px] font-black uppercase tracking-[0.08em] text-white transition hover:bg-red-500"
        >
          Breaking
        </Link>

        <div className="group flex min-w-0 flex-1 items-center overflow-hidden">
          <div className="breaking-ticker flex min-w-max items-center group-hover:[animation-play-state:paused]">
            {tickerStories.map(
              (
                story,
                index,
              ) => (
                <Link
                  key={`${story.id}-${index}`}
                  href={`/news/${story.slug}`}
                  className="flex shrink-0 items-center px-5 text-[11px] font-semibold text-white/70 transition hover:text-white"
                >
                  {story.title}

                  <span
                    aria-hidden="true"
                    className="ml-5 text-[#f21f2b]"
                  >
                    ◆
                  </span>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}