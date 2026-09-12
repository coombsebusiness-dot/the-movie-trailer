import Image from "next/image";

import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

type FeaturedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  sort_order: number;
};

type Actor = {
  id: string;
  name: string;
  profile_image_url: string | null;
  birth_place: string | null;
};

type TrendingPerson = {
  id: string;
  slug: string;
  name: string;
  profile_image_url: string | null;
  birth_place: string | null;
  sort_order: number;
};

export default async function TrendingPeople() {
  const supabase =
    await createClient();

  const {
    data: featuredData,
    error: featuredError,
  } = await supabase
    .from("featured_people")
    .select(`
      id,
      source_actor_id,
      slug,
      sort_order
    `)
    .eq(
      "status",
      "active",
    )
    .eq(
      "featured",
      true,
    )
    .order(
      "sort_order",
      {
        ascending: true,
      },
    )
    .limit(6);

  if (featuredError) {
    console.error(
      "Failed to load trending people:",
      featuredError,
    );

    return null;
  }

  const featuredPeople =
    (
      featuredData ??
      []
    ) as FeaturedPerson[];

  if (
    featuredPeople.length === 0
  ) {
    return null;
  }

  const actorIds =
    featuredPeople.map(
      (
        person,
      ) =>
        person.source_actor_id,
    );

  const pleaseRewind =
    createPleaseRewindClient();

  const {
    data: actorData,
    error: actorError,
  } = await pleaseRewind
    .from("actors")
    .select(`
      id,
      name,
      profile_image_url,
      birth_place
    `)
    .in(
      "id",
      actorIds,
    )
    .eq(
      "status",
      "published",
    );

  if (actorError) {
    console.error(
      "Failed to load trending actor profiles:",
      actorError,
    );

    return null;
  }

  const actors =
    (
      actorData ??
      []
    ) as Actor[];

  const actorMap =
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

  const people =
    featuredPeople
      .map(
        (
          featuredPerson,
        ) => {
          const actor =
            actorMap.get(
              featuredPerson
                .source_actor_id,
            );

          if (!actor) {
            return null;
          }

          return {
            id:
              featuredPerson.id,

            slug:
              featuredPerson.slug,

            name:
              actor.name,

            profile_image_url:
              actor.profile_image_url,

            birth_place:
              actor.birth_place,

            sort_order:
              featuredPerson.sort_order,
          };
        },
      )
      .filter(
        (
          person,
        ): person is TrendingPerson =>
          person !== null,
      );

  if (
    people.length === 0
  ) {
    return null;
  }

  return (
    <section className="site-shell section-rule py-9">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
            In Focus
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] text-white">
            Trending People
          </h2>
        </div>

        <Link
          href="/people"
          className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
        >
          View All People →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {people.map(
          (
            person,
            index,
          ) => (
            <Link
              key={
                person.id
              }
              href={`/people/${person.slug}`}
              className="group block"
            >
              <article className="relative overflow-hidden border border-white/10 bg-[#090b0d]">
                <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                  {person.profile_image_url ? (
                    <Image
                      src={
                        person.profile_image_url
                      }
                      alt={
                        person.name
                      }
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center px-5 text-center text-xs font-black uppercase tracking-[0.16em] text-white/25">
                      No Image
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                  <div className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center border border-white/15 bg-black/65 text-[9px] font-black text-white/55 backdrop-blur-sm">
                    {String(
                      index +
                        1,
                    ).padStart(
                      2,
                      "0",
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.17em] text-[#f21f2b]">
                    Trending
                  </p>

                  <h3 className="mt-2 text-lg font-black leading-tight tracking-[-0.03em] text-white transition group-hover:text-[#f21f2b]">
                    {
                      person.name
                    }
                  </h3>

                  {person.birth_place ? (
                    <p className="mt-2 line-clamp-1 text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">
                      {
                        person.birth_place
                      }
                    </p>
                  ) : null}

                  <div className="mt-4 border-t border-white/10 pt-3">
                    <span className="text-[9px] font-black uppercase tracking-[0.12em] text-white/30 transition group-hover:text-white">
                      View Profile →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}