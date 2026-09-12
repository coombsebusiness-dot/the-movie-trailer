import {
  notFound,
} from "next/navigation";

import NewsEditor from "@/components/admin/news/NewsEditor";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type EditNewsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type NewsBody = {
  intro?: string;
  sections?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
    imageUrl?: string;
    youtubeUrl?: string;
  }[];
};

export default async function EditNewsPage({
  params,
}: EditNewsPageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("news")
      .select(`
        id,
        title,
        slug,
        excerpt,
        category,
        hero_image_url,
        source_name,
        source_url,
        seo_title,
        seo_description,
        status,
        published_at,
        body
      `)
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    notFound();
  }

  const body =
    (data.body ??
      {}) as NewsBody;

  const curatedPeople =
    await getCuratedPeople();

  const {
    data: newsPeopleData,
    error: newsPeopleError,
  } = await supabase
    .from(
      "news_people",
    )
    .select(
      "person_id",
    )
    .eq(
      "news_id",
      data.id,
    );

  if (
    newsPeopleError
  ) {
    console.error(
      "Failed to load story people:",
      newsPeopleError,
    );
  }

  const selectedPersonIds =
    (
      newsPeopleData ??
      []
    ).map(
      (
        relationship,
      ) =>
        relationship.person_id as string,
    );

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          News Desk
        </p>

        <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
          Edit Story
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
          Update and republish this story.
        </p>
      </div>

      <NewsEditor
        curatedPeople={
          curatedPeople
        }
        initialPersonIds={
          selectedPersonIds
        }
        initialData={{
          id:
            data.id,

          title:
            data.title,

          slug:
            data.slug,

          status:
            data.status as
              | "draft"
              | "published",

          publishedAt:
            data.published_at,

          excerpt:
            data.excerpt ??
            "",

          intro:
            body.intro ??
            "",

          category:
            data.category as
              | "movie-news"
              | "tv-news"
              | "trailers"
              | "casting"
              | "release-dates"
              | "horror"
              | "streaming"
              | "features",

          heroImageUrl:
            data.hero_image_url ??
            "",

          sourceName:
            data.source_name ??
            "",

          sourceUrl:
            data.source_url ??
            "",

          seoTitle:
            data.seo_title ??
            "",

          seoDescription:
            data.seo_description ??
            "",

          sections:
            body.sections?.map(
              (
                section,
              ) => ({
                eyebrow:
                  section.eyebrow ??
                  "",

                headline:
                  section.headline ??
                  "",

                body:
                  section.body ??
                  "",

                imageUrl:
                  section.imageUrl ??
                  "",

                youtubeUrl:
                  section.youtubeUrl ??
                  "",
              }),
            ) ?? [],
        }}
      />
    </div>
  );
}