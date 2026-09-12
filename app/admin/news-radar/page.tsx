import Link from "next/link";
import NewsRadarRefreshButton from "@/components/admin/NewsRadarRefreshButton";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type NewsItem = {
  id: string;
  title: string;
  url: string;
  summary: string | null;
  published_at: string | null;
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
        name: string;
      }
    | {
        name: string;
      }[]
    | null;
};

function getSourceName(
  source: NewsItem["news_sources"],
) {
  if (!source) {
    return "Unknown";
  }

  if (
    Array.isArray(
      source,
    )
  ) {
    return (
      source[0]?.name ??
      "Unknown"
    );
  }

  return (
    source.name ??
    "Unknown"
  );
}

function formatAge(
  publishedAt: string | null,
) {
  if (!publishedAt) {
    return "Unknown age";
  }

  const published =
    new Date(
      publishedAt,
    );

  const diffMs =
    Date.now() -
    published.getTime();

  const minutes =
    Math.floor(
      diffMs /
        (1000 * 60),
    );

  if (minutes < 60) {
    return `${Math.max(
      minutes,
      1,
    )}m ago`;
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days =
    Math.floor(
      hours / 24,
    );

  return `${days}d ago`;
}

function getPriorityLabel(
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

export default async function NewsRadarPage() {
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
          published_at,
          relevance_score,
          freshness_score,
          trust_score,
          final_score,
          matched_terms,
          score_reasons,
          status,
          news_sources (
            name
          )
        `,
      )
      .neq(
        "status",
        "ignored",
      )
      .order(
  "published_at",
  {
    ascending: false,
    nullsFirst: false,
  },
)
.order(
  "final_score",
  {
    ascending: false,
  },
)
      .limit(
        100,
      );

  if (error) {
    throw error;
  }

  const items =
    (data ??
      []) as NewsItem[];

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-10 lg:px-8">
      <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-xs font-black uppercase tracking-[0.28em] text-red-500">
            The Movie Trailer
          </p>

          <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
            News Radar
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
            Fresh movie and television stories from trusted entertainment sources,
            ranked by relevance, freshness and source trust.
          </p>
        </div>

       <div className="flex flex-col gap-3 lg:items-end">
  <div className="flex flex-wrap gap-3">
    <Link
      href="/admin/news/new"
      className="rounded-md border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/[0.08]"
    >
      New Article
    </Link>

    <NewsRadarRefreshButton />
  </div>
</div>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="text-2xl font-black text-white">
            {items.length}
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/35">
            Stories loaded
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="text-2xl font-black text-red-400">
            {
              items.filter(
                item =>
                  item.final_score >=
                  80,
              ).length
            }
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/35">
            Breaking
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="text-2xl font-black text-emerald-400">
            {
              items.filter(
                item =>
                  item.final_score >=
                    65 &&
                  item.final_score <
                    80,
              ).length
            }
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/35">
            Strong
          </div>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="text-2xl font-black text-white">
            {
              items.filter(
                item =>
                  item.status ===
                  "shortlisted",
              ).length
            }
          </div>

          <div className="mt-1 text-xs font-bold uppercase tracking-wider text-white/35">
            Shortlisted
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map(
          item => {
            const priority =
              getPriorityLabel(
                item.final_score,
              );

            const sourceName =
              getSourceName(
                item.news_sources,
              );

            return (
              <article
                key={
                  item.id
                }
                className="rounded-lg border border-white/10 bg-[#090b0d] p-5 transition hover:border-white/20"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${priority.className}`}
                      >
                        {
                          priority.label
                        }
                      </span>

                      <span className="text-xs font-bold text-white/55">
                        {
                          sourceName
                        }
                      </span>

                      <span className="text-xs text-white/25">
                        •
                      </span>

                      <span className="text-xs text-white/40">
                        {
                          formatAge(
                            item.published_at,
                          )
                        }
                      </span>

                      {item.status !==
                        "new" && (
                        <>
                          <span className="text-xs text-white/25">
                            •
                          </span>

                          <span className="text-xs font-bold uppercase tracking-wide text-red-300">
                            {
                              item.status
                            }
                          </span>
                        </>
                      )}
                    </div>

                    <h2 className="max-w-5xl text-lg font-black leading-snug text-white md:text-xl">
                      {
                        item.title
                      }
                    </h2>

                    {item.summary && (
                      <p className="mt-3 line-clamp-3 max-w-5xl text-sm leading-6 text-white/45">
                        {
                          item.summary
                        }
                      </p>
                    )}

                    {item.matched_terms?.length >
                      0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.matched_terms
                          .slice(
                            0,
                            8,
                          )
                          .map(
                            term => (
                              <span
                                key={
                                  term
                                }
                                className="rounded bg-white/[0.04] px-2 py-1 text-[11px] font-semibold text-white/40"
                              >
                                {
                                  term
                                }
                              </span>
                            ),
                          )}
                      </div>
                    )}
                  </div>

                  <div className="flex shrink-0 flex-col gap-3 lg:w-[240px]">
                    <div className="grid grid-cols-4 overflow-hidden rounded-md border border-white/10">
                      <div className="border-r border-white/10 p-2 text-center">
                        <div className="text-lg font-black text-red-400">
                          {
                            item.final_score
                          }
                        </div>
                        <div className="text-[9px] font-bold uppercase text-white/30">
                          Total
                        </div>
                      </div>

                      <div className="border-r border-white/10 p-2 text-center">
                        <div className="text-lg font-black text-white">
                          {
                            item.relevance_score
                          }
                        </div>
                        <div className="text-[9px] font-bold uppercase text-white/30">
                          Rel
                        </div>
                      </div>

                      <div className="border-r border-white/10 p-2 text-center">
                        <div className="text-lg font-black text-white">
                          {
                            item.freshness_score
                          }
                        </div>
                        <div className="text-[9px] font-bold uppercase text-white/30">
                          Fresh
                        </div>
                      </div>

                      <div className="p-2 text-center">
                        <div className="text-lg font-black text-white">
                          {
                            item.trust_score
                          }
                        </div>
                        <div className="text-[9px] font-bold uppercase text-white/30">
                          Trust
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/admin/news-radar/${item.id}`}
                        className="flex-1 rounded-md bg-red-600 px-3 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white transition hover:bg-red-500"
                      >
                        Review
                      </Link>

                      <a
                        href={
                          item.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border border-white/10 px-3 py-2.5 text-center text-xs font-black uppercase tracking-wider text-white/60 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        Source
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          },
        )}

        {items.length ===
          0 && (
          <div className="rounded-lg border border-dashed border-white/10 py-20 text-center">
            <p className="text-sm font-bold text-white/40">
              No stories in the radar yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}