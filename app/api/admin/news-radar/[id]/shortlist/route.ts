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

export async function POST(
  _request: Request,
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

  const {
    error,
  } =
    await supabase
      .from(
        "news_items",
      )
      .update({
        status:
          "shortlisted",
        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        id,
      );

  if (error) {
    console.error(
      "[TMT NEWS RADAR] Shortlist failed:",
      error.message,
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

  return NextResponse.redirect(
    new URL(
      `/admin/news-radar/${id}`,
      _request.url,
    ),
    303,
  );
}