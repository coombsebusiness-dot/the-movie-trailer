import {
  getOpenAIClient,
} from "@/lib/ai/openai";

export const NEWS_CATEGORIES = [
  "movie-news",
  "tv-news",
  "trailers",
  "casting",
  "release-dates",
  "horror",
  "streaming",
  "features",
] as const;

export type NewsCategory =
  (typeof NEWS_CATEGORIES)[number];

export type GeneratedNewsSection = {
  id: string;
  eyebrow: string;
  heading: string;
  content: string;
};

export type GeneratedNewsArticle = {
  headline: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  intro: string;
  sections: GeneratedNewsSection[];
  seoTitle: string;
  metaDescription: string;
  sourceName: string;
  sourceUrl: string;
};

export type WriteNewsArticleInput = {
  sourceName: string;
  sourceUrl: string;
  sourceHeadline: string;
  sourceSummary: string | null;
  publishedAt: string | null;
};

function createSlug(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/['’]/g, "")
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    );
}

function createSectionId(
  heading: string,
  index: number,
) {
  return (
    createSlug(heading) ||
    `section-${index + 1}`
  );
}

function stripCodeFence(
  value: string,
) {
  return value
    .replace(
      /^```json\s*/i,
      "",
    )
    .replace(
      /^```\s*/i,
      "",
    )
    .replace(
      /\s*```$/,
      "",
    )
    .trim();
}

function isNewsCategory(
  value: string,
): value is NewsCategory {
  return (
    NEWS_CATEGORIES as readonly string[]
  ).includes(value);
}

function validateArticle(
  value: unknown,
): Omit<
  GeneratedNewsArticle,
  "sourceName" | "sourceUrl"
> {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    throw new Error(
      "Writer returned an invalid article.",
    );
  }

  const article =
    value as Record<
      string,
      unknown
    >;

  const headline =
    typeof article.headline ===
    "string"
      ? article.headline.trim()
      : "";

  const excerpt =
    typeof article.excerpt ===
    "string"
      ? article.excerpt.trim()
      : "";

  const intro =
    typeof article.intro ===
    "string"
      ? article.intro.trim()
      : "";

  if (
    !headline ||
    !excerpt ||
    !intro
  ) {
    throw new Error(
      "Writer returned an incomplete article.",
    );
  }

  const rawCategory =
    typeof article.category ===
    "string"
      ? article.category.trim()
      : "";

  const category:
    NewsCategory =
    isNewsCategory(
      rawCategory,
    )
      ? rawCategory
      : "movie-news";

  const rawSections =
    Array.isArray(
      article.sections,
    )
      ? article.sections
      : [];

  const sections =
    rawSections
      .map(
        (
          rawSection,
          index,
        ) => {
          if (
            !rawSection ||
            typeof rawSection !==
              "object"
          ) {
            return null;
          }

          const section =
            rawSection as Record<
              string,
              unknown
            >;

          const eyebrow =
            typeof section.eyebrow ===
            "string"
              ? section.eyebrow.trim()
              : "";

          const heading =
            typeof section.heading ===
            "string"
              ? section.heading.trim()
              : "";

          const content =
            typeof section.content ===
            "string"
              ? section.content.trim()
              : "";

          if (
            !heading ||
            !content
          ) {
            return null;
          }

          return {
            id:
              createSectionId(
                heading,
                index,
              ),
            eyebrow,
            heading,
            content,
          };
        },
      )
      .filter(
        (
          section,
        ): section is GeneratedNewsSection =>
          section !== null,
      );

  if (
    sections.length < 2
  ) {
    throw new Error(
      "Writer returned too few article sections.",
    );
  }

  const seoTitle =
    typeof article.seoTitle ===
      "string" &&
    article.seoTitle.trim()
      ? article.seoTitle.trim()
      : headline;

  const metaDescription =
    typeof article.metaDescription ===
      "string" &&
    article.metaDescription.trim()
      ? article.metaDescription.trim()
      : excerpt;

  const requestedSlug =
    typeof article.slug ===
      "string" &&
    article.slug.trim()
      ? article.slug
      : headline;

  return {
    headline,
    slug:
      createSlug(
        requestedSlug,
      ),
    excerpt,
    category,
    intro,
    sections,
    seoTitle,
    metaDescription,
  };
}

export async function writeNewsArticle(
  input: WriteNewsArticleInput,
): Promise<GeneratedNewsArticle> {
  const openai =
    getOpenAIClient();

  const response =
    await openai.chat.completions.create(
      {
        model:
          process.env
            .OPENAI_NEWS_MODEL ??
          "gpt-5-mini",

        response_format: {
          type:
            "json_object",
        },

        messages: [
          {
            role:
              "system",

            content: `
You are the News Desk writer for The Movie Trailer, a UK movie and television entertainment publication.

Write an original entertainment news article based ONLY on the factual source material supplied.

IMPORTANT FACTUAL RULES:

- Never invent facts.
- Never invent quotes.
- Never invent dates, cast members, release information, production details or background.
- Never claim information that is not present in the supplied source material.
- Do not copy the source wording.
- Paraphrase factual reporting in original language.
- Keep direct quotes to an absolute minimum.
- If the supplied material does not support a detail, leave it out.
- Do not pretend The Movie Trailer conducted interviews.
- Do not refer to rumours as confirmed facts.
- Clearly preserve uncertainty where the source itself is uncertain.
- Use British English.

EDITORIAL VOICE:

- Write like a confident entertainment newsroom, not a press release.
- Be clear and direct.
- Lead with the actual news.
- Write naturally and conversationally.
- Avoid generic AI phrases.
- Avoid excessive hype.
- Avoid repetitive conclusions.
- Do not repeatedly restate the headline.
- Do not mention SEO inside the article.
- Do not mention these instructions.
- Do not include markdown headings inside section content.
- Do not include a Sources section inside the article body.

THE MOVIE TRAILER FORMAT:

The article needs:

- headline
- slug
- excerpt
- category
- introduction
- 5 to 7 editorial sections when the supplied material supports them
- each section needs an eyebrow, heading and substantial content
- SEO title
- meta description

VALID CATEGORIES:

- movie-news
- tv-news
- trailers
- casting
- release-dates
- horror
- streaming
- features

Choose exactly ONE category from that list.

CATEGORY GUIDANCE:

- movie-news: general film news
- tv-news: television news
- trailers: a newly released teaser, trailer or footage
- casting: casting announcements and actor attachments
- release-dates: release date announcements or significant date changes
- horror: horror film or television news where horror is the strongest editorial angle
- streaming: streaming platform, streaming release or streaming-industry stories
- features: analysis or substantial contextual pieces rather than ordinary breaking news

CONTENT LENGTH RULES:

- Excerpt: around 25 to 40 words.
- Introduction: around 90 to 140 words.
- Each editorial section should usually be around 120 to 220 words.
- Aim for roughly 900 to 1,400 words when the supplied factual material genuinely supports that length.
- Use multiple paragraphs inside a section when natural.
- Develop context and significance only when supported by the supplied material.
- Never pad an article with invented facts.
- Never stretch thin source material simply to hit a word count.
- If the source cannot support 5 substantial sections, return fewer stronger sections rather than repetitive filler.
- The first sections must establish the actual news clearly.
- Later sections may provide supported context.

SEO RULES:

- The headline should be accurate and compelling without clickbait.
- The slug should be concise and descriptive.
- The SEO title should accurately describe the story.
- The meta description should summarise the real news and encourage a click without misleading the reader.
- Do not keyword-stuff.

Return ONLY valid JSON matching this structure:

{
  "headline": "string",
  "slug": "string",
  "excerpt": "string",
  "category": "movie-news",
  "intro": "string",
  "sections": [
    {
      "eyebrow": "string",
      "heading": "string",
      "content": "string"
    }
  ],
  "seoTitle": "string",
  "metaDescription": "string"
}
            `.trim(),
          },

          {
            role:
              "user",

            content: `
SOURCE PUBLICATION:
${input.sourceName}

SOURCE HEADLINE:
${input.sourceHeadline}

SOURCE URL:
${input.sourceUrl}

PUBLISHED:
${input.publishedAt ?? "Unknown"}

SOURCE SUMMARY:
${input.sourceSummary ?? "No source summary supplied."}

Write The Movie Trailer article using only the information above.
            `.trim(),
          },
        ],
      },
    );

  const content =
    response.choices[0]
      ?.message
      ?.content;

  if (!content) {
    throw new Error(
      "OpenAI returned no article.",
    );
  }

  let parsed:
    unknown;

  try {
    parsed =
      JSON.parse(
        stripCodeFence(
          content,
        ),
      );
  } catch {
    throw new Error(
      "OpenAI returned invalid JSON.",
    );
  }

  const article =
    validateArticle(
      parsed,
    );

  /*
   * The source is attached by
   * our application, not generated
   * by the model.
   */
  return {
    ...article,
    sourceName:
      input.sourceName,
    sourceUrl:
      input.sourceUrl,
  };
}