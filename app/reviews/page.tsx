import Link from "next/link";
import type {
  Metadata,
} from "next";
import {
  createClient,
} from "@/lib/supabase/server";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title:
    "Movie Reviews",

  description:
    "Read the latest movie reviews, ratings and verdicts from The Movie Trailer, covering new releases, blockbusters and films worth watching.",

  alternates: {
    canonical:
      "/reviews",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "Movie Reviews | The Movie Trailer",
    description:
      "Read the latest movie reviews, ratings and verdicts from The Movie Trailer, covering new releases, blockbusters and films worth watching.",
    url:
      "/reviews",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "Movie Reviews | The Movie Trailer",
    description:
      "Read the latest movie reviews, ratings and verdicts from The Movie Trailer, covering new releases, blockbusters and films worth watching.",
  },
};

export default async function ReviewsPage() {
  const supabase =
    await createClient();

  const {
    data: reviews,
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
    );

  if (error) {
    throw new Error(
      `Failed to load reviews: ${error.message}`,
    );
  }

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <SiteHeader />

      <BreakingBar />

      <div className="site-shell py-12 sm:py-16">
        <div className="border-b border-white/10 pb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            The Movie Trailer
          </p>

        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] sm:text-5xl">
          Movie Reviews
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/45">
          The latest movie reviews, verdicts and ratings from The Movie Trailer.
        </p>
      </div>

      {reviews.length ===
      0 ? (
        <div className="py-16 text-sm font-bold text-white/30">
          No reviews have been published yet.
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-10 pt-10 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map(
            (review) => (
              <Link
                key={
                  review.id
                }
                href={`/reviews/${review.slug}`}
                className="group"
              >
                <div className="aspect-[16/9] overflow-hidden border border-white/10 bg-[#090b0d]">
                  {review.hero_image_url ? (
                    <img
                      src={
                        review.hero_image_url
                      }
                      alt={
                        review.title
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-black uppercase tracking-[0.15em] text-white/15">
                      The Movie Trailer
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#f21f2b]">
                    Review
                  </span>

                  {review.rating !==
                  null ? (
                    <span className="text-sm font-black text-white">
                      {
                        review.rating
                      }
                      /10
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-2 text-2xl font-black leading-[1.05] tracking-[-0.035em] text-white transition group-hover:text-[#f21f2b]">
                  {
                    review.title
                  }
                </h2>

                {review.excerpt ? (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/45">
                    {
                      review.excerpt
                    }
                  </p>
                ) : null}
              </Link>
            ),
          )}
        </div>
       )}
    </div>

    <NewsletterSignup />

    <SiteFooter />
  </main>
);
}
