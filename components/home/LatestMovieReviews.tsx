import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

type Review = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  rating: number | null;
  published_at: string | null;
};

function ReviewScore({
  rating,
  large = false,
}: {
  rating: number;
  large?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-baseline border-l-4 border-[#f21f2b] ${
        large
          ? "gap-1 pl-4"
          : "gap-0.5 pl-3"
      }`}
    >
      <span
        className={`font-black tracking-[-0.05em] text-white ${
          large
            ? "text-4xl"
            : "text-2xl"
        }`}
      >
        {rating}
      </span>

      <span className="text-[10px] font-black text-white/30">
        /10
      </span>
    </div>
  );
}

export default async function LatestMovieReviews() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } = await supabase
    .from("reviews")
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      rating,
      published_at
    `)
    .eq(
      "status",
      "published",
    )
    .lte(
      "published_at",
      new Date()
        .toISOString(),
    )
    .order(
      "published_at",
      {
        ascending: false,
      },
    )
    .limit(4);

  if (error) {
    console.error(
      "Failed to load homepage reviews:",
      error.message,
    );

    return null;
  }

  const reviews =
    (data ?? []) as Review[];

  if (
    reviews.length ===
    0
  ) {
    return null;
  }

  const [
    leadReview,
    ...secondaryReviews
  ] = reviews;

  return (
    <section className="site-shell section-rule py-10 sm:py-12">
      <div className="mb-7 flex items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            The Verdict
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-white sm:text-4xl">
            Latest Movie Reviews
          </h2>
        </div>

        <Link
          href="/reviews"
          className="hidden text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b] sm:block"
        >
          All Reviews →
        </Link>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.45fr_1fr]">
        <Link
          href={`/reviews/${leadReview.slug}`}
          className="group block"
        >
          <div className="relative aspect-[16/9] overflow-hidden bg-[#090b0d]">
            {leadReview.hero_image_url ? (
              <img
                src={
                  leadReview.hero_image_url
                }
                alt={
                  leadReview.title
                }
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-[0.16em] text-white/15">
                The Movie Trailer
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent px-5 pb-5 pt-20 sm:px-7 sm:pb-7">
              <p className="text-[9px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Latest Review
              </p>

              <div className="mt-2 flex items-end justify-between gap-5">
                <h3 className="max-w-2xl text-2xl font-black leading-[1.02] tracking-[-0.04em] text-white transition group-hover:text-[#f21f2b] sm:text-4xl">
                  {
                    leadReview.title
                  }
                </h3>

                {leadReview.rating !==
                null ? (
                  <ReviewScore
                    rating={
                      leadReview.rating
                    }
                    large
                  />
                ) : null}
              </div>
            </div>
          </div>

          {leadReview.excerpt ? (
            <p className="mt-4 max-w-3xl text-sm leading-6 text-white/45">
              {
                leadReview.excerpt
              }
            </p>
          ) : null}
        </Link>

        <div className="divide-y divide-white/10 border-y border-white/10">
          {secondaryReviews.length >
          0 ? (
            secondaryReviews.map(
              (
                review,
              ) => (
                <Link
                  key={
                    review.id
                  }
                  href={`/reviews/${review.slug}`}
                  className="group grid grid-cols-[110px_1fr] gap-4 py-4 first:pt-0 lg:first:pt-4 sm:grid-cols-[150px_1fr]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#090b0d]">
                    {review.hero_image_url ? (
                      <img
                        src={
                          review.hero_image_url
                        }
                        alt={
                          review.title
                        }
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[8px] font-black uppercase tracking-[0.12em] text-white/10">
                        Review
                      </div>
                    )}
                  </div>

                  <div className="flex min-w-0 flex-col justify-center">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[8px] font-black uppercase tracking-[0.15em] text-[#f21f2b]">
                          Review
                        </p>

                        <h3 className="mt-1 text-lg font-black leading-[1.08] tracking-[-0.025em] text-white transition group-hover:text-[#f21f2b]">
                          {
                            review.title
                          }
                        </h3>
                      </div>

                      {review.rating !==
                      null ? (
                        <ReviewScore
                          rating={
                            review.rating
                          }
                        />
                      ) : null}
                    </div>

                    {review.excerpt ? (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/35">
                        {
                          review.excerpt
                        }
                      </p>
                    ) : null}
                  </div>
                </Link>
              ),
            )
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center p-8">
              <p className="max-w-xs text-center text-xs font-bold leading-6 text-white/25">
                More reviews are coming soon.
              </p>
            </div>
          )}
        </div>
      </div>

      <Link
        href="/reviews"
        className="mt-7 inline-block text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b] sm:hidden"
      >
        All Reviews →
      </Link>
    </section>
  );
}
