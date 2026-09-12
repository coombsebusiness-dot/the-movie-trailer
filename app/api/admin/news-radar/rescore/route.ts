import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  scoreNewsItem,
} from "@/lib/news/NewsRadarScorer";

type RadarItem = {
  id: string;
  title: string;
  summary: string | null;
  published_at: string | null;
  source_id: string;
  news_sources:
    | {
        trust_weight: number;
      }
    | {
        trust_weight: number;
      }[]
    | null;
};

function getTrustWeight(
  source: RadarItem["news_sources"],
) {
  if (!source) {
    return 80;
  }

  const resolved =
    Array.isArray(source)
      ? source[0]
      : source;

  return (
    resolved?.trust_weight ??
    80
  );
}

export async function POST() {
  const supabase =
    createAdminClient();

  try {
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
            summary,
            published_at,
            source_id,
            news_sources (
              trust_weight
            )
          `,
        )
        .limit(
          1000,
        );

    if (error) {
      throw error;
    }

    const items =
      (data ??
        []) as RadarItem[];

    let rescored = 0;
    let failed = 0;

    const errors: string[] = [];

    for (
      const item of items
    ) {
      try {
        const score =
          scoreNewsItem({
            title:
              item.title,

            summary:
              item.summary,

            publishedAt:
              item.published_at,

            trustWeight:
              getTrustWeight(
                item.news_sources,
              ),
          });

        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              "news_items",
            )
            .update({
              relevance_score:
                score.relevanceScore,

              freshness_score:
                score.freshnessScore,

              trust_score:
                score.trustScore,

              final_score:
                score.finalScore,

              matched_terms:
                score.matchedTerms,

              score_reasons:
                score.reasons,
            })
            .eq(
              "id",
              item.id,
            );

        if (
          updateError
        ) {
          throw updateError;
        }

        rescored += 1;
      } catch (
        error
      ) {
        failed += 1;

        const message =
          error instanceof Error
            ? error.message
            : typeof error ===
                  "object" &&
                error !== null &&
                "message" in
                  error
              ? String(
                  (
                    error as {
                      message?: unknown;
                    }
                  ).message,
                )
              : String(
                  error,
                );

        errors.push(
          `${item.id}: ${message}`,
        );

        console.error(
          "[TMT NEWS RADAR] Rescore item failed:",
          item.id,
          message,
        );
      }
    }

    console.log(
      "[TMT NEWS RADAR] Rescore complete",
      {
        total:
          items.length,
        rescored,
        failed,
      },
    );

    return NextResponse.json({
      success: true,
      total:
        items.length,
      rescored,
      failed,
      errors,
    });
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error ===
              "object" &&
            error !== null &&
            "message" in
              error
          ? String(
              (
                error as {
                  message?: unknown;
                }
              ).message,
            )
          : String(
              error,
            );

    console.error(
      "[TMT NEWS RADAR] Rescore failed:",
      message,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          message,
      },
      {
        status: 500,
      },
    );
  }
}