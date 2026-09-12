export type ContentStatus =
  | "draft"
  | "published"
  | "scheduled"
  | "archived";

export type NewsCategory =
  | "movie-news"
  | "tv-news"
  | "trailers"
  | "casting"
  | "release-dates"
  | "horror"
  | "streaming"
  | "features";

export type TrailerType =
  | "teaser"
  | "official-trailer"
  | "final-trailer"
  | "clip"
  | "featurette";

export type NewsStory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: NewsCategory;
  status: ContentStatus;

  heroImageUrl: string | null;

  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;

  seoTitle: string | null;
  seoDescription: string | null;

  sourceName: string | null;
  sourceUrl: string | null;
};

export type Movie = {
  id: string;
  slug: string;
  title: string;
  year: number | null;

  synopsis: string | null;

  releaseDate: string | null;

  posterUrl: string | null;
  backdropUrl: string | null;

  director: string | null;

  status: ContentStatus;

  createdAt: string;
  updatedAt: string;
};

export type Trailer = {
  id: string;
  slug: string;

  movieId: string | null;

  title: string;
  trailerType: TrailerType;

  description: string | null;

  youtubeUrl: string | null;
  youtubeVideoId: string | null;

  thumbnailUrl: string | null;

  status: ContentStatus;

  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Person = {
  id: string;
  slug: string;

  name: string;

  biography: string | null;

  dateOfBirth: string | null;

  profileImageUrl: string | null;

  createdAt: string;
  updatedAt: string;
};