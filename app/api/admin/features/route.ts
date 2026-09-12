import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type FeatureSection = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  imageUrl?: string;
  youtubeUrl?: string;
};

type FeatureSource = {
  name?: string;
  url?: string;
};

type CreateFeatureBody = {
  slug?: string;
  title?: string;
  excerpt?: string | null;
  heroImageUrl?: string | null;
  intro?: string | null;
  sections?: FeatureSection[];
  sources?: FeatureSource[];
  seoTitle?: string | null;
  metaDescription?: string | null;
  personIds?: string[];
  status?:
    | "draft"
    | "published";
};

function cleanString(
  value:
    | string
    | null
    | undefined,
) {
  const cleaned =
    value?.trim();

  return cleaned
    ? cleaned
    : null;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      (await request.json()) as CreateFeatureBody;

    const title =
      cleanString(
        body.title,
      );

    const slug =
      cleanString(
        body.slug,
      );

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Feature title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Feature slug is required.",
        },
        {
          status: 400,
        },
      );
    }

    const status =
      body.status ===
      "published"
        ? "published"
        : "draft";

    const sections =
      Array.isArray(
        body.sections,
      )
        ? body.sections.map(
            (
              section,
            ) => ({
              eyebrow:
                cleanString(
                  section.eyebrow,
                ) ?? "",

              headline:
                cleanString(
                  section.headline,
                ) ?? "",

              body:
                cleanString(
                  section.body,
                ) ?? "",

              imageUrl:
                cleanString(
                  section.imageUrl,
                ) ?? "",

              youtubeUrl:
                cleanString(
                  section.youtubeUrl,
                ) ?? "",
            }),
          )
        : [];

    /*
     * Clean Feature sources.
     *
     * Empty source rows are removed.
     * A source can still be saved if
     * it has only a name or only a URL.
     */

    const sources =
      Array.isArray(
        body.sources,
      )
        ? body.sources
            .map(
              (
                source,
              ) => ({
                name:
                  cleanString(
                    source.name,
                  ) ?? "",

                url:
                  cleanString(
                    source.url,
                  ) ?? "",
              }),
            )
            .filter(
              (
                source,
              ) =>
                source.name
                  .length >
                  0 ||
                source.url
                  .length >
                  0,
            )
        : [];

    const personIds =
      Array.isArray(
        body.personIds,
      )
        ? [
            ...new Set(
              body.personIds.filter(
                (
                  personId,
                ): personId is string =>
                  typeof personId ===
                    "string" &&
                  personId.trim()
                    .length > 0,
              ),
            ),
          ]
        : [];

    const now =
      new Date()
        .toISOString();

    const supabase =
      createAdminClient();

    /*
     * Validate every selected
     * curated person before
     * creating the Feature.
     */

    if (
      personIds.length >
      0
    ) {
      const {
        data: people,
        error:
          peopleError,
      } = await supabase
        .from(
          "featured_people",
        )
        .select(
          "id",
        )
        .in(
          "id",
          personIds,
        );

      if (
        peopleError
      ) {
        throw peopleError;
      }

      if (
        (
          people ?? []
        ).length !==
        personIds.length
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "One or more selected people could not be found.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * Check the slug first so
     * duplicate errors are
     * friendly in the editor.
     */

    const {
      data: existing,
      error:
        slugError,
    } = await supabase
      .from(
        "features",
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
      slugError
    ) {
      throw slugError;
    }

    if (
      existing
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A feature already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Create the Feature.
     */

    const {
      data: feature,
      error:
        insertError,
    } = await supabase
      .from(
        "features",
      )
      .insert({
        slug,

        title,

        excerpt:
          cleanString(
            body.excerpt,
          ),

        hero_image_url:
          cleanString(
            body.heroImageUrl,
          ),

        intro:
          cleanString(
            body.intro,
          ),

        sections,

        sources,

        seo_title:
          cleanString(
            body.seoTitle,
          ),

        meta_description:
          cleanString(
            body.metaDescription,
          ),

        status,

        published_at:
          status ===
          "published"
            ? now
            : null,

        created_at:
          now,

        updated_at:
          now,
      })
      .select(`
        id,
        slug,
        status,
        published_at
      `)
      .single();

    if (
      insertError
    ) {
      throw insertError;
    }

    /*
     * Attach curated People.
     */

    if (
      personIds.length >
      0
    ) {
      const {
        error:
          peopleInsertError,
      } = await supabase
        .from(
          "feature_people",
        )
        .insert(
          personIds.map(
            (
              personId,
            ) => ({
              feature_id:
                feature.id,

              person_id:
                personId,
            }),
          ),
        );

      if (
        peopleInsertError
      ) {
        /*
         * Keep creation atomic-ish.
         *
         * If People relationships
         * fail, remove the Feature
         * we just created.
         *
         * feature_people uses
         * ON DELETE CASCADE.
         */

        const {
          error:
            rollbackError,
        } = await supabase
          .from(
            "features",
          )
          .delete()
          .eq(
            "id",
            feature.id,
          );

        if (
          rollbackError
        ) {
          console.error(
            "[TMT FEATURES] Rollback failed:",
            rollbackError.message,
          );
        }

        throw peopleInsertError;
      }
    }

    return NextResponse.json({
      success: true,
      feature,
    });
  } catch (
    error
  ) {
    const message =
      error instanceof
        Error
        ? error.message
        : "Could not create feature.";

    console.error(
      "[TMT FEATURES] Create failed:",
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