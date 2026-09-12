import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

export async function GET(
  request: NextRequest,
) {
  try {
    const query =
      request.nextUrl.searchParams
        .get("q")
        ?.trim();

    if (
      !query ||
      query.length < 2
    ) {
      return NextResponse.json({
        success: true,
        actors: [],
      });
    }

    const supabase =
      createPleaseRewindClient();

    const {
      data,
      error,
    } =
      await supabase
        .from("actors")
        .select(`
          id,
          slug,
          name,
          birth_date,
          birth_place,
          profile_image_url,
          status
        `)
        .eq(
          "status",
          "published",
        )
        .ilike(
          "name",
          `%${query}%`,
        )
        .order(
          "name",
          {
            ascending: true,
          },
        )
        .limit(20);

    if (error) {
      console.error(
        "People search failed:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      actors:
        data ?? [],
    });
  } catch (error) {
    console.error(
      "People search error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}