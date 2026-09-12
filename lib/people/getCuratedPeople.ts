import {
  createClient,
} from "@/lib/supabase/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

export type CuratedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  name: string;
  profile_image_url:
    string | null;
};

type FeaturedPersonRow = {
  id: string;
  source_actor_id: string;
  slug: string;
};

type ActorRow = {
  id: string;
  name: string;
  profile_image_url:
    string | null;
};

export async function getCuratedPeople(): Promise<
  CuratedPerson[]
> {
  const supabase =
    await createClient();

  const {
    data: featuredPeopleData,
    error: featuredPeopleError,
  } = await supabase
    .from(
      "featured_people",
    )
    .select(`
      id,
      source_actor_id,
      slug
    `)
    .eq(
      "status",
      "active",
    )
    .order(
      "sort_order",
      {
        ascending: true,
      },
    );

  if (
    featuredPeopleError
  ) {
    console.error(
      "Failed to load curated people:",
      featuredPeopleError,
    );

    return [];
  }

  const featuredPeople =
    (featuredPeopleData ??
      []) as FeaturedPersonRow[];

  const actorIds =
    featuredPeople.map(
      (person) =>
        person.source_actor_id,
    );

  if (
    actorIds.length === 0
  ) {
    return [];
  }

  const pleaseRewind =
    createPleaseRewindClient();

  const {
    data: actorData,
    error: actorError,
  } = await pleaseRewind
    .from(
      "actors",
    )
    .select(`
      id,
      name,
      profile_image_url
    `)
    .in(
      "id",
      actorIds,
    );

  if (actorError) {
    console.error(
      "Failed to load curated actor profiles:",
      actorError,
    );

    return [];
  }

  const actors =
    (actorData ??
      []) as ActorRow[];

  const actorMap =
    new Map(
      actors.map(
        (actor) => [
          actor.id,
          actor,
        ],
      ),
    );

  return featuredPeople
    .map(
      (person) => {
        const actor =
          actorMap.get(
            person.source_actor_id,
          );

        if (!actor) {
          return null;
        }

        return {
          id:
            person.id,
          source_actor_id:
            person.source_actor_id,
          slug:
            person.slug,
          name:
            actor.name,
          profile_image_url:
            actor.profile_image_url,
        };
      },
    )
    .filter(
      (
        person,
      ): person is CuratedPerson =>
        person !== null,
    );
}