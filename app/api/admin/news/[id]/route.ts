import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type UpdateNewsRequest = {
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  heroImageUrl: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  status:
    | "draft"
    | "published";
    personIds?: string[];

  body: {
    intro: string;

    sections: {
      eyebrow: string;
      headline: string;
      body: string;
    }[];
  };
};

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const {
    id,
  } =
    await context.params;

  const payload =
    (await request.json()) as
      UpdateNewsRequest;

  if (
    !payload.title?.trim() ||
    !payload.slug?.trim()
  ) {
    return NextResponse.json(
      {
        error:
          "Title and slug are required.",
      },
      {
        status: 400,
      },
    );
  }

  const supabase =
    createAdminClient();

  const {
    data: existingStory,
    error: existingError,
  } =
    await supabase
      .from("news")
      .select(
        "status, published_at",
      )
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (
    existingError ||
    !existingStory
  ) {
    return NextResponse.json(
      {
        error:
          existingError?.message ??
          "Story not found.",
      },
      {
        status: 404,
      },
    );
  }

  const publishedAt =
    payload.status ===
    "published"
      ? existingStory.published_at ??
        new Date().toISOString()
      : null;

  const {
    data,
    error,
  } =
    await supabase
      .from("news")
      .update({
        title:
          payload.title.trim(),

        slug:
          payload.slug.trim(),

        excerpt:
          payload.excerpt,

        category:
          payload.category,

        hero_image_url:
          payload.heroImageUrl,

        source_name:
          payload.sourceName,

        source_url:
          payload.sourceUrl,

        seo_title:
          payload.seoTitle,

        seo_description:
          payload.seoDescription,

        status:
          payload.status,

        published_at:
          publishedAt,

        body:
          payload.body,
      })
      .eq(
        "id",
        id,
      )
      .select(
        "id, slug, status",
      )
      .single();

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      },
    );
  }

  const personIds =
  Array.isArray(
    payload.personIds,
  )
    ? Array.from(
        new Set(
          payload.personIds.filter(
            Boolean,
          ),
        ),
      )
    : [];

/*
 * Replace the current relationships
 * with the exact selection from the
 * editor.
 */
const {
  error: deletePeopleError,
} = await supabase
  .from(
    "news_people",
  )
  .delete()
  .eq(
    "news_id",
    id,
  );

if (deletePeopleError) {
  return NextResponse.json(
    {
      error:
        deletePeopleError.message,
    },
    {
      status: 500,
    },
  );
}

if (
  personIds.length > 0
) {
  const {
    error: insertPeopleError,
  } = await supabase
    .from(
      "news_people",
    )
    .insert(
      personIds.map(
        (personId) => ({
          news_id:
            id,
          person_id:
            personId,
        }),
      ),
    );

  if (insertPeopleError) {
    return NextResponse.json(
      {
        error:
          insertPeopleError.message,
      },
      {
        status: 500,
      },
    );
  }
}

  return NextResponse.json({
    story: data,
  });
}