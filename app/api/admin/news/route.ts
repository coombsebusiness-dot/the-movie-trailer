import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type CreateNewsRequest = {
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

export async function POST(
  request: Request,
) {
  const payload =
    (await request.json()) as
      CreateNewsRequest;

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

  const publishedAt =
    payload.status ===
    "published"
      ? new Date().toISOString()
      : null;

  const {
    data,
    error,
  } =
    await supabase
      .from("news")
      .insert({
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

if (
  personIds.length > 0
) {
  const {
    error: peopleError,
  } = await supabase
    .from(
      "news_people",
    )
    .insert(
      personIds.map(
        (personId) => ({
          news_id:
            data.id,
          person_id:
            personId,
        }),
      ),
    );

  if (peopleError) {
    /*
     * Do not leave a half-created
     * story behind if its people
     * relationships fail.
     */
    await supabase
      .from("news")
      .delete()
      .eq(
        "id",
        data.id,
      );

    return NextResponse.json(
      {
        error:
          peopleError.message,
      },
      {
        status: 500,
      },
    );
  }
}

  return NextResponse.json(
    {
      story: data,
    },
    {
      status: 201,
    },
  );
}