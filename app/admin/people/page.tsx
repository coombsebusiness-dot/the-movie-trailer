import {
  createClient,
} from "@/lib/supabase/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

import PeopleManager from "@/components/admin/people/PeopleManager";

type FeaturedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  featured: boolean;
  status: string;
  sort_order: number;
};

type Actor = {
  id: string;
  slug: string;
  name: string;
  birth_date: string | null;
  birth_place: string | null;
  profile_image_url: string | null;
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

export default async function AdminPeoplePage() {
  const supabase =
    await createClient();

  const {
    data:
      featuredPeopleData,
    error:
      featuredPeopleError,
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
        status,
        sort_order
      `)
      .order(
        "sort_order",
        {
          ascending: true,
        },
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      );

  if (
    featuredPeopleError
  ) {
    console.error(
      "Failed to load featured people:",
      featuredPeopleError,
    );
  }

  const featuredPeople =
    (
      featuredPeopleData ??
      []
    ) as FeaturedPerson[];

  const sourceActorIds =
    featuredPeople.map(
      (
        person,
      ) =>
        person.source_actor_id,
    );

  let actors:
    Actor[] = [];

  if (
    sourceActorIds.length >
    0
  ) {
    const pleaseRewind =
      createPleaseRewindClient();

    const {
      data:
        actorData,
      error:
        actorError,
    } =
      await pleaseRewind
        .from("actors")
        .select(`
          id,
          slug,
          name,
          birth_date,
          birth_place,
          profile_image_url,
          status
        `)
        .in(
          "id",
          sourceActorIds,
        );

    if (
      actorError
    ) {
      console.error(
        "Failed to load Please Rewind actors:",
        actorError,
      );
    }

    actors =
      (
        actorData ??
        []
      ) as Actor[];
  }

  const actorsById =
    new Map(
      actors.map(
        (
          actor,
        ) => [
          actor.id,
          actor,
        ],
      ),
    );

  const activePeople =
    featuredPeople.map(
      (
        person,
      ) => ({
        ...person,
        actor:
          actorsById.get(
            person.source_actor_id,
          ) ??
          null,
      }),
    );

  return (
    <main className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="mb-2 text-xs font-black uppercase tracking-[0.24em] text-red-500">
          People
        </div>

        <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
          Current People
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-white/60">
          Search the Please Rewind actor database and add only the people currently relevant to The Movie Trailer.
        </p>
      </div>

      <PeopleManager
        initialPeople={
          activePeople
        }
      />
    </main>
  );
}