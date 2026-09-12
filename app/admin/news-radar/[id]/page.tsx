import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type NewsStoryPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type NewsStory = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  author: string | null;
  image_url: string | null;
  published_at: string | null;
  fetched_at: string;
  relevance_score: number;
  freshness_score: number;
  trust_score: number;
  final_score: number;
  matched_terms: string[];
  score_reasons: string[];
  status:
    | "new"
    | "shortlisted"
    | "ignored"
    | "drafted"
    | "published";

  news_sources:
    | {
        id: string;
        name: string;
        homepage_url: string | null;
        category: string;
      }
    | {
        id: string;
        name: string;
        homepage_url: string | null;
        category: string;
      }[]
    | null;
};

function getSource(
  source: NewsStory["news_sources"],
) {
  if (!source) {
    return null;
  }

  if (Array.isArray(source)) {
    return (
      source[0] ??
      null
    );
  }

  return source;
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Unknown";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle:
        "medium",
      timeStyle:
        "short",
    },
  ).format(date);
}

function getPriority(
  score: number,
) {
  if (score >= 80) {
    return {
      label:
        "Breaking",
      className:
        "border-red-500/30 bg-red-500/10 text-red-300",
    };
  }

  if (score >= 65) {
    return {
      label:
        "Strong",
      className:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    };
  }

  if (score >= 45) {
    return {
      label:
        "Possible",
      className:
        "border-amber-500/30 bg-amber-500/10 text-amber-300",
    };
  }

  return {
    label:
      "Low",
    className:
      "border-white/10 bg-white/5 text-white/40",
  };
}

export const dynamic =
  "force-dynamic";

export default async function NewsStoryPage({
  params,
}: NewsStoryPageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "news_items",
      )
      .select(
        `
          id,
          title,
          url,
          summary,
          author,
          image_url,
          published_at,
          fetched_at,
          relevance_score,
          freshness_score,
          trust_score,
          final_score,
          matched_terms,
          score_reasons,
          status,
          news_sources (
            id,
            name,
            homepage_url,
            category
          )
        `,
      )
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    notFound();
  }

  const story =
    data as NewsStory;

  const source =
    getSource(
      story.news_sources,
    );

  const priority =
    getPriority(
      story.final_score,
    );

  return (
    <main className="mx-auto w-full max-w-[1200px] px-5 py-10 lg:px-8">
      <div className="mb-8">
        <Link
          href="/admin/news-radar"
          className="text-sm font-black text-red-400 transition hover:text-white"
        >
          ← Back to News Radar
        </Link>
      </div>

      <section className="rounded-xl border border-white/10 bg-[#090b0d] p-6 sm:p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-wider ${priority.className}`}
              >
                {
                  priority.label
                }
              </span>

              {source && (
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white/50">
                  {
                    source.name
                  }
                </span>
              )}

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white/40">
                {
                  story.status
                }
              </span>
            </div>

            <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-red-500">
              Editorial Decision Desk
            </p>

            <h1 className="max-w-4xl text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
              {
                story.title
              }
            </h1>

            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/40">
              <span>
                Published:{" "}
                {formatDate(
                  story.published_at,
                )}
              </span>

              <span>
                Fetched:{" "}
                {formatDate(
                  story.fetched_at,
                )}
              </span>

              {story.author && (
                <span>
                  Author:{" "}
                  {
                    story.author
                  }
                </span>
              )}
            </div>

            {story.summary && (
              <div className="mt-8 rounded-lg border border-white/10 bg-black/30 p-5">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                  RSS Source Material
                </p>

                <p className="text-base leading-8 text-white/65">
                  {
                    story.summary
                  }
                </p>
              </div>
            )}

            {story.matched_terms?.length >
              0 && (
              <div className="mt-7">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                  Matched Signals
                </p>

                <div className="flex flex-wrap gap-2">
                  {story.matched_terms.map(
                    term => (
                      <span
                        key={
                          term
                        }
                        className="rounded-md border border-red-500/20 bg-red-500/[0.06] px-3 py-1.5 text-xs font-bold text-red-300"
                      >
                        {
                          term
                        }
                      </span>
                    ),
                  )}
                </div>
              </div>
            )}

            {story.score_reasons?.length >
              0 && (
              <div className="mt-8 rounded-lg border border-white/10 bg-black/30 p-5">
                <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                  Why The Radar Scored It
                </p>

                <div className="space-y-2">
                  {story.score_reasons.map(
                    (
                      reason,
                      index,
                    ) => (
                      <div
                        key={`${reason}-${index}`}
                        className="flex gap-3 text-sm leading-6 text-white/50"
                      >
                        <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />

                        <span>
                          {
                            reason
                          }
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}
          </div>

          <aside className="w-full shrink-0 xl:w-[300px]">
            <div className="rounded-lg border border-white/10 bg-black/30 p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-white/30">
                Radar Score
              </p>

              <div className="mb-5 text-6xl font-black tracking-tight text-red-500">
                {
                  story.final_score
                }
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/40">
                    Relevance
                  </span>

                  <span className="font-black text-white">
                    {
                      story.relevance_score
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-sm text-white/40">
                    Freshness
                  </span>

                  <span className="font-black text-white">
                    {
                      story.freshness_score
                    }
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/40">
                    Source Trust
                  </span>

                  <span className="font-black text-white">
                    {
                      story.trust_score
                    }
                  </span>
                </div>
              </div>
            </div>

            <a
              href={
                story.url
              }
              target="_blank"
              rel="noreferrer"
              className="mt-4 block rounded-md border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-black uppercase tracking-wider text-white transition hover:bg-white/[0.08]"
            >
              Read Original Source ↗
            </a>

            {source?.homepage_url && (
              <a
                href={
                  source.homepage_url
                }
                target="_blank"
                rel="noreferrer"
                className="mt-2 block px-4 py-2 text-center text-xs font-bold text-white/30 transition hover:text-white"
              >
                Visit {
                  source.name
                }
              </a>
            )}
          </aside>
        </div>
      </section>

     <section className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.035] p-6">
  <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
    Editorial Actions
  </p>

  <h2 className="mt-2 text-xl font-black text-white">
    Decide what to do with this story
  </h2>

  <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
    Shortlist it for later, remove it from the radar, or generate a draft using
    The Movie Trailer Writer. Nothing is published automatically.
  </p>

  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
    {story.status !==
      "shortlisted" &&
      story.status !==
        "drafted" &&
      story.status !==
        "published" && (
        <form
          action={`/api/admin/news-radar/${story.id}/shortlist`}
          method="post"
        >
          <button
            type="submit"
            className="w-full rounded-md border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-black uppercase tracking-wider text-emerald-300 transition hover:bg-emerald-500/20 sm:w-auto"
          >
            Shortlist
          </button>
        </form>
      )}

    {story.status !==
      "drafted" &&
      story.status !==
        "published" && (
        <form
          action={`/api/admin/news-radar/${story.id}/generate`}
          method="post"
        >
          <button
            type="submit"
            className="w-full rounded-md bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 sm:w-auto"
          >
            Generate Article
          </button>
        </form>
      )}

    {story.status !==
      "ignored" &&
      story.status !==
        "drafted" &&
      story.status !==
        "published" && (
        <form
          action={`/api/admin/news-radar/${story.id}/ignore`}
          method="post"
        >
          <button
            type="submit"
            className="w-full rounded-md border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-black uppercase tracking-wider text-white/60 transition hover:bg-white/[0.08] hover:text-white sm:w-auto"
          >
            Ignore
          </button>
        </form>
      )}
  </div>

  {story.status ===
    "shortlisted" && (
    <p className="mt-4 text-sm font-bold text-emerald-300">
      This story is shortlisted and ready to generate when you want it.
    </p>
  )}

  {story.status ===
    "drafted" && (
    <p className="mt-4 text-sm font-bold text-red-300">
      A draft has already been generated from this Radar story.
    </p>
  )}
</section>
    </main>
  );
}