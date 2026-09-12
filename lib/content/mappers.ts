import type {
  Movie,
  NewsStory,
  Person,
  Trailer,
} from "@/types/content";

import type {
  MovieRow,
  NewsRow,
  PersonRow,
  TrailerRow,
} from "@/types/database";

export function mapNewsRow(
  row: NewsRow,
): NewsStory {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category:
      row.category as NewsStory["category"],
    status:
      row.status as NewsStory["status"],
    heroImageUrl:
      row.hero_image_url,
    publishedAt:
      row.published_at,
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
    seoTitle:
      row.seo_title,
    seoDescription:
      row.seo_description,
    sourceName:
      row.source_name,
    sourceUrl:
      row.source_url,
  };
}

export function mapMovieRow(
  row: MovieRow,
): Movie {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    synopsis:
      row.synopsis,
    releaseDate:
      row.release_date,
    posterUrl:
      row.poster_url,
    backdropUrl:
      row.backdrop_url,
    director:
      row.director,
    status:
      row.status as Movie["status"],
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

export function mapTrailerRow(
  row: TrailerRow,
): Trailer {
  return {
    id: row.id,
    slug: row.slug,
    movieId:
      row.movie_id,
    title: row.title,
    trailerType:
      row.trailer_type as Trailer["trailerType"],
    description:
      row.description,
    youtubeUrl:
      row.youtube_url,
    youtubeVideoId:
      row.youtube_video_id,
    thumbnailUrl:
      row.thumbnail_url,
    status:
      row.status as Trailer["status"],
    publishedAt:
      row.published_at,
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}

export function mapPersonRow(
  row: PersonRow,
): Person {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    biography:
      row.biography,
    dateOfBirth:
      row.date_of_birth,
    profileImageUrl:
      row.profile_image_url,
    createdAt:
      row.created_at,
    updatedAt:
      row.updated_at,
  };
}