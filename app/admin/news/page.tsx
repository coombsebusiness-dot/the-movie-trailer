import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export default async function AdminNewsPage() {
  const supabase =
    createAdminClient();

  const {
    data: stories,
    error,
  } =
    await supabase
      .from("news")
      .select(
        "id, title, slug, category, status, published_at, updated_at",
      )
      .order(
        "updated_at",
        {
          ascending: false,
        },
      );

  if (error) {
    throw new Error(
      `Failed to load news: ${error.message}`,
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            News Desk
          </p>

          <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
            Stories
          </h1>

          <p className="mt-3 text-sm text-white/45">
            {stories.length} stories in the database
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="bg-[#f21f2b] px-5 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black"
        >
          New Story
        </Link>
      </div>

      <div className="overflow-hidden border border-white/10 bg-[#0b0d0f]">
        {stories.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-lg font-black">
              No stories yet.
            </p>

            <p className="mt-2 text-sm text-white/40">
              Create the first story for The Movie Trailer.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10">
            {stories.map(
              (
                story: typeof stories[number],
              ) => (
                <Link
                  key={story.id}
                  href={`/admin/news/${story.id}/edit`}
                  className="grid gap-4 p-5 transition hover:bg-white/[0.03] md:grid-cols-[1fr_160px_120px]"
                >
                  <div>
                    <h2 className="font-black">
                      {story.title}
                    </h2>

                    <p className="mt-1 text-xs text-white/35">
                      /{story.slug}
                    </p>
                  </div>

                  <div className="text-xs font-bold uppercase tracking-[0.08em] text-white/50">
                    {story.category}
                  </div>

                  <div>
                    <span
                      className={
                        story.status ===
                        "published"
                          ? "text-xs font-black uppercase tracking-[0.1em] text-[#f21f2b]"
                          : "text-xs font-black uppercase tracking-[0.1em] text-white/40"
                      }
                    >
                      {story.status}
                    </span>
                  </div>
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}