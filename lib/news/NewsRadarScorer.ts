export type NewsRadarScoreInput = {
  title: string;
  summary?: string | null;
  publishedAt?: string | Date | null;
  trustWeight?: number;
};

export type NewsRadarScoreResult = {
  relevanceScore: number;
  freshnessScore: number;
  trustScore: number;
  finalScore: number;
  matchedTerms: string[];
  reasons: string[];
};

type WeightedTerm = {
  term: string;
  weight: number;
};

/*
 * THE MOVIE TRAILER NEWS RADAR
 *
 * Unlike Please Rewind, TMT is not primarily
 * looking for nostalgic franchise matches.
 *
 * We want strong CURRENT entertainment-news
 * signals: trailers, casting, release dates,
 * production news, renewals, cancellations,
 * sequels and major movie/TV developments.
 */

const BREAKING_NEWS_TERMS: WeightedTerm[] = [
  { term: "breaking", weight: 28 },

  { term: "official trailer", weight: 30 },
  { term: "new trailer", weight: 28 },
  { term: "first trailer", weight: 28 },
  { term: "trailer", weight: 22 },
  { term: "teaser", weight: 20 },

  { term: "first look", weight: 24 },
  { term: "first footage", weight: 24 },
  { term: "new footage", weight: 22 },

  { term: "release date", weight: 26 },
  { term: "release dates", weight: 26 },
  { term: "delayed", weight: 20 },
  { term: "delay", weight: 18 },
  { term: "moves to", weight: 16 },

  { term: "cast", weight: 20 },
  { term: "casting", weight: 22 },
  { term: "joins cast", weight: 26 },
  { term: "joins", weight: 14 },
  { term: "stars in", weight: 18 },
  { term: "to star", weight: 18 },
  { term: "set to star", weight: 20 },

  { term: "director", weight: 16 },
  { term: "direct", weight: 14 },
  { term: "to direct", weight: 20 },

  { term: "sequel", weight: 24 },
  { term: "prequel", weight: 22 },
  { term: "reboot", weight: 22 },
  { term: "remake", weight: 20 },
  { term: "spin-off", weight: 18 },
  { term: "spinoff", weight: 18 },

  { term: "greenlit", weight: 24 },
  { term: "greenlight", weight: 24 },
  { term: "in development", weight: 20 },

  { term: "production begins", weight: 22 },
  { term: "production starts", weight: 22 },
  { term: "begins filming", weight: 22 },
  { term: "starts filming", weight: 22 },
  { term: "wraps filming", weight: 18 },

  { term: "renewed", weight: 24 },
  { term: "renewal", weight: 20 },
  { term: "cancelled", weight: 24 },
  { term: "canceled", weight: 24 },
  { term: "final season", weight: 20 },

  { term: "box office", weight: 22 },
  { term: "opening weekend", weight: 20 },
  { term: "record", weight: 14 },

  { term: "announces", weight: 16 },
  { term: "announced", weight: 16 },
  { term: "reveals", weight: 16 },
  { term: "revealed", weight: 16 },
  { term: "confirms", weight: 18 },
  { term: "confirmed", weight: 18 },

  { term: "returning", weight: 16 },
  { term: "returns", weight: 18 },
  { term: "return", weight: 14 },
];

const ENTERTAINMENT_TERMS: WeightedTerm[] = [
  { term: "movie", weight: 12 },
  { term: "film", weight: 12 },
  { term: "cinema", weight: 10 },

  { term: "tv", weight: 10 },
  { term: "television", weight: 10 },
  { term: "series", weight: 10 },
  { term: "season", weight: 10 },
  { term: "episode", weight: 8 },

  { term: "netflix", weight: 12 },
  { term: "hbo", weight: 12 },
  { term: "disney+", weight: 12 },
  { term: "disney plus", weight: 12 },
  { term: "prime video", weight: 12 },
  { term: "apple tv+", weight: 12 },
  { term: "apple tv", weight: 10 },
  { term: "paramount+", weight: 10 },
  { term: "peacock", weight: 10 },

  { term: "warner bros", weight: 10 },
  { term: "universal", weight: 10 },
  { term: "paramount", weight: 10 },
  { term: "sony pictures", weight: 10 },
  { term: "lionsgate", weight: 10 },
  { term: "a24", weight: 10 },

  { term: "marvel", weight: 14 },
  { term: "dc", weight: 12 },
  { term: "star wars", weight: 14 },
  { term: "pixar", weight: 12 },

  { term: "horror", weight: 12 },
];

const HIGH_INTEREST_STORY_TERMS: WeightedTerm[] = [
  { term: "dies", weight: 24 },
  { term: "died", weight: 24 },
  { term: "death", weight: 22 },
  { term: "dead", weight: 20 },

  { term: "tribute", weight: 18 },

  { term: "oscar", weight: 16 },
  { term: "oscars", weight: 16 },
  { term: "emmy", weight: 14 },
  { term: "emmys", weight: 14 },

  { term: "exclusive", weight: 12 },

  { term: "sues", weight: 12 },
  { term: "lawsuit", weight: 12 },
];

const AUDIENCE_INTEREST_TERMS: WeightedTerm[] = [
  /*
   * Major audience-facing franchises / brands.
   * These are useful indicators of broad search
   * and entertainment-news interest.
   */
  { term: "harry potter", weight: 22 },
  { term: "wizarding world", weight: 18 },
  { term: "marvel", weight: 18 },
  { term: "mcu", weight: 18 },
  { term: "avengers", weight: 20 },
  { term: "spider-man", weight: 20 },
  { term: "batman", weight: 20 },
  { term: "superman", weight: 20 },
  { term: "dc studios", weight: 18 },
  { term: "star wars", weight: 20 },
  { term: "jurassic", weight: 18 },
  { term: "avatar", weight: 18 },
  { term: "james bond", weight: 20 },
  { term: "007", weight: 18 },
  { term: "mission: impossible", weight: 18 },
  { term: "lord of the rings", weight: 20 },
  { term: "middle-earth", weight: 16 },
  { term: "stranger things", weight: 18 },
  { term: "wednesday", weight: 16 },

  /*
   * Horror is an important TMT vertical.
   */
  { term: "scream", weight: 18 },
  { term: "halloween", weight: 16 },
  { term: "conjuring", weight: 18 },
  { term: "resident evil", weight: 18 },
  { term: "final destination", weight: 18 },

  /*
   * Strong audience-facing story concepts.
   */
  { term: "first trailer", weight: 14 },
  { term: "official trailer", weight: 14 },
  { term: "release date", weight: 12 },
  { term: "joins cast", weight: 12 },
  { term: "sequel", weight: 10 },
  { term: "reboot", weight: 10 },
  { term: "remake", weight: 8 },
  { term: "renewed", weight: 10 },
  { term: "cancelled", weight: 10 },
  { term: "canceled", weight: 10 },
];

const NICHE_INDUSTRY_TERMS: WeightedTerm[] = [
  { term: "sales agent", weight: 20 },
  { term: "sales rights", weight: 18 },
  { term: "world sales", weight: 20 },
  { term: "international sales", weight: 20 },
  { term: "distribution rights", weight: 18 },
  { term: "acquires rights", weight: 16 },
  { term: "acquired rights", weight: 16 },
  { term: "boards", weight: 12 },
  { term: "boards project", weight: 18 },
  { term: "festival selection", weight: 18 },
  { term: "selected for", weight: 12 },
  { term: "venice title", weight: 20 },
  { term: "cannes title", weight: 20 },
  { term: "toronto title", weight: 18 },
  { term: "locarno", weight: 16 },
  { term: "market screening", weight: 20 },
  { term: "film market", weight: 18 },
];

const LOW_VALUE_TERMS: WeightedTerm[] = [
  { term: "fashion", weight: 25 },
  { term: "outfit", weight: 25 },
  { term: "red carpet look", weight: 30 },

  { term: "dating", weight: 22 },
  { term: "relationship", weight: 18 },
  { term: "romance", weight: 15 },

  { term: "instagram", weight: 15 },
  { term: "bikini", weight: 35 },
  { term: "beauty routine", weight: 35 },

  { term: "shopping", weight: 30 },
  { term: "gift guide", weight: 35 },
  { term: "buy now", weight: 30 },

  { term: "recipe", weight: 35 },
  { term: "horoscope", weight: 40 },

  { term: "real estate", weight: 25 },
  { term: "home tour", weight: 25 },
];

function clamp(
  value: number,
  min = 0,
  max = 100,
) {
  return Math.min(
    max,
    Math.max(
      min,
      value,
    ),
  );
}

function calculateFreshnessScore(
  publishedAt?: string | Date | null,
) {
  if (!publishedAt) {
    return 15;
  }

  const published =
    publishedAt instanceof Date
      ? publishedAt
      : new Date(publishedAt);

  if (
    Number.isNaN(
      published.getTime(),
    )
  ) {
    return 15;
  }

  const ageMs =
    Date.now() -
    published.getTime();

  /*
   * Occasionally feeds contain timestamps
   * slightly ahead of our server clock.
   * Treat those as brand-new rather than
   * accidentally penalising them.
   */
  const ageHours =
    Math.max(
      0,
      ageMs /
        (1000 * 60 * 60),
    );

  if (ageHours <= 0.5) {
    return 100;
  }

  if (ageHours <= 1) {
    return 98;
  }

  if (ageHours <= 2) {
    return 95;
  }

  if (ageHours <= 3) {
    return 92;
  }

  if (ageHours <= 6) {
    return 86;
  }

  if (ageHours <= 12) {
    return 74;
  }

  if (ageHours <= 18) {
    return 62;
  }

  if (ageHours <= 24) {
    return 50;
  }

  if (ageHours <= 36) {
    return 32;
  }

  if (ageHours <= 48) {
    return 20;
  }

  if (ageHours <= 72) {
    return 10;
  }

  return 3;
}

function applyWeightedTerms(
  haystack: string,
  terms: WeightedTerm[],
  matchedTerms: Set<string>,
  reasons: string[],
  reasonPrefix: string,
) {
  let score = 0;

  for (
    const {
      term,
      weight,
    } of terms
  ) {
    if (
      haystack.includes(term)
    ) {
      score += weight;

      matchedTerms.add(term);

      reasons.push(
        `${reasonPrefix}: ${term}`,
      );
    }
  }

  return score;
}

export function scoreNewsItem({
  title,
  summary,
  publishedAt,
  trustWeight = 80,
}: NewsRadarScoreInput): NewsRadarScoreResult {
  /*
   * The title is intentionally included twice.
   *
   * A strong signal in the headline is more
   * valuable than the same word appearing
   * somewhere in a long RSS description.
   */
  const cleanTitle =
    title.toLowerCase();

  const cleanSummary =
    (summary ?? "")
      .toLowerCase();

  const haystack =
    `${cleanTitle} ${cleanTitle} ${cleanSummary}`;

  let relevanceScore = 0;

  const matchedTerms =
    new Set<string>();

  const reasons: string[] = [];

  relevanceScore +=
    applyWeightedTerms(
      haystack,
      BREAKING_NEWS_TERMS,
      matchedTerms,
      reasons,
      "Strong news signal",
    );

  relevanceScore +=
    applyWeightedTerms(
      haystack,
      ENTERTAINMENT_TERMS,
      matchedTerms,
      reasons,
      "Entertainment relevance",
    );

  relevanceScore +=
    applyWeightedTerms(
      haystack,
      HIGH_INTEREST_STORY_TERMS,
      matchedTerms,
      reasons,
      "High-interest story signal",
    );

    relevanceScore +=
  applyWeightedTerms(
    haystack,
    AUDIENCE_INTEREST_TERMS,
    matchedTerms,
    reasons,
    "Audience-interest signal",
  );

for (
  const {
    term,
    weight,
  } of NICHE_INDUSTRY_TERMS
) {
  if (
    haystack.includes(term)
  ) {
    relevanceScore -=
      weight;

    reasons.push(
      `Niche industry signal: ${term}`,
    );
  }
}

  for (
    const {
      term,
      weight,
    } of LOW_VALUE_TERMS
  ) {
    if (
      haystack.includes(term)
    ) {
      relevanceScore -=
        weight;

      reasons.push(
        `Low-value entertainment signal: ${term}`,
      );
    }
  }

  /*
   * Give a useful baseline to stories which
   * clearly concern film/TV but happen not to
   * contain one of our breaking-news verbs.
   */
  const hasEntertainmentMatch =
    ENTERTAINMENT_TERMS.some(
      ({ term }) =>
        haystack.includes(term),
    );

  const hasStrongNewsMatch =
    BREAKING_NEWS_TERMS.some(
      ({ term }) =>
        haystack.includes(term),
    );

  if (
    hasEntertainmentMatch &&
    hasStrongNewsMatch
  ) {
    relevanceScore += 15;

    reasons.push(
      "Combines entertainment relevance with a strong news event",
    );
  }

  relevanceScore =
    clamp(
      relevanceScore,
    );

  const freshnessScore =
    calculateFreshnessScore(
      publishedAt,
    );

  const trustScore =
    clamp(
      trustWeight,
    );

  /*
   * TMT weighting:
   *
   * Relevance: 45%
   * Freshness: 40%
   * Trust:     15%
   *
   * Freshness matters slightly more here
   * than it does on Please Rewind because
   * The Movie Trailer is being built as a
   * current entertainment newsroom.
   */
  const finalScore =
    clamp(
      Math.round(
        relevanceScore *
          0.45 +
          freshnessScore *
            0.4 +
          trustScore *
            0.15,
      ),
    );

  if (
    freshnessScore >= 95
  ) {
    reasons.push(
      "Published within roughly two hours",
    );
  } else if (
    freshnessScore >= 86
  ) {
    reasons.push(
      "Published within roughly six hours",
    );
  }

  if (
    trustScore >= 95
  ) {
    reasons.push(
      "Top-tier entertainment source",
    );
  }

  return {
    relevanceScore,
    freshnessScore,
    trustScore,
    finalScore,
    matchedTerms:
      Array.from(
        matchedTerms,
      ),
    reasons,
  };
}