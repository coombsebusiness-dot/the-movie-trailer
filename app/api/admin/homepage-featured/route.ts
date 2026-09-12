import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

const allowedTypes = [
  "news",
  "movie",
  "trailer",
] as const;

type AllowedType =
  (typeof allowedTypes)[number];

function isAllowedType(
  value: unknown,
): value is AllowedType {
  return (
    typeof value ===
      "string" &&
    allowedTypes.includes(
      value as AllowedType,
    )
  );
}

function cleanOptionalText(
  value: unknown,
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const trimmed =
    value.trim();

  return trimmed || null;
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const contentType =
      body.contentType;

    const contentId =
      typeof body.contentId ===
      "string"
        ? body.contentId.trim()
        : "";

    if (
      !isAllowedType(
        contentType,
      ) ||
      !contentId
    ) {
      return NextResponse.json(
        {
          error:
            "A valid content type and content item are required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    const table =
      contentType === "movie"
        ? "movies"
        : contentType ===
            "trailer"
          ? "trailers"
          : "news";

    /*
     * Make sure the selected
     * content really exists
     * and is published.
     */
    const {
      data: content,
      error:
        contentError,
    } = await supabase
      .from(table)
      .select("id")
      .eq(
        "id",
        contentId,
      )
      .eq(
        "status",
        "published",
      )
      .maybeSingle();

    if (
      contentError ||
      !content
    ) {
      console.error(
        "Featured content validation failed:",
        contentError,
      );

      return NextResponse.json(
        {
          error:
            "The selected content could not be found or is not published.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Insert a new featured
     * record.
     *
     * The Supabase trigger we
     * created automatically
     * deactivates the previous
     * featured record.
     */
    const {
      data,
      error,
    } = await supabase
      .from(
        "homepage_featured",
      )
      .insert({
        content_type:
          contentType,

        content_id:
          contentId,

        eyebrow:
          cleanOptionalText(
            body.eyebrow,
          ),

        headline:
          cleanOptionalText(
            body.headline,
          ),

        excerpt:
          cleanOptionalText(
            body.excerpt,
          ),

        image_url:
          cleanOptionalText(
            body.imageUrl,
          ),

        is_active:
          true,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Unable to save homepage featured item:",
        error,
      );

      return NextResponse.json(
        {
          error:
            "Unable to save homepage featured item.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      featured: data,
    });
  } catch (error) {
    console.error(
      "Homepage featured API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Something went wrong while updating the homepage.",
      },
      {
        status: 500,
      },
    );
  }
}