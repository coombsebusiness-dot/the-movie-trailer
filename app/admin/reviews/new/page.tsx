import ReviewEditor from "@/components/admin/reviews/ReviewEditor";
import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

import {
  createClient,
} from "@/lib/supabase/server";

export default async function NewReviewPage() {
  const supabase =
    await createClient();

    const curatedPeople =
  await getCuratedPeople();

  const {
    data: movies,
    error,
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

  if (error) {
    throw new Error(
      `Failed to load movies: ${error.message}`,
    );
  }

  return (
    <div>
      <div className="mb-10 border-b border-white/10 pb-7">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          Editorial
        </p>

        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em]">
          New Review
        </h1>

        <p className="mt-3 text-sm text-white/40">
          Write a new movie review for The Movie Trailer.
        </p>
      </div>

      <ReviewEditor
  movies={
    movies ?? []
  }
  curatedPeople={
    curatedPeople
  }
/>
    </div>
  );
}
