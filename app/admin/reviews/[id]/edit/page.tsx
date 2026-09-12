import {
  notFound,
} from "next/navigation";

import ReviewEditor from "@/components/admin/reviews/ReviewEditor";
import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ReviewSection = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  youtubeUrl: string;
};

export default async function EditReviewPage({
  params,
}: PageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

    const curatedPeople =
  await getCuratedPeople();

  const {
    data: review,
    error: reviewError,
  } = await supabase
    .from("reviews")
    .select(`
      id,
      movie_id,
      slug,
      title,
      excerpt,
      hero_image_url,
      intro,
      sections,
      verdict,
      rating,
      seo_title,
      seo_description,
      status
    `)
    .eq(
      "id",
      id,
    )
    .maybeSingle();

  if (
    reviewError ||
    !review
  ) {
    notFound();
  }

  const {
    data: movies,
    error: moviesError,
  } = await supabase
    .from("movies")
    .select(`
      id,
      title,
      year,
      poster_url
    `)
    .eq(
      "status",
      "published",
    )
    .order(
      "title",
      {
        ascending: true,
      },
    );

  if (moviesError) {
    throw new Error(
      `Failed to load movies: ${moviesError.message}`,
    );
  }

  const {
  data: reviewPeople,
  error: reviewPeopleError,
} = await supabase
  .from(
    "review_people",
  )
  .select(
    "person_id",
  )
  .eq(
    "review_id",
    id,
  );

if (reviewPeopleError) {
  throw new Error(
    `Failed to load review people: ${reviewPeopleError.message}`,
  );
}

const initialPersonIds =
  (
    reviewPeople ?? []
  ).map(
    (relationship) =>
      relationship.person_id,
  );

  const sections =
    Array.isArray(
      review.sections,
    )
      ? (
          review.sections as ReviewSection[]
        )
      : [];

  return (
    <div>
      <div className="mb-10 border-b border-white/10 pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          Editorial
        </p>

        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em]">
          Edit Review
        </h1>

        <p className="mt-3 text-sm text-white/40">
          Edit and publish this movie review.
        </p>
      </div>

      <ReviewEditor
  movies={
    movies ?? []
  }
  curatedPeople={
    curatedPeople
  }
  initialPersonIds={
    initialPersonIds
  }
  initialData={{
          id:
            review.id,
          movie_id:
            review.movie_id,
          slug:
            review.slug,
          title:
            review.title,
          excerpt:
            review.excerpt,
          hero_image_url:
            review.hero_image_url,
          intro:
            review.intro,
          sections,
          verdict:
            review.verdict,
          rating:
            review.rating,
          seo_title:
            review.seo_title,
          seo_description:
            review.seo_description,
          status:
            review.status,
        }}
      />
    </div>
  );
}
