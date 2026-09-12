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

type UpdateFeatureBody = {
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

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
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

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const {
      id,
    } =
      await context.params;

    const body =
      (await request.json()) as UpdateFeatureBody;

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

    const supabase =
      createAdminClient();

    /*
     * Validate all selected
     * curated People.
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
     * Make sure the Feature
     * actually exists.
     */

    const {
      data:
        existingFeature,
      error:
        existingError,
    } = await supabase
      .from(
        "features",
      )
      .select(`
        id,
        published_at
      `)
      .eq(
        "id",
        id,
      )
      .maybeSingle();

    if (
      existingError
    ) {
      throw existingError;
    }

    if (
      !existingFeature
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Feature not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Prevent another Feature
     * from using this slug.
     */

    const {
      data:
        slugMatch,
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
      .neq(
        "id",
        id,
      )
      .maybeSingle();

    if (
      slugError
    ) {
      throw slugError;
    }

    if (
      slugMatch
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Another feature already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Keep the original
     * publication date once
     * the Feature is published.
     *
     * If moved back to draft,
     * published_at is cleared.
     */

    const publishedAt =
      status ===
      "published"
        ? existingFeature
            .published_at ??
          new Date()
            .toISOString()
        : null;

    /*
     * Update the Feature.
     */

    const {
      data: feature,
      error:
        updateError,
    } = await supabase
      .from(
        "features",
      )
      .update({
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
          publishedAt,
      })
      .eq(
        "id",
        id,
      )
      .select(`
        id,
        slug,
        status,
        published_at
      `)
      .single();

    if (
      updateError
    ) {
      throw updateError;
    }

    /*
     * Replace the People
     * relationships with the
     * current editor selection.
     */

    const {
      error:
        deletePeopleError,
    } = await supabase
      .from(
        "feature_people",
      )
      .delete()
      .eq(
        "feature_id",
        id,
      );

    if (
      deletePeopleError
    ) {
      throw deletePeopleError;
    }

    if (
      personIds.length >
      0
    ) {
      const {
        error:
          insertPeopleError,
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
                id,

              person_id:
                personId,
            }),
          ),
        );

      if (
        insertPeopleError
      ) {
        throw insertPeopleError;
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
        : "Could not update feature.";

    console.error(
      "[TMT FEATURES] Update failed:",
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