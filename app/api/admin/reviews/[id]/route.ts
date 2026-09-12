import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type ReviewSection = {
  eyebrow?: string;
  headline?: string;
  body?: string;
  imageUrl?: string;
  youtubeUrl?: string;
};

type UpdateReviewBody = {
  movieId?: string | null;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  heroImageUrl?: string | null;
  intro?: string | null;
  sections?: ReviewSection[];
  verdict?: string | null;
  rating?: number | null;
  seoTitle?: string | null;
   seoDescription?: string | null;

  personIds?: string[];

  status?: "draft" | "published";
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
      (await request.json()) as UpdateReviewBody;

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
            "Review title is required.",
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
            "Review slug is required.",
        },
        {
          status: 400,
        },
      );
    }

    const rating =
      typeof body.rating ===
      "number"
        ? body.rating
        : null;

    if (
      rating !== null &&
      (
        !Number.isFinite(
          rating,
        ) ||
        rating < 0 ||
        rating > 10
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Rating must be between 0 and 10.",
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

    const movieId =
      cleanString(
        body.movieId,
      );

    const supabase =
      createAdminClient();

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

    if (
      personIds.length >
      0
    ) {
      const {
        data: people,
        error: peopleError,
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

      if (peopleError) {
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
     * Make sure this review exists.
     */

    /*
     * Make sure this review exists.
     */
    const {
      data: existingReview,
      error: existingError,
    } = await supabase
      .from("reviews")
      .select(`
        id,
        published_at
      `)
      .eq(
        "id",
        id,
      )
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (!existingReview) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Review not found.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Prevent duplicate slugs.
     */
    const {
      data: slugMatch,
      error: slugError,
    } = await supabase
      .from("reviews")
      .select("id")
      .eq(
        "slug",
        slug,
      )
      .neq(
        "id",
        id,
      )
      .maybeSingle();

    if (slugError) {
      throw slugError;
    }

    if (slugMatch) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Another review already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * Validate linked movie.
     */
    if (movieId) {
      const {
        data: movie,
        error: movieError,
      } = await supabase
        .from("movies")
        .select("id")
        .eq(
          "id",
          movieId,
        )
        .maybeSingle();

      if (movieError) {
        throw movieError;
      }

      if (!movie) {
        return NextResponse.json(
          {
            success: false,
            error:
              "The selected movie could not be found.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * Keep original publish date
     * once the review has been published.
     */
    const publishedAt =
      status ===
      "published"
        ? existingReview
            .published_at ??
          new Date()
            .toISOString()
        : null;

    const {
      data: review,
      error: updateError,
    } = await supabase
      .from("reviews")
      .update({
        movie_id:
          movieId,
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
        verdict:
          cleanString(
            body.verdict,
          ),
        rating,
        seo_title:
          cleanString(
            body.seoTitle,
          ),
        seo_description:
          cleanString(
            body.seoDescription,
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

       if (updateError) {
      throw updateError;
    }

    /*
     * Replace the People attached
     * to this review with the
     * current editor selection.
     */

    const {
      error:
        deletePeopleError,
    } = await supabase
      .from(
        "review_people",
      )
      .delete()
      .eq(
        "review_id",
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
          "review_people",
        )
        .insert(
          personIds.map(
            (
              personId,
            ) => ({
              review_id:
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
      review,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update review.";

    console.error(
      "[TMT REVIEWS] Update failed:",
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
