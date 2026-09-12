import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

export async function GET() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("news")
      .select(
        "id, title, slug, status",
      )
      .limit(5);

  if (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error.message,
      },
      {
        status: 500,
      },
    );
  }

  return NextResponse.json({
    ok: true,
    rows: data,
  });
}