import FeaturedManager from "@/components/admin/homepage/FeaturedManager";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export const dynamic =
  "force-dynamic";

export default async function AdminHomepagePage() {
  const supabase =
    createAdminClient();

  const now =
    new Date().toISOString();

  const [
    newsResult,
    moviesResult,
    trailersResult,
    featuredResult,
  ] = await Promise.all([
    supabase
      .from("news")
      .select(
        `
          id,
          title,
          excerpt,
          hero_image_url,
          published_at
        `,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        now,
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      )
      .limit(100),

    supabase
      .from("movies")
      .select(
        `
          id,
          title,
          tagline,
          synopsis,
          backdrop_url,
          poster_url,
          published_at
        `,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        now,
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      )
      .limit(100),

    supabase
      .from("trailers")
      .select(
        `
          id,
          title,
          description,
          thumbnail_url,
          published_at
        `,
      )
      .eq(
        "status",
        "published",
      )
      .lte(
        "published_at",
        now,
      )
      .order(
        "published_at",
        {
          ascending: false,
        },
      )
      .limit(100),

    supabase
      .from(
        "homepage_featured",
      )
      .select(
        `
          content_type,
          content_id,
          eyebrow,
          headline,
          excerpt,
          image_url
        `,
      )
      .eq(
        "is_active",
        true,
      )
      .order(
        "updated_at",
        {
          ascending: false,
        },
      )
      .limit(1)
      .maybeSingle(),
  ]);

  if (newsResult.error) {
    console.error(
      "Unable to load published news:",
      newsResult.error,
    );
  }

  if (moviesResult.error) {
    console.error(
      "Unable to load published movies:",
      moviesResult.error,
    );
  }

  if (trailersResult.error) {
    console.error(
      "Unable to load published trailers:",
      trailersResult.error,
    );
  }

  if (featuredResult.error) {
    console.error(
      "Unable to load current homepage featured item:",
      featuredResult.error,
    );
  }

  const newsItems =
    (
      newsResult.data ??
      []
    ).map(
      (item) => ({
        id: item.id,

        type:
          "news" as const,

        title:
          item.title,

        subtitle:
          item.excerpt,

        imageUrl:
          item.hero_image_url,
      }),
    );

  const movieItems =
    (
      moviesResult.data ??
      []
    ).map(
      (item) => ({
        id: item.id,

        type:
          "movie" as const,

        title:
          item.title,

        subtitle:
          item.tagline ||
          item.synopsis,

        imageUrl:
          item.backdrop_url ||
          item.poster_url,
      }),
    );

  const trailerItems =
    (
      trailersResult.data ??
      []
    ).map(
      (item) => ({
        id: item.id,

        type:
          "trailer" as const,

        title:
          item.title,

        subtitle:
          item.description,

        imageUrl:
          item.thumbnail_url,
      }),
    );

  const items = [
    ...newsItems,
    ...movieItems,
    ...trailerItems,
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
          Homepage Control
        </p>

        <h1 className="mt-2 text-4xl font-black uppercase tracking-[-0.05em] md:text-5xl">
          Featured
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40">
          Control the main featured
          story shown on The Movie
          Trailer homepage. Choose
          published news, movies or
          trailers and optionally
          customise how the item is
          presented.
        </p>
      </div>

      <FeaturedManager
        items={items}
        currentFeatured={
          featuredResult.data ??
          null
        }
      />
    </div>
  );
}