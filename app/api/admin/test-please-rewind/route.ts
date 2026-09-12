import {
  NextResponse,
} from "next/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

export async function GET() {
  try {
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
        .order(
          "name",
          {
            ascending:
              true,
          },
        )
        .limit(1)
        .maybeSingle();

    if (error) {
      console.error(
        "Please Rewind actor test failed:",
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
      actor: data,
    });
  } catch (error) {
    console.error(
      "Please Rewind connection failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof
          Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}