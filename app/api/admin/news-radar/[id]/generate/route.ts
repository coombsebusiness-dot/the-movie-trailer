import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  writeNewsArticle,
} from "@/lib/news/NewsArticleWriter";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: NextRequest,
  {
    params,
  }: RouteContext,
) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  try {
    const {
      data:
        radarItem,
      error:
        radarError,
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
            status,
            news_sources (
              name
            )
          `,
        )
        .eq(
          "id",
          id,
        )
        .maybeSingle();

    if (
      radarError
    ) {
      throw radarError;
    }

    if (
      !radarItem
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "News Radar story not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      radarItem.status ===
        "drafted" ||
      radarItem.status ===
        "published"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This News Radar story has already been drafted.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      !radarItem.summary
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Radar item does not contain enough source material to generate an article.",
        },
        {
          status: 400,
        },
      );
    }

    const rawSource =
      radarItem.news_sources;

    const source =
      Array.isArray(
        rawSource,
      )
        ? rawSource[0]
        : rawSource;

    const sourceName =
      source?.name ??
      "Original Source";

    const generated =
      await writeNewsArticle({
        sourceName,
        sourceUrl:
          radarItem.url,
        sourceHeadline:
          radarItem.title,
        sourceSummary:
          radarItem.summary,
        publishedAt:
          radarItem.published_at,
      });

      /*
 * Match curated People against the
 * source material and generated draft.
 *
 * Only exact full-name matches are used.
 * The editor remains the final review
 * point before publication.
 */
const curatedPeople =
  await getCuratedPeople();

const peopleMatchText = [
  radarItem.title,
  radarItem.summary,
  generated.headline,
  generated.excerpt,
  generated.intro,
  ...generated.sections.flatMap(
    (section) => [
      section.eyebrow,
      section.heading,
      section.content,
    ],
  ),
]
  .filter(Boolean)
  .join(" ")
  .toLowerCase();

const matchedPeople =
  curatedPeople.filter(
    (person) => {
      const escapedName =
        person.name.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

      const namePattern =
        new RegExp(
          `(^|[^\\p{L}\\p{N}])${escapedName}([^\\p{L}\\p{N}]|$)`,
          "iu",
        );

      return namePattern.test(
        peopleMatchText,
      );
    },
  );

    /*
     * Avoid colliding with an existing
     * news slug.
     */
    let slug =
      generated.slug;

    const {
      data:
        existingSlug,
      error:
        slugCheckError,
    } =
      await supabase
        .from(
          "news",
        )
        .select(
          "id",
        )
        .eq(
          "slug",
          slug,
        )
        .maybeSingle();

    if (
      slugCheckError
    ) {
      throw slugCheckError;
    }

    if (
      existingSlug
    ) {
      slug =
        `${slug}-${Date.now()}`;
    }

    const now =
      new Date()
        .toISOString();

    /*
     * TMT's NewsEditor stores intro and
     * sections inside the body JSON object.
     *
     * The generated writer uses:
     * heading/content
     *
     * The editor uses:
     * headline/body
     *
     * Convert them here.
     */
    const body = {
      intro:
        generated.intro,

      sections:
        generated.sections.map(
          section => ({
            eyebrow:
              section.eyebrow,

            headline:
              section.heading,

            body:
              section.content,
          }),
        ),
    };

    const {
      data:
        article,
      error:
        insertError,
    } =
      await supabase
        .from(
          "news",
        )
        .insert({
          slug,

          title:
            generated.headline,

          excerpt:
            generated.excerpt,

          category:
            generated.category,

          body,

          hero_image_url:
            null,

          seo_title:
            generated.seoTitle,

          seo_description:
            generated.metaDescription,

          source_name:
            sourceName,

          source_url:
            radarItem.url,

          status:
            "draft",

          published_at:
            null,

          created_at:
            now,

          updated_at:
            now,
        })
        .select(
          "id, slug",
        )
        .single();

    if (
      insertError
    ) {
      throw insertError;
    }

    if (
      !article
    ) {
      throw new Error(
        "News draft was not returned after insert.",
      );
    }

    if (
  matchedPeople.length >
  0
) {
  const {
    error:
      peopleInsertError,
  } = await supabase
    .from(
      "news_people",
    )
    .insert(
      matchedPeople.map(
        (person) => ({
          news_id:
            article.id,
          person_id:
            person.id,
        }),
      ),
    );

  if (
    peopleInsertError
  ) {
    console.error(
      "[TMT NEWS RADAR] Could not attach matched people:",
      peopleInsertError,
    );
  }
}

    const {
      error:
        radarUpdateError,
    } =
      await supabase
        .from(
          "news_items",
        )
        .update({
          status:
            "drafted",

          updated_at:
            now,
        })
        .eq(
          "id",
          id,
        );

    if (
      radarUpdateError
    ) {
      throw radarUpdateError;
    }

    return NextResponse.redirect(
      new URL(
        `/admin/news/${article.id}/edit`,
        request.url,
      ),
      303,
    );
  } catch (
    error
  ) {
    const message =
      error instanceof Error
        ? error.message
        : String(
            error,
          );

    console.error(
      "[TMT NEWS RADAR] Article generation failed:",
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