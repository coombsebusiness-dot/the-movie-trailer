import type {
  Metadata,
} from "next";

import Image from "next/image";
import Link from "next/link";

import {
  notFound,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://the-movie-trailer.com";

type PersonPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type FeaturedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  featured: boolean;
  status: string;
};

type Actor = {
  id: string;
  slug: string;
  name: string;
  birth_date: string | null;
  birth_place: string | null;
  bio: string | null;
  profile_image_url: string | null;
  seo_title: string | null;
  meta_description: string | null;
  status: string;
};

type PersonMovie = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  release_date: string | null;
  poster_url: string | null;
  genre: string | null;
  tagline: string | null;
};

type PersonNewsStory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  hero_image_url: string | null;
  published_at: string;
};

type PersonReview = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  verdict: string | null;
  rating: number | null;
  published_at: string;
  movie_id: string | null;
};

type PersonFeature = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  published_at: string;
};

type PersonTrailer = {
  id: string;
  slug: string;
  title: string;
  trailer_type: string;
  description: string | null;
  thumbnail_url: string | null;
  youtube_video_id: string | null;
  published_at: string;
  movie_id: string | null;
};

function formatBirthDate(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

function formatReleaseDate(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(
      `${value}T12:00:00`,
    ),
  );
}

function formatTrailerType(
  value: string,
) {
  return value
    .replace(
      /-/g,
      " ",
    )
    .replace(
      /\b\w/g,
      (
        letter,
      ) =>
        letter.toUpperCase(),
    );
}

async function getPerson(
  slug: string,
): Promise<{
  featuredPerson: FeaturedPerson;
  actor: Actor;
} | null> {
  const supabase =
    await createClient();

  const {
    data: featuredPerson,
    error:
      featuredPersonError,
  } =
    await supabase
      .from(
        "featured_people",
      )
      .select(`
        id,
        source_actor_id,
        slug,
        featured,
        status
      `)
      .eq(
        "slug",
        slug,
      )
      .eq(
        "status",
        "active",
      )
      .maybeSingle();

  if (
    featuredPersonError ||
    !featuredPerson
  ) {
    return null;
  }

  const pleaseRewind =
    createPleaseRewindClient();

  const {
    data: actor,
    error: actorError,
  } =
    await pleaseRewind
      .from("actors")
      .select(`
        id,
        slug,
        name,
        birth_date,
        birth_place,
        bio,
        profile_image_url,
        seo_title,
        meta_description,
        status
      `)
      .eq(
        "id",
        featuredPerson.source_actor_id,
      )
      .eq(
        "status",
        "published",
      )
      .maybeSingle();

  if (
    actorError ||
    !actor
  ) {
    return null;
  }

  return {
    featuredPerson:
      featuredPerson as FeaturedPerson,
    actor:
      actor as Actor,
  };
}

export async function generateMetadata({
  params,
}: PersonPageProps): Promise<Metadata> {
  const {
    slug,
  } =
    await params;

  const person =
    await getPerson(
      slug,
    );

  if (!person) {
    return {
      title:
        "Person Not Found",
    };
  }

  const {
    actor,
    featuredPerson,
  } =
    person;

  const title =
    actor.seo_title?.trim() ||
    `${actor.name} - Latest News, Movies & Biography`;

  const description =
    actor.meta_description?.trim() ||
    `Read the latest ${actor.name} news, movie updates, trailers and biography on The Movie Trailer.`;

  const canonicalUrl =
    `/people/${featuredPerson.slug}`;

  const images =
    actor.profile_image_url
      ? [
          {
            url:
              actor.profile_image_url,
            alt:
              actor.name,
          },
        ]
      : undefined;

  return {
    title,
    description,

    alternates: {
      canonical:
        canonicalUrl,
    },

    openGraph: {
      type:
        "profile",
      siteName:
        "The Movie Trailer",
      title,
      description,
      url:
        canonicalUrl,
      images,
    },

    twitter: {
      card:
        "summary_large_image",
      title,
      description,
      images:
        actor.profile_image_url
          ? [
              actor.profile_image_url,
            ]
          : undefined,
    },
  };
}

export default async function PersonPage({
  params,
}: PersonPageProps) {
  const {
    slug,
  } =
    await params;

  const person =
    await getPerson(
      slug,
    );

  if (!person) {
    notFound();
  }

  const {
    actor,
    featuredPerson,
  } =
    person;

  const birthDate =
    formatBirthDate(
      actor.birth_date,
    );

    const canonicalUrl =
  `${siteUrl}/people/${featuredPerson.slug}`;

const personDescription =
  actor.meta_description?.trim() ||
  actor.bio?.trim() ||
  `Read the latest ${actor.name} news, movie updates, trailers and biography on The Movie Trailer.`;

const personJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "Person",

  "@id":
    `${canonicalUrl}#person`,

  url:
    canonicalUrl,

  name:
    actor.name,

  description:
    personDescription,

  ...(actor.profile_image_url
    ? {
        image:
          actor.profile_image_url,
      }
    : {}),

  ...(actor.birth_date
    ? {
        birthDate:
          actor.birth_date,
      }
    : {}),

  ...(actor.birth_place
    ? {
        birthPlace: {
          "@type":
            "Place",
          name:
            actor.birth_place,
        },
      }
    : {}),

  mainEntityOfPage: {
    "@type":
      "WebPage",
    "@id":
      canonicalUrl,
  },
};

    const supabase =
  await createClient();

const now =
  new Date().toISOString();

const {
  data:
    movieRelationshipData,
  error:
    movieRelationshipError,
} = await supabase
  .from(
    "movie_people",
  )
  .select(
    "movie_id",
  )
  .eq(
    "person_id",
    featuredPerson.id,
  );

if (
  movieRelationshipError
) {
  console.error(
    "Failed to load person movie relationships:",
    movieRelationshipError,
  );
}

const movieIds =
  (
    movieRelationshipData ??
    []
  ).map(
    (
      relationship,
    ) =>
      relationship.movie_id as string,
  );

let personMovies:
  PersonMovie[] = [];

if (
  movieIds.length >
  0
) {
  const {
    data:
      movieData,
    error:
      movieError,
  } = await supabase
    .from(
      "movies",
    )
    .select(`
      id,
      slug,
      title,
      year,
      release_date,
      poster_url,
      genre,
      tagline
    `)
    .in(
      "id",
      movieIds,
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
      "release_date",
      {
        ascending:
          false,
        nullsFirst:
          false,
      },
    );

  if (
    movieError
  ) {
    console.error(
      "Failed to load person movies:",
      movieError,
    );
  }

  personMovies =
    (
      movieData ??
      []
    ) as PersonMovie[];
}

let personTrailers:
  PersonTrailer[] = [];

if (
  movieIds.length >
  0
) {
  const {
    data: trailerData,
    error: trailerError,
  } =
    await supabase
      .from("trailers")
      .select(`
        id,
        slug,
        title,
        trailer_type,
        description,
        thumbnail_url,
        youtube_video_id,
        published_at,
        movie_id
      `)
      .in(
        "movie_id",
        movieIds,
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
      .limit(8);

  if (
    trailerError
  ) {
    console.error(
      "Failed to load person trailers:",
      trailerError,
    );
  }

  personTrailers =
    (
      trailerData ??
      []
    ) as PersonTrailer[];
}

const {
  data: newsRelationshipData,
  error: newsRelationshipError,
} = await supabase
  .from("news_people")
  .select("news_id")
  .eq(
    "person_id",
    featuredPerson.id,
  );

if (newsRelationshipError) {
  console.error(
    "Failed to load person news relationships:",
    newsRelationshipError,
  );
}

const newsIds =
  (newsRelationshipData ?? []).map(
    (relationship) =>
      relationship.news_id as string,
  );

let personNews:
  PersonNewsStory[] = [];

if (newsIds.length > 0) {
  const {
    data: newsData,
    error: newsError,
  } = await supabase
    .from("news")
    .select(`
      id,
      slug,
      title,
      excerpt,
      category,
      hero_image_url,
      published_at
    `)
    .in(
      "id",
      newsIds,
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
    .limit(8);

  if (newsError) {
    console.error(
      "Failed to load person news:",
      newsError,
    );
  }

  personNews =
    (newsData ??
      []) as PersonNewsStory[];
}
const {
  data:
    reviewRelationshipData,
  error:
    reviewRelationshipError,
} = await supabase
  .from(
    "review_people",
  )
  .select(
    "review_id",
  )
  .eq(
    "person_id",
    featuredPerson.id,
  );

if (
  reviewRelationshipError
) {
  console.error(
    "Failed to load person review relationships:",
    reviewRelationshipError,
  );
}

const reviewIds =
  (
    reviewRelationshipData ??
    []
  ).map(
    (
      relationship,
    ) =>
      relationship.review_id as string,
  );

let personReviews:
  PersonReview[] = [];

if (
  reviewIds.length >
  0
) {
  const {
    data:
      reviewData,
    error:
      reviewError,
  } = await supabase
    .from(
      "reviews",
    )
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      verdict,
      rating,
      published_at,
      movie_id
    `)
    .in(
      "id",
      reviewIds,
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
        ascending:
          false,
      },
    )
    .limit(8);

  if (
    reviewError
  ) {
    console.error(
      "Failed to load person reviews:",
      reviewError,
    );
  }

  personReviews =
    (
      reviewData ??
      []
    ) as PersonReview[];
}
const {
  data: featureRelationshipData,
  error: featureRelationshipError,
} = await supabase
  .from("feature_people")
  .select("feature_id")
  .eq(
    "person_id",
    featuredPerson.id,
  );

if (featureRelationshipError) {
  console.error(
    "Failed to load person feature relationships:",
    featureRelationshipError,
  );
}

const featureIds =
  (featureRelationshipData ?? []).map(
    (relationship) =>
      relationship.feature_id as string,
  );

let personFeatures:
  PersonFeature[] = [];

if (featureIds.length > 0) {
  const {
    data: featureData,
    error: featureError,
  } = await supabase
    .from("features")
    .select(`
      id,
      slug,
      title,
      excerpt,
      hero_image_url,
      published_at
    `)
    .in(
      "id",
      featureIds,
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
    .limit(8);

  if (featureError) {
    console.error(
      "Failed to load person features:",
      featureError,
    );
  }

  personFeatures =
    (featureData ??
      []) as PersonFeature[];
}
return (
  <main className="min-h-screen bg-[#050607] text-white">
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html:
          JSON.stringify(
            personJsonLd,
          ),
      }}
    />

    <BreadcrumbJsonLd
  items={[
    {
      name: "Home",
      url: "/",
    },
    {
      name: "People",
      url: "/people",
    },
    {
      name:
        actor.name,
      url:
        `/people/${featuredPerson.slug}`,
    },
  ]}
/>
    <BreakingBar />

    <div className="site-shell py-10 sm:py-14">
      <div className="mb-8">
        <Link
          href="/people"
          className="text-xs font-black uppercase tracking-[0.2em] text-red-500 hover:text-red-400"
        >
          People
        </Link>
      </div>

      <section className="grid gap-8 border-b border-white/10 pb-12 lg:grid-cols-[320px_1fr] lg:gap-12">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
            {actor.profile_image_url ? (
              <Image
                src={
                  actor.profile_image_url
                }
                alt={
                  actor.name
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 320px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/30">
                No image available
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-red-500">
            Current People
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {actor.name}
          </h1>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
            {birthDate ? (
              <div>
                <span className="font-bold text-white">
                  Born:
                </span>{" "}
                {birthDate}
              </div>
            ) : null}

            {actor.birth_place ? (
              <div>
                <span className="font-bold text-white">
                  Birthplace:
                </span>{" "}
                {
                  actor.birth_place
                }
              </div>
            ) : null}
          </div>

          <p className="mt-8 max-w-3xl text-sm leading-7 text-white/50">
            Latest news, movie updates, trailers and current coverage for{" "}
            {actor.name}.
          </p>
        </div>
      </section>

      <div className="grid gap-12 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article>
          <div className="mb-6">
            <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
              Biography
            </div>

            <h2 className="mt-2 text-3xl font-black text-white">
              About {actor.name}
            </h2>
          </div>

          {actor.bio ? (
            <div className="max-w-4xl whitespace-pre-line text-base leading-8 text-white/75">
              {actor.bio}
            </div>
          ) : (
            <p className="text-white/45">
              Biography coming soon.
            </p>
          )}
        </article>

        <aside className="space-y-6">
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <div className="text-xs font-black uppercase tracking-[0.18em] text-red-500">
              Profile
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              {birthDate ? (
                <div>
                  <dt className="text-white/40">
                    Date of birth
                  </dt>

                  <dd className="mt-1 font-bold text-white">
                    {birthDate}
                  </dd>
                </div>
              ) : null}

              {actor.birth_place ? (
                <div>
                  <dt className="text-white/40">
                    Birthplace
                  </dt>

                  <dd className="mt-1 font-bold text-white">
                    {
                      actor.birth_place
                    }
                  </dd>
                </div>
              ) : null}

              <div>
                <dt className="text-white/40">
                  Status
                </dt>

                <dd className="mt-1 font-bold uppercase tracking-[0.12em] text-red-400">
                  Current
                </dd>
              </div>
            </dl>
          </div>

          
        </aside>
      </div>

      {personNews.length > 0 ? (
  <section className="border-t border-white/10 py-12">
    <div className="mb-6">
      <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
        Latest Coverage
      </div>

      <h2 className="mt-2 text-3xl font-black text-white">
        Latest {actor.name} News
      </h2>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {personNews.map(
        (story) => (
          <Link
            key={story.id}
            href={`/news/${story.slug}`}
            className="group overflow-hidden border border-white/10 bg-[#0b0d0f] transition hover:border-red-500/50"
          >
            {story.hero_image_url ? (
              <div className="aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={
                    story.hero_image_url
                  }
                  alt={
                    story.title
                  }
                  width={900}
                  height={506}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
            ) : null}

            <div className="p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-500">
                {story.category.replace(
                  /-/g,
                  " ",
                )}
              </div>

              <h3 className="mt-2 text-xl font-black leading-tight text-white transition group-hover:text-red-500">
                {story.title}
              </h3>

              {story.excerpt ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                  {story.excerpt}
                </p>
              ) : null}
            </div>
          </Link>
        ),
      )}
    </div>
  </section>
) : null}

     <section className="border-t border-white/10 py-12">
  <div className="mb-7 flex items-end justify-between gap-6">
    <div>
      <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
        Movies
      </div>

      <h2 className="mt-2 text-3xl font-black text-white">
        Current & Upcoming
      </h2>
    </div>

    {personMovies.length >
    0 ? (
      <div className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
        {personMovies.length}{" "}
        {personMovies.length ===
        1
          ? "movie"
          : "movies"}
      </div>
    ) : null}
  </div>

  {personMovies.length ===
  0 ? (
    <div className="border border-white/10 bg-white/[0.02] p-8 text-sm text-white/40">
      No current TMT movie coverage for{" "}
      {actor.name} yet.
    </div>
  ) : (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {personMovies.map(
        (
          movie,
        ) => (
          <Link
            key={
              movie.id
            }
            href={`/movies/${movie.slug}`}
            className="group block"
          >
            <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
              {movie.poster_url ? (
                <Image
                  src={
                    movie.poster_url
                  }
                  alt={
                    movie.title
                  }
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.15em] text-white/20">
                  No Poster
                </div>
              )}
            </div>

            <div className="border-x border-b border-white/10 bg-[#0b0d0f] p-4">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.14em] text-red-500">
                {movie.genre ? (
                  <span>
                    {
                      movie.genre
                    }
                  </span>
                ) : null}

                {movie.release_date ? (
                  <>
                    <span className="text-white/20">
                      •
                    </span>

                    <span className="text-white/40">
                      {formatReleaseDate(
                        movie.release_date,
                      )}
                    </span>
                  </>
                ) : movie.year ? (
                  <>
                    <span className="text-white/20">
                      •
                    </span>

                    <span className="text-white/40">
                      {
                        movie.year
                      }
                    </span>
                  </>
                ) : null}
              </div>

              <h3 className="mt-2 text-lg font-black leading-tight text-white transition group-hover:text-red-400">
                {
                  movie.title
                }
              </h3>

              {movie.tagline ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                  {
                    movie.tagline
                  }
                </p>
              ) : null}
            </div>
          </Link>
        ),
      )}
    </div>
  )}
</section>

{personReviews.length > 0 ? (
  <section className="border-t border-white/10 py-12">
    <div className="mb-7 flex items-end justify-between gap-6">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
          Reviews
        </div>

        <h2 className="mt-2 text-3xl font-black text-white">
          {actor.name} Reviews
        </h2>
      </div>

      <div className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
        {personReviews.length}{" "}
        {personReviews.length ===
        1
          ? "review"
          : "reviews"}
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {personReviews.map(
        (
          review,
        ) => (
          <Link
            key={
              review.id
            }
            href={`/reviews/${review.slug}`}
            className="group overflow-hidden border border-white/10 bg-[#0b0d0f] transition hover:border-red-500/50"
          >
            {review.hero_image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={
                    review.hero_image_url
                  }
                  alt={
                    review.title
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />

                {review.rating !==
                null ? (
                  <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white shadow-xl">
                    {
                      review.rating
                    }
                    /10
                  </div>
                ) : null}
              </div>
            ) : null}

            <div className="p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-500">
                Movie Review
              </div>

              <h3 className="mt-2 text-xl font-black leading-tight text-white transition group-hover:text-red-500">
                {
                  review.title
                }
              </h3>

              {review.excerpt ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                  {
                    review.excerpt
                  }
                </p>
              ) : null}

              {review.verdict ? (
                <p className="mt-4 border-l-2 border-red-600 pl-3 text-sm font-bold leading-6 text-white/65">
                  {
                    review.verdict
                  }
                </p>
              ) : null}
            </div>
          </Link>
        ),
      )}
    </div>
  </section>
) : null}

{personFeatures.length > 0 ? (
  <section className="border-t border-white/10 py-12">
    <div className="mb-7 flex items-end justify-between gap-6">
      <div>
        <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
          Features
        </div>

        <h2 className="mt-2 text-3xl font-black text-white">
          {actor.name} Features
        </h2>
      </div>

      <div className="text-xs font-black uppercase tracking-[0.14em] text-white/30">
        {personFeatures.length}{" "}
        {personFeatures.length === 1
          ? "feature"
          : "features"}
      </div>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {personFeatures.map(
        (feature) => (
          <Link
            key={feature.id}
            href={`/features/${feature.slug}`}
            className="group overflow-hidden border border-white/10 bg-[#0b0d0f] transition hover:border-red-500/50"
          >
            {feature.hero_image_url ? (
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <Image
                  src={
                    feature.hero_image_url
                  }
                  alt={feature.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />

                <div className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                  Feature
                </div>
              </div>
            ) : null}

            <div className="p-5">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-red-500">
                The Big Read
              </div>

              <h3 className="mt-2 text-xl font-black leading-tight text-white transition group-hover:text-red-500">
                {feature.title}
              </h3>

              {feature.excerpt ? (
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                  {feature.excerpt}
                </p>
              ) : null}

              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.16em] text-white/30 transition group-hover:text-red-400">
                Read Feature →
              </p>
            </div>
          </Link>
        ),
      )}
    </div>
  </section>
) : null}

<section className="border-t border-white/10 py-12">
  <div className="mb-7 flex items-end justify-between gap-6">
    <div>
      <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
        Watch
      </div>

      <h2 className="mt-2 text-3xl font-black text-white">
        Latest Trailers
      </h2>
    </div>

    {personTrailers.length >
    0 ? (
      <Link
        href="/trailers"
        className="text-xs font-black uppercase tracking-[0.14em] text-red-400 hover:text-red-300"
      >
        All Trailers →
      </Link>
    ) : null}
  </div>

  {personTrailers.length ===
  0 ? (
    <div className="border border-white/10 bg-white/[0.02] p-8 text-sm text-white/40">
      No TMT trailers featuring{" "}
      {actor.name} yet.
    </div>
  ) : (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {personTrailers.map(
        (
          trailer,
        ) => (
          <Link
            key={
              trailer.id
            }
            href={`/trailers/${trailer.slug}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden bg-white/5">
              {trailer.thumbnail_url ? (
                <Image
                  src={
                    trailer.thumbnail_url
                  }
                  alt={
                    trailer.title
                  }
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.15em] text-white/20">
                  Trailer
                </div>
              )}

              <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/5" />

              <div className="absolute left-4 top-4 bg-red-600 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-white">
                {formatTrailerType(
                  trailer.trailer_type,
                )}
              </div>

              <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-lg text-white transition group-hover:scale-110">
                ▶
              </div>
            </div>

            <div className="border-x border-b border-white/10 bg-[#0b0d0f] p-4">
              <h3 className="text-lg font-black leading-tight text-white transition group-hover:text-red-400">
                {
                  trailer.title
                }
              </h3>

              {trailer.description ? (
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                  {
                    trailer.description
                  }
                </p>
              ) : null}
            </div>
          </Link>
        ),
      )}
    </div>
  )}
</section>

    </div>

    <NewsletterSignup />

    <SiteFooter />
  </main>

  );
}