import Link from "next/link";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export default async function ReviewsAdminPage() {
  const supabase =
  createAdminClient();

  const {
    data: reviews,
    error,
  } = await supabase
    .from("reviews")
    .select(`
      id,
      slug,
      title,
      rating,
      status,
      published_at,
      created_at
    `)
    .order(
      "created_at",
      {
        ascending: false,
      },
    );

  if (error) {
    throw new Error(
      `Failed to load reviews: ${error.message}`,
    );
  }

  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-7">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            Editorial
          </p>

          <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em]">
            Reviews
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Write and manage movie reviews for The Movie Trailer.
          </p>
        </div>

        <Link
          href="/admin/reviews/new"
          className="bg-[#f21f2b] px-5 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
        >
          New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="border border-white/10 bg-[#090b0d] p-8">
          <p className="text-sm font-bold text-white/35">
            No reviews have been created yet.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-white/10 border-y border-white/10">
          {reviews.map(
            (review) => (
              <Link
                key={
                  review.id
                }
                href={`/admin/reviews/${review.id}/edit`}
                className="group grid gap-4 py-5 transition hover:bg-white/[0.02] md:grid-cols-[1fr_auto]"
              >
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <span
                      className={`text-[9px] font-black uppercase tracking-[0.14em] ${
                        review.status ===
                        "published"
                          ? "text-[#f21f2b]"
                          : "text-white/30"
                      }`}
                    >
                      {
                        review.status
                      }
                    </span>

                    {review.rating !==
                    null ? (
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/30">
                        {
                          review.rating
                        }
                        /10
                      </span>
                    ) : null}
                  </div>

                  <h2 className="text-lg font-black leading-tight text-white transition group-hover:text-[#f21f2b]">
                    {
                      review.title
                    }
                  </h2>

                  <p className="mt-2 text-xs text-white/30">
                    /reviews/
                    {
                      review.slug
                    }
                  </p>
                </div>

                <div className="self-center text-sm font-black text-white/20 transition group-hover:translate-x-1 group-hover:text-[#f21f2b]">
                  →
                </div>
              </Link>
            ),
          )}
        </div>
      )}
    </div>
  );
}
