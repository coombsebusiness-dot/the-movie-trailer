import {
  notFound,
} from "next/navigation";

import MovieEditor, {
  type MovieEditorInitialMovie,
} from "@/components/admin/movies/MovieEditor";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditMoviePage({
  params,
}: PageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

    const curatedPeople =
  await getCuratedPeople();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "movies",
      )
      .select(`
        id,
        slug,
        title,
        year,
        synopsis,
        release_date,
        poster_url,
        backdrop_url,
        director,
        status,
        genre,
        tagline,
        intro,
        runtime,
        certification,
        studio,
        distributor,
        cast_members,
        sections,
        sidebar_quote,
        seo_title,
        meta_description,
        published_at,
        is_featured
      `)
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (
  error ||
  !data
) {
  notFound();
}

const {
  data: moviePeople,
  error: moviePeopleError,
} = await supabase
  .from(
    "movie_people",
  )
  .select(
    "person_id",
  )
  .eq(
    "movie_id",
    id,
  );

if (
  moviePeopleError
) {
  throw new Error(
    `Failed to load movie people: ${moviePeopleError.message}`,
  );
}

const initialPersonIds =
  (
    moviePeople ?? []
  ).map(
    (
      relationship,
    ) =>
      relationship.person_id,
  );

const movie:
  MovieEditorInitialMovie =
  {
    
      id:
        data.id,

      slug:
        data.slug,

      title:
        data.title,

      year:
        data.year,

      synopsis:
        data.synopsis,

      release_date:
        data.release_date,

      poster_url:
        data.poster_url,

      backdrop_url:
        data.backdrop_url,

      director:
        data.director,

      status:
        data.status ===
        "published"
          ? "published"
          : "draft",

      genre:
        data.genre,

      tagline:
        data.tagline,

      intro:
        data.intro,

      runtime:
        data.runtime,

      certification:
        data.certification,

      studio:
        data.studio,

      distributor:
        data.distributor,

      cast_members:
        Array.isArray(
          data.cast_members,
        )
          ? data.cast_members
          : [],

      sections:
        Array.isArray(
          data.sections,
        )
          ? (data.sections as MovieEditorInitialMovie["sections"])
          : [],

      sidebar_quote:
        data.sidebar_quote,

      seo_title:
        data.seo_title,

      meta_description:
        data.meta_description,

      published_at:
        data.published_at,

      is_featured:
        data.is_featured,
    };


    return (
       <MovieEditor
    initialMovie={
      movie
    }
    curatedPeople={
      curatedPeople
    }
    initialPersonIds={
      initialPersonIds
    }
  />
    );
  }