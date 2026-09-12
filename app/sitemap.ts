import type {
  MetadataRoute,
} from "next";

import {
  createClient,
} from "@supabase/supabase-js";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

const siteUrl = (
  process.env
    .NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com"
).replace(/\/$/, "");

type PublishedItem = {
  slug: string;
  published_at: string | null;
};

type FeaturedPerson = {
  source_actor_id: string;
  slug: string;
};

type PublishedActor = {
  id: string;
};

function createMovieTrailerClient() {
  const url =
    process.env
      .NEXT_PUBLIC_SUPABASE_URL;

  const anonKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey
  ) {
    throw new Error(
      "The Movie Trailer Supabase credentials are not configured.",
    );
  }

  return createClient(
    url,
    anonKey,
    {
      auth: {
        persistSession:
          false,
        autoRefreshToken:
          false,
        detectSessionInUrl:
          false,
      },
    },
  );
}

export default async function sitemap():
  Promise<MetadataRoute.Sitemap> {
  const supabase =
    createMovieTrailerClient();

  const now =
    new Date().toISOString();

  const [
    newsResult,
    moviesResult,
    trailersResult,
    reviewsResult,
    featuresResult,
    peopleResult,
  ] =
    await Promise.all([
      supabase
        .from("news")
        .select(
          "slug,published_at",
        )
        .eq(
          "status",
          "published",
        )
        .lte(
          "published_at",
          now,
        ),

      supabase
        .from("movies")
        .select(
          "slug,published_at",
        )
        .eq(
          "status",
          "published",
        )
        .lte(
          "published_at",
          now,
        ),

      supabase
        .from("trailers")
        .select(
          "slug,published_at",
        )
        .eq(
          "status",
          "published",
        )
        .lte(
          "published_at",
          now,
        ),

      supabase
        .from("reviews")
        .select(
          "slug,published_at",
        )
        .eq(
          "status",
          "published",
        )
        .lte(
          "published_at",
          now,
        ),

      supabase
        .from("features")
        .select(
          "slug,published_at",
        )
        .eq(
          "status",
          "published",
        )
        .lte(
          "published_at",
          now,
        ),

      supabase
        .from(
          "featured_people",
        )
        .select(
          "source_actor_id,slug",
        )
        .eq(
          "status",
          "active",
        ),
    ]);

  const databaseResults = [
    {
      name: "news",
      result: newsResult,
    },
    {
      name: "movies",
      result: moviesResult,
    },
    {
      name: "trailers",
      result: trailersResult,
    },
    {
      name: "reviews",
      result: reviewsResult,
    },
    {
      name: "features",
      result: featuresResult,
    },
    {
      name: "people",
      result: peopleResult,
    },
  ];

  for (
    const {
      name,
      result,
    } of databaseResults
  ) {
    if (result.error) {
      throw new Error(
        `Failed to build sitemap from ${name}: ${result.error.message}`,
      );
    }
  }

  const news =
    (newsResult.data ??
      []) as PublishedItem[];

  const movies =
    (moviesResult.data ??
      []) as PublishedItem[];

  const trailers =
    (trailersResult.data ??
      []) as PublishedItem[];

  const reviews =
    (reviewsResult.data ??
      []) as PublishedItem[];

  const features =
    (featuresResult.data ??
      []) as PublishedItem[];

  const featuredPeople =
    (peopleResult.data ??
      []) as FeaturedPerson[];

  /*
   * A person is public on The Movie Trailer
   * only when:
   *
   * 1. Their featured_people record is active.
   * 2. Their source actor is published in
   *    the Please Rewind database.
   */

  let peopleEntries:
    MetadataRoute.Sitemap =
    [];

  if (
    featuredPeople.length >
    0
  ) {
    const pleaseRewind =
      createPleaseRewindClient();

    const actorIds =
      featuredPeople.map(
        (person) =>
          person.source_actor_id,
      );

    const {
      data: actorData,
      error: actorError,
    } =
      await pleaseRewind
        .from("actors")
        .select("id")
        .in(
          "id",
          actorIds,
        )
        .eq(
          "status",
          "published",
        );

    if (actorError) {
      throw new Error(
        `Failed to build people sitemap: ${actorError.message}`,
      );
    }

    const publishedActors =
      (actorData ??
        []) as PublishedActor[];

    const publishedActorIds =
      new Set(
        publishedActors.map(
          (actor) =>
            actor.id,
        ),
      );

    peopleEntries =
      featuredPeople
        .filter(
          (person) =>
            publishedActorIds.has(
              person.source_actor_id,
            ),
        )
        .filter(
          (person) =>
            Boolean(
              person.slug,
            ),
        )
        .map(
          (person) => ({
            url:
              `${siteUrl}/people/${person.slug}`,
          }),
        );
  }

  const staticEntries:
    MetadataRoute.Sitemap =
    [
      {
        url: siteUrl,
      },
      {
        url:
          `${siteUrl}/news`,
      },
      {
        url:
          `${siteUrl}/trailers`,
      },
      {
        url:
          `${siteUrl}/movies`,
      },
      {
        url:
          `${siteUrl}/people`,
      },
      {
        url:
          `${siteUrl}/reviews`,
      },
      {
        url:
          `${siteUrl}/features`,
      },
      {
        url:
          `${siteUrl}/coming-soon`,
      },
      {
        url:
          `${siteUrl}/horror`,
      },
      {
        url:
          `${siteUrl}/tv`,
      },
      {
        url:
          `${siteUrl}/about`,
      },
      {
        url:
          `${siteUrl}/contact`,
      },
      {
        url:
          `${siteUrl}/editorial-policy`,
      },
      {
        url:
          `${siteUrl}/corrections`,
      },
      {
        url:
          `${siteUrl}/privacy`,
      },
      {
        url:
          `${siteUrl}/cookies`,
      },
      {
        url:
          `${siteUrl}/terms`,
      },
      {
        url:
          `${siteUrl}/affiliate-disclosure`,
      },
    ];

  function createEntries(
    route: string,
    items: PublishedItem[],
  ): MetadataRoute.Sitemap {
    return items
      .filter(
        (item) =>
          Boolean(
            item.slug,
          ),
      )
      .map(
        (item) => ({
          url:
            `${siteUrl}/${route}/${item.slug}`,

          ...(item.published_at
            ? {
                lastModified:
                  new Date(
                    item.published_at,
                  ),
              }
            : {}),
        }),
      );
  }

  return [
    ...staticEntries,

    ...createEntries(
      "news",
      news,
    ),

    ...createEntries(
      "movies",
      movies,
    ),

    ...createEntries(
      "trailers",
      trailers,
    ),

    ...createEntries(
      "reviews",
      reviews,
    ),

    ...createEntries(
      "features",
      features,
    ),

    ...peopleEntries,
  ];
}