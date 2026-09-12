import Parser from "rss-parser";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  scoreNewsItem,
} from "@/lib/news/NewsRadarScorer";

type FeedSource = {
  id: string;
  name: string;
  feed_url: string;
  homepage_url: string | null;
  trust_weight: number;
  category: string;
};

type IngestResult = {
  sourcesChecked: number;
  itemsSeen: number;
  inserted: number;
  skipped: number;
  failedSources: number;
  errors: string[];
};

const parser =
  new Parser({
    timeout: 12000,
    headers: {
      "User-Agent":
        "TheMovieTrailerNewsRadar/1.0 (+https://the-movie-trailer.com)",
    },
  });

function cleanText(
  value?: string | null,
) {
  if (!value) {
    return null;
  }

  return value
    .replace(
      /<[^>]*>/g,
      " ",
    )
    .replace(
      /&nbsp;/g,
      " ",
    )
    .replace(
      /&amp;/g,
      "&",
    )
    .replace(
      /&quot;/g,
      '"',
    )
    .replace(
      /&#39;/g,
      "'",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}

function normaliseUrl(
  input?: string | null,
) {
  if (!input) {
    return null;
  }

  try {
    const url =
      new URL(input);

    const removeParams = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "utm_id",
      "fbclid",
      "gclid",
      "mc_cid",
      "mc_eid",
    ];

    for (
      const param
      of removeParams
    ) {
      url.searchParams.delete(
        param,
      );
    }

    url.hash = "";

    return url.toString();
  } catch {
    return input.trim();
  }
}

function getPublishedAt(
  item: Parser.Item,
) {
  const candidate =
    item.isoDate ??
    item.pubDate ??
    null;

  if (!candidate) {
    return null;
  }

  const parsed =
    new Date(candidate);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return null;
  }

  return parsed.toISOString();
}

function getImageUrl(
  item: Parser.Item,
) {
  const anyItem =
    item as Parser.Item & {
      enclosure?: {
        url?: string;
        type?: string;
      };

      "media:content"?: {
        $?: {
          url?: string;
        };
      };

      "media:thumbnail"?: {
        $?: {
          url?: string;
        };
      };
    };

  if (
    anyItem.enclosure?.url
  ) {
    return normaliseUrl(
      anyItem.enclosure.url,
    );
  }

  if (
    anyItem[
      "media:content"
    ]?.$?.url
  ) {
    return normaliseUrl(
      anyItem[
        "media:content"
      ]?.$?.url,
    );
  }

  if (
    anyItem[
      "media:thumbnail"
    ]?.$?.url
  ) {
    return normaliseUrl(
      anyItem[
        "media:thumbnail"
      ]?.$?.url,
    );
  }

  return null;
}

async function ingestSource(
  source: FeedSource,
) {
  const supabase =
    createAdminClient();

  const stats = {
    seen: 0,
    inserted: 0,
    skipped: 0,
  };

  const feed =
    await parser.parseURL(
      source.feed_url,
    );

  for (
    const item
    of feed.items
  ) {
    stats.seen += 1;

    const title =
      cleanText(
        item.title,
      );

    const url =
      normaliseUrl(
        item.link,
      );

    if (
      !title ||
      !url
    ) {
      stats.skipped += 1;
      continue;
    }

    const summary =
      cleanText(
        item.contentSnippet ??
          item.content ??
          item.summary ??
          null,
      );

    const publishedAt =
      getPublishedAt(
        item,
      );

    const score =
      scoreNewsItem({
        title,
        summary,
        publishedAt,
        trustWeight:
          source.trust_weight,
      });

    /*
     * Check before insert so normal duplicate
     * ingestion stays quiet and predictable.
     *
     * The UNIQUE constraint on url is still
     * the final protection against races.
     */
    const {
      data:
        existingItem,
      error:
        existingError,
    } =
      await supabase
        .from(
          "news_items",
        )
        .select(
          "id",
        )
        .eq(
          "url",
          url,
        )
        .maybeSingle();

    if (
      existingError
    ) {
      throw existingError;
    }

    if (
      existingItem
    ) {
      stats.skipped += 1;
      continue;
    }

    const {
      error:
        insertError,
    } =
      await supabase
        .from(
          "news_items",
        )
        .insert({
          source_id:
            source.id,

          title,

          url,

          guid:
            item.guid ??
            null,

          summary,

          author:
            cleanText(
              item.creator ??
                null,
            ),

          image_url:
            getImageUrl(
              item,
            ),

          published_at:
            publishedAt,

          fetched_at:
            new Date()
              .toISOString(),

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

          status:
            "new",
        });

    if (
      insertError
    ) {
      if (
        insertError.code ===
        "23505"
      ) {
        stats.skipped += 1;
        continue;
      }

      throw insertError;
    }

    stats.inserted += 1;
  }

  const {
    error:
      updateError,
  } =
    await supabase
      .from(
        "news_sources",
      )
      .update({
        last_polled_at:
          new Date()
            .toISOString(),

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        source.id,
      );

  if (
    updateError
  ) {
    throw updateError;
  }

  return stats;
}

export async function ingestNewsFeeds():
  Promise<IngestResult> {
  const supabase =
    createAdminClient();

  const result:
    IngestResult = {
      sourcesChecked: 0,
      itemsSeen: 0,
      inserted: 0,
      skipped: 0,
      failedSources: 0,
      errors: [],
    };

  const {
    data:
      sources,
    error:
      sourcesError,
  } =
    await supabase
      .from(
        "news_sources",
      )
      .select(
        `
          id,
          name,
          feed_url,
          homepage_url,
          trust_weight,
          category
        `,
      )
      .eq(
        "enabled",
        true,
      )
      .order(
        "trust_weight",
        {
          ascending:
            false,
        },
      );

  if (
    sourcesError
  ) {
    throw sourcesError;
  }

  const typedSources =
    (sources ??
      []) as FeedSource[];

  for (
    const source
    of typedSources
  ) {
    result.sourcesChecked +=
      1;

    try {
      const stats =
        await ingestSource(
          source,
        );

      result.itemsSeen +=
        stats.seen;

      result.inserted +=
        stats.inserted;

      result.skipped +=
        stats.skipped;
   } catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" &&
          error !== null &&
          "message" in error
        ? String(
            (
              error as {
                message?: unknown;
              }
            ).message,
          )
        : JSON.stringify(
            error,
          );

      result.errors.push(
        `${source.name}: ${message}`,
      );

      console.error(
        "[TMT NEWS RADAR] Feed failed:",
        source.name,
        message,
      );
    }
  }

  console.log(
    "[TMT NEWS RADAR] Ingestion complete",
    {
      sourcesChecked:
        result.sourcesChecked,

      itemsSeen:
        result.itemsSeen,

      inserted:
        result.inserted,

      skipped:
        result.skipped,

      failedSources:
        result.failedSources,
    },
  );

  return result;
}