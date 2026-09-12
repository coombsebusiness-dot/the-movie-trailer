import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type MoviePayload = {
  title?: string;
  slug?: string;
  year?: number;
  genre?: string | null;
  release_date?: string | null;
  runtime?: string | null;
  certification?: string | null;
  director?: string | null;
  studio?: string | null;
  distributor?: string | null;
  tagline?: string | null;
  synopsis?: string | null;
  intro?: string | null;
  cast_members?: string[];
  poster_url?: string | null;
  backdrop_url?: string | null;
  sidebar_quote?: string | null;
  seo_title?: string | null;
  meta_description?: string | null;
  sections?: unknown[];
  personIds?: string[];
  is_featured?: boolean;
  status?:
    | "draft"
    | "published";
};

function validatePayload(
  body: MoviePayload,
) {
  if (
    !body.title?.trim()
  ) {
    return "Movie title is required.";
  }

  if (
    !body.slug?.trim()
  ) {
    return "Movie slug is required.";
  }

  if (
    !Number.isInteger(
      body.year,
    ) ||
    (body.year ?? 0) <
      1880 ||
    (body.year ?? 0) >
      2100
  ) {
    return "A valid movie year is required.";
  }

  if (
    body.status !==
      "draft" &&
    body.status !==
      "published"
  ) {
    return "Invalid movie status.";
  }

  return null;
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
      (await request.json()) as MoviePayload;

    const validationError =
      validatePayload(
        body,
      );

    if (
      validationError
    ) {
      return NextResponse.json(
        {
          error:
            validationError,
        },
        {
          status:
            400,
        },
      );
    }

    const supabase =
      createAdminClient();

    /*
     * Normalise selected
     * curated people.
     */
    const personIds = [
      ...new Set(
        (
          body.personIds ??
          []
        )
          .map(
            (
              personId,
            ) =>
              personId.trim(),
          )
          .filter(
            Boolean,
          ),
      ),
    ];

    /*
     * Validate selected people
     * before touching the movie.
     */
    if (
      personIds.length >
      0
    ) {
      const {
        data:
          validPeople,
        error:
          peopleError,
      } =
        await supabase
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
        return NextResponse.json(
          {
            error:
              peopleError.message,
          },
          {
            status:
              500,
          },
        );
      }

      if (
        (
          validPeople ??
          []
        ).length !==
        personIds.length
      ) {
        return NextResponse.json(
          {
            error:
              "One or more selected people are invalid.",
          },
          {
            status:
              400,
          },
        );
      }
    }

    /*
     * Load the existing movie so
     * we can preserve published_at
     * when appropriate.
     */
    const {
      data:
        existingMovie,
      error:
        lookupError,
    } =
      await supabase
        .from(
          "movies",
        )
        .select(
          "id, status, published_at, is_featured",
        )
        .eq(
          "id",
          id,
        )
        .maybeSingle();

    if (
      lookupError
    ) {
      return NextResponse.json(
        {
          error:
            lookupError.message,
        },
        {
          status:
            500,
        },
      );
    }

    if (
      !existingMovie
    ) {
      return NextResponse.json(
        {
          error:
            "Movie not found.",
        },
        {
          status:
            404,
        },
      );
    }

    const status =
      body.status!;

    /*
     * A movie can only be featured
     * while it is published.
     */
    const shouldFeature =
      status ===
        "published" &&
      Boolean(
        body.is_featured,
      );

    /*
     * If this movie is becoming the
     * featured movie, remove that flag
     * from every other movie first.
     */
    if (
      shouldFeature
    ) {
      const {
        error:
          clearFeaturedError,
      } =
        await supabase
          .from(
            "movies",
          )
          .update({
            is_featured:
              false,
          })
          .eq(
            "is_featured",
            true,
          )
          .neq(
            "id",
            id,
          );

      if (
        clearFeaturedError
      ) {
        return NextResponse.json(
          {
            error:
              clearFeaturedError.message,
          },
          {
            status:
              500,
          },
        );
      }
    }

    let publishedAt:
      string | null =
      existingMovie
        .published_at;

    if (
      status ===
      "draft"
    ) {
      publishedAt =
        null;
    } else if (
      !publishedAt
    ) {
      publishedAt =
        new Date()
          .toISOString();
    }

    /*
     * Update the movie itself.
     */
    const {
      data,
      error,
    } =
      await supabase
        .from(
          "movies",
        )
        .update({
          title:
            body.title!.trim(),

          slug:
            body.slug!.trim(),

          year:
            body.year!,

          genre:
            body.genre ??
            null,

          release_date:
            body.release_date ??
            null,

          runtime:
            body.runtime ??
            null,

          certification:
            body.certification ??
            null,

          director:
            body.director ??
            null,

          studio:
            body.studio ??
            null,

          distributor:
            body.distributor ??
            null,

          tagline:
            body.tagline ??
            null,

          synopsis:
            body.synopsis ??
            null,

          intro:
            body.intro ??
            null,

          cast_members:
            body.cast_members ??
            [],

          poster_url:
            body.poster_url ??
            null,

          backdrop_url:
            body.backdrop_url ??
            null,

          sidebar_quote:
            body.sidebar_quote ??
            null,

          seo_title:
            body.seo_title ??
            null,

          meta_description:
            body.meta_description ??
            null,

          sections:
            body.sections ??
            [],

          is_featured:
            shouldFeature,

          status,

          published_at:
            publishedAt,
        })
        .eq(
          "id",
          id,
        )
        .select(
          "id, slug, status, published_at, is_featured",
        )
        .single();

    if (
      error
    ) {
      if (
        error.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "That movie slug is already in use.",
          },
          {
            status:
              409,
          },
        );
      }

      return NextResponse.json(
        {
          error:
            error.message,
        },
        {
          status:
            500,
        },
      );
    }

    /*
     * Replace the existing People
     * relationships with the current
     * editor selection.
     *
     * Deleting first also means an
     * empty selection correctly
     * removes everyone.
     */
    const {
      error:
        deletePeopleError,
    } =
      await supabase
        .from(
          "movie_people",
        )
        .delete()
        .eq(
          "movie_id",
          id,
        );

    if (
      deletePeopleError
    ) {
      return NextResponse.json(
        {
          error:
            deletePeopleError.message,
        },
        {
          status:
            500,
        },
      );
    }

    if (
      personIds.length >
      0
    ) {
      const {
        error:
          relationshipError,
      } =
        await supabase
          .from(
            "movie_people",
          )
          .insert(
            personIds.map(
              (
                personId,
              ) => ({
                movie_id:
                  id,
                person_id:
                  personId,
              }),
            ),
          );

      if (
        relationshipError
      ) {
        return NextResponse.json(
          {
            error:
              relationshipError.message,
          },
          {
            status:
              500,
          },
        );
      }
    }

    return NextResponse.json({
      movie:
        data,
    });
  } catch (
    error
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Movie could not be updated.",
      },
      {
        status:
          500,
      },
    );
  }
}