export type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  status: string;

  hero_image_url: string | null;

  published_at: string | null;
  created_at: string;
  updated_at: string;

  seo_title: string | null;
  seo_description: string | null;

  source_name: string | null;
  source_url: string | null;
};

export type MovieRow = {
  id: string;
  slug: string;
  title: string;
  year: number | null;

  synopsis: string | null;

  release_date: string | null;

  poster_url: string | null;
  backdrop_url: string | null;

  director: string | null;

  status: string;

  created_at: string;
  updated_at: string;
};

export type TrailerRow = {
  id: string;
  slug: string;

  movie_id: string | null;

  title: string;
  trailer_type: string;

  description: string | null;

  youtube_url: string | null;
  youtube_video_id: string | null;

  thumbnail_url: string | null;

  status: string;

  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PersonRow = {
  id: string;
  slug: string;

  name: string;

  biography: string | null;

  date_of_birth: string | null;

  profile_image_url: string | null;

  created_at: string;
  updated_at: string;
};