import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type TrailerStatus =
  | "draft"
  | "published";

type TrailerType =
  | "teaser"
  | "official-trailer"
  | "final-trailer"
  | "clip"
  | "featurette";

type UpdateTrailerBody = {
  title?: string;
  slug?: string;
  trailerType?: TrailerType;
  description?: string;
  youtubeUrl?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
  status?: TrailerStatus;
};

const trailerTypes =
  new Set<TrailerType>([
    "teaser",
    "official-trailer",
    "final-trailer",
    "clip",
    "featurette",
  ]);

const statuses =
  new Set<TrailerStatus>([
    "draft",
    "published",
  ]);

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  },
) {
  try {
    const {
      id,
    } =
      await context.params;

    const body =
      (await request.json()) as UpdateTrailerBody;

    const title =
      body.title?.trim() ??
      "";

    const slug =
      body.slug?.trim() ??
      "";

    const trailerType =
      body.trailerType ??
      "official-trailer";

    const description =
      body.description?.trim() ??
      "";

    const youtubeUrl =
      body.youtubeUrl?.trim() ??
      "";

    const youtubeVideoId =
      body.youtubeVideoId?.trim() ??
      "";

    const thumbnailUrl =
      body.thumbnailUrl?.trim() ??
      "";

    const status =
      body.status ??
      "draft";

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Trailer title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Trailer slug is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !trailerTypes.has(
        trailerType,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid trailer type.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !statuses.has(
        status,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid trailer status.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !youtubeUrl ||
      !youtubeVideoId
    ) {
      return NextResponse.json(
        {
          error:
            "A valid YouTube trailer is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    /*
     * Read the existing record first so
     * we can preserve its original
     * published_at timestamp when
     * editing an already-published
     * trailer.
     */
    const {
      data: existingTrailer,
      error:
        existingError,
    } =
      await supabase
        .from("trailers")
        .select(
          `
            id,
            status,
            published_at
          `,
        )
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
      !existingTrailer
    ) {
      return NextResponse.json(
        {
          error:
            "Trailer not found.",
        },
        {
          status: 404,
        },
      );
    }

    let publishedAt:
      string | null =
      null;

    if (
      status ===
      "published"
    ) {
      publishedAt =
        existingTrailer
          .published_at ??
        new Date().toISOString();
    }

    const {
      data: trailer,
      error:
        updateError,
    } =
      await supabase
        .from("trailers")
        .update({
          title,
          slug,
          trailer_type:
            trailerType,
          description:
            description ||
            null,
          youtube_url:
            youtubeUrl,
          youtube_video_id:
            youtubeVideoId,
          thumbnail_url:
            thumbnailUrl ||
            null,
          status,
          published_at:
            publishedAt,
        })
        .eq(
          "id",
          id,
        )
        .select(
          `
            id,
            slug,
            title,
            trailer_type,
            description,
            youtube_url,
            youtube_video_id,
            thumbnail_url,
            status,
            published_at,
            created_at,
            updated_at
          `,
        )
        .single();

    if (
      updateError
    ) {
      if (
        updateError.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "A trailer with that slug already exists.",
          },
          {
            status: 409,
          },
        );
      }

      throw updateError;
    }

    return NextResponse.json({
      trailer,
    });
  } catch (
    error
  ) {
    console.error(
      "Update trailer failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof
          Error
            ? error.message
            : "Failed to update trailer.",
      },
      {
        status: 500,
      },
    );
  }
}