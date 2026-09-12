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

type CreateReviewBody = {
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
      (await request.json()) as CreateReviewBody;

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

    const status =
      body.status ===
      "published"
        ? "published"
        : "draft";

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

    const now =
      new Date()
        .toISOString();

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
     * Make duplicate-slug errors
     * friendlier before insert.
     */
    const {
      data: existing,
      error: slugError,
    } = await supabase
      .from("reviews")
      .select("id")
      .eq(
        "slug",
        slug,
      )
      .maybeSingle();

    if (slugError) {
      throw slugError;
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error:
            "A review already uses this slug.",
        },
        {
          status: 409,
        },
      );
    }

    /*
     * If a movie was selected, make
     * sure it really exists.
     */
    const movieId =
      cleanString(
        body.movieId,
      );

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

    const {
      data: review,
      error: insertError,
    } = await supabase
      .from("reviews")
      .insert({
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

       if (insertError) {
      throw insertError;
    }

    if (
      personIds.length >
      0
    ) {
      const {
        error:
          peopleInsertError,
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
                review.id,
              person_id:
                personId,
            }),
          ),
        );

      if (
        peopleInsertError
      ) {
        /*
         * Keep creation atomic-ish:
         * if relationships fail,
         * remove the review we
         * just created.
         *
         * review_people also has
         * ON DELETE CASCADE.
         */
        const {
          error:
            rollbackError,
        } = await supabase
          .from(
            "reviews",
          )
          .delete()
          .eq(
            "id",
            review.id,
          );

        if (
          rollbackError
        ) {
          console.error(
            "[TMT REVIEWS] Rollback failed:",
            rollbackError.message,
          );
        }

        throw peopleInsertError;
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
        : "Could not create review.";

    console.error(
      "[TMT REVIEWS] Create failed:",
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
