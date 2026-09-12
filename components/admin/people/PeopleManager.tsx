"use client";

import {
  useMemo,
  useState,
} from "react";

type Actor = {
  id: string;
  slug: string;
  name: string;
  birth_date: string | null;
  birth_place: string | null;
  profile_image_url: string | null;
  status: string;
};

type ActivePerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  featured: boolean;
  status: string;
  sort_order: number;
  actor: Actor | null;
};

type SearchResponse = {
  success: boolean;
  actors?: Actor[];
  error?: string;
};

type AddResponse = {
  success: boolean;
  person?: {
    id: string;
    source_actor_id: string;
    slug: string;
    featured: boolean;
    status: string;
    sort_order: number;
  };
  actor?: {
    id: string;
    slug: string;
    name: string;
  };
  error?: string;
};

type PeopleManagerProps = {
  initialPeople:
    ActivePerson[];
};

export default function PeopleManager({
  initialPeople,
}: PeopleManagerProps) {
  const [
    people,
    setPeople,
  ] =
    useState<
      ActivePerson[]
    >(initialPeople);

  const [
    query,
    setQuery,
  ] =
    useState("");

  const [
    results,
    setResults,
  ] =
    useState<
      Actor[]
    >([]);

  const [
    searching,
    setSearching,
  ] =
    useState(false);

  const [
    busyActorId,
    setBusyActorId,
  ] =
    useState<
      string | null
    >(null);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const activeActorIds =
    useMemo(
      () =>
        new Set(
          people.map(
            (
              person,
            ) =>
              person.source_actor_id,
          ),
        ),
      [
        people,
      ],
    );

  async function searchPeople() {
    const trimmed =
      query.trim();

    if (
      trimmed.length <
      2
    ) {
      setResults([]);
      setMessage(
        "Enter at least two characters.",
      );

      return;
    }

    setSearching(true);
    setMessage("");

    try {
      const response =
        await fetch(
          `/api/admin/people/search?q=${encodeURIComponent(
            trimmed,
          )}`,
        );

      const data =
        (
          await response.json()
        ) as SearchResponse;

      if (
        !response.ok ||
        !data.success
      ) {
        setMessage(
          data.error ??
            "Search failed.",
        );

        return;
      }

      setResults(
        data.actors ??
          [],
      );
    } catch (error) {
      console.error(
        "People search failed:",
        error,
      );

      setMessage(
        "Search failed.",
      );
    } finally {
      setSearching(false);
    }
  }

  async function addPerson(
    actor: Actor,
  ) {
    setBusyActorId(
      actor.id,
    );

    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/people",
          {
            method:
              "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                sourceActorId:
                  actor.id,
              }),
          },
        );

      const data =
        (
          await response.json()
        ) as AddResponse;

      if (
        !response.ok ||
        !data.success ||
        !data.person
      ) {
        setMessage(
          data.error ??
            "Could not add person.",
        );

        return;
      }

      setPeople(
        (
          current,
        ) => [
          {
            ...data.person!,
            actor,
          },
          ...current,
        ],
      );

      setMessage(
        `${actor.name} added to The Movie Trailer.`,
      );
    } catch (error) {
      console.error(
        "Add person failed:",
        error,
      );

      setMessage(
        "Could not add person.",
      );
    } finally {
      setBusyActorId(
        null,
      );
    }
  }

  async function removePerson(
    person: ActivePerson,
  ) {
    setBusyActorId(
      person.source_actor_id,
    );

    setMessage("");

    try {
      const response =
        await fetch(
          `/api/admin/people?id=${encodeURIComponent(
            person.id,
          )}`,
          {
            method:
              "DELETE",
          },
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        setMessage(
          data.error ??
            "Could not remove person.",
        );

        return;
      }

      setPeople(
        (
          current,
        ) =>
          current.filter(
            (
              item,
            ) =>
              item.id !==
              person.id,
          ),
      );

      setMessage(
        `${person.actor?.name ?? person.slug} removed from The Movie Trailer.`,
      );
    } catch (error) {
      console.error(
        "Remove person failed:",
        error,
      );

      setMessage(
        "Could not remove person.",
      );
    } finally {
      setBusyActorId(
        null,
      );
    }
  }
  async function toggleFeatured(
  person: ActivePerson,
) {
  setBusyActorId(
    person.source_actor_id,
  );

  setMessage("");

  const nextFeatured =
    !person.featured;

  try {
    const response =
      await fetch(
        "/api/admin/people",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              id: person.id,
              featured:
                nextFeatured,
            }),
        },
      );

    const data =
      await response.json();

    if (
      !response.ok ||
      !data.success
    ) {
      setMessage(
        data.error ??
          "Could not update featured status.",
      );

      return;
    }

    setPeople(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            person.id
              ? {
                  ...item,
                  featured:
                    nextFeatured,
                }
              : item,
        ),
    );

    setMessage(
      nextFeatured
        ? `${person.actor?.name ?? person.slug} is now featured on the homepage.`
        : `${person.actor?.name ?? person.slug} has been removed from homepage features.`,
    );
  } catch (error) {
    console.error(
      "Featured update failed:",
      error,
    );

    setMessage(
      "Could not update featured status.",
    );
  } finally {
    setBusyActorId(
      null,
    );
  }
}
async function movePerson(
  person: ActivePerson,
  direction: "up" | "down",
) {
  const currentIndex =
    people.findIndex(
      (item) =>
        item.id ===
        person.id,
    );

  if (
    currentIndex === -1
  ) {
    return;
  }

  const targetIndex =
    direction === "up"
      ? currentIndex - 1
      : currentIndex + 1;

  if (
    targetIndex < 0 ||
    targetIndex >=
      people.length
  ) {
    return;
  }

  const targetPerson =
    people[targetIndex];

  setBusyActorId(
    person.source_actor_id,
  );

  setMessage("");

  try {
    const currentSortOrder =
      person.sort_order;

    const targetSortOrder =
      targetPerson.sort_order;

    const firstResponse =
      await fetch(
        "/api/admin/people",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              id:
                person.id,
              sortOrder:
                targetSortOrder,
            }),
        },
      );

    const firstData =
      await firstResponse.json();

    if (
      !firstResponse.ok ||
      !firstData.success
    ) {
      setMessage(
        firstData.error ??
          "Could not reorder people.",
      );

      return;
    }

    const secondResponse =
      await fetch(
        "/api/admin/people",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body:
            JSON.stringify({
              id:
                targetPerson.id,
              sortOrder:
                currentSortOrder,
            }),
        },
      );

    const secondData =
      await secondResponse.json();

    if (
      !secondResponse.ok ||
      !secondData.success
    ) {
      setMessage(
        secondData.error ??
          "Could not reorder people.",
      );

      return;
    }

    setPeople(
      (current) => {
        const next =
          [...current];

        const temp =
          next[currentIndex];

        next[currentIndex] =
          next[targetIndex];

        next[targetIndex] =
          temp;

        return next.map(
          (item, index) => ({
            ...item,
            sort_order:
              index,
          }),
        );
      },
    );

    setMessage(
      `${person.actor?.name ?? person.slug} moved ${direction}.`,
    );
  } catch (error) {
    console.error(
      "Reorder people failed:",
      error,
    );

    setMessage(
      "Could not reorder people.",
    );
  } finally {
    setBusyActorId(
      null,
    );
  }
}

  return (
    <div className="space-y-10">
      <section className="border border-white/10 bg-white/[0.02] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-xl font-black text-white">
            Find People
          </h2>

          <p className="mt-1 text-sm text-white/50">
            Search the Please Rewind database.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={
              query
            }
            onChange={(
              event,
            ) =>
              setQuery(
                event.target.value,
              )
            }
            onKeyDown={(
              event,
            ) => {
              if (
                event.key ===
                "Enter"
              ) {
                void searchPeople();
              }
            }}
            placeholder="Search actors..."
            className="min-h-12 flex-1 border border-white/10 bg-black px-4 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-500"
          />

          <button
            type="button"
            onClick={() =>
              void searchPeople()
            }
            disabled={
              searching
            }
            className="min-h-12 bg-red-600 px-6 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-red-500 disabled:opacity-50"
          >
            {searching
              ? "Searching..."
              : "Search"}
          </button>
        </div>

        {message ? (
          <div className="mt-4 text-sm text-white/60">
            {message}
          </div>
        ) : null}

        {results.length >
        0 ? (
          <div className="mt-6 grid gap-3">
            {results.map(
              (
                actor,
              ) => {
                const alreadyAdded =
                  activeActorIds.has(
                    actor.id,
                  );

                return (
                  <div
                    key={
                      actor.id
                    }
                    className="flex items-center gap-4 border border-white/10 bg-black/50 p-3"
                  >
                    <div className="h-20 w-16 shrink-0 overflow-hidden bg-white/5">
                      {actor.profile_image_url ? (
                        <img
                          src={
                            actor.profile_image_url
                          }
                          alt={
                            actor.name
                          }
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-white/20">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-black text-white">
                        {
                          actor.name
                        }
                      </div>

                      <div className="mt-1 text-xs text-white/45">
                        {actor.birth_place ??
                          "Birthplace unavailable"}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={
                        alreadyAdded ||
                        busyActorId ===
                          actor.id
                      }
                      onClick={() =>
                        void addPerson(
                          actor,
                        )
                      }
                      className="border border-red-500 px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-red-400 transition hover:bg-red-500 hover:text-white disabled:border-white/10 disabled:text-white/30"
                    >
                      {alreadyAdded
                        ? "Added"
                        : busyActorId ===
                            actor.id
                          ? "Adding..."
                          : "Add to TMT"}
                    </button>
                  </div>
                );
              },
            )}
          </div>
        ) : null}
      </section>

      <section>
        <div className="mb-5">
          <div className="text-xs font-black uppercase tracking-[0.2em] text-red-500">
            Curated Roster
          </div>

          <h2 className="mt-1 text-2xl font-black text-white">
            Active People
          </h2>
        </div>

        {people.length ===
        0 ? (
          <div className="border border-dashed border-white/10 p-8 text-center text-sm text-white/40">
            No people have been added yet.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {people.map(
              (
                person,
              ) => (
                <div
                  key={
                    person.id
                  }
                  className="flex gap-4 border border-white/10 bg-white/[0.02] p-4"
                >
                  <div className="h-28 w-20 shrink-0 overflow-hidden bg-white/5">
                    {person.actor?.profile_image_url ? (
                      <img
                        src={
                          person.actor.profile_image_url
                        }
                        alt={
                          person.actor.name
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="font-black text-white">
                      {person.actor?.name ??
                        person.slug}
                    </div>

                    <div className="mt-1 text-xs uppercase tracking-[0.12em] text-white/35">
                      {
                        person.status
                      }
                    </div>

                    <div className="flex items-center gap-2">
  <button
    type="button"
    disabled={
      busyActorId ===
        person.source_actor_id ||
      people.findIndex(
        (item) =>
          item.id ===
          person.id,
      ) === 0
    }
    onClick={() =>
      void movePerson(
        person,
        "up",
      )
    }
    className="border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-20"
    aria-label={`Move ${person.actor?.name ?? person.slug} up`}
  >
    ↑
  </button>

  <button
    type="button"
    disabled={
      busyActorId ===
        person.source_actor_id ||
      people.findIndex(
        (item) =>
          item.id ===
          person.id,
      ) ===
        people.length - 1
    }
    onClick={() =>
      void movePerson(
        person,
        "down",
      )
    }
    className="border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60 transition hover:border-red-500 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-20"
    aria-label={`Move ${person.actor?.name ?? person.slug} down`}
  >
    ↓
  </button>
</div>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
  <button
    type="button"
    disabled={
      busyActorId ===
      person.source_actor_id
    }
    onClick={() =>
      void toggleFeatured(
        person,
      )
    }
    className={
      person.featured
        ? "border border-red-500 bg-red-600 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white transition hover:bg-red-500 disabled:opacity-40"
        : "border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/60 transition hover:border-red-500 hover:text-red-400 disabled:opacity-40"
    }
  >
    {busyActorId ===
    person.source_actor_id
      ? "Updating..."
      : person.featured
        ? "★ Featured"
        : "☆ Feature on Homepage"}
  </button>

  <button
    type="button"
    disabled={
      busyActorId ===
      person.source_actor_id
    }
    onClick={() =>
      void removePerson(
        person,
      )
    }
    className="text-xs font-black uppercase tracking-[0.12em] text-red-400 hover:text-red-300 disabled:opacity-40"
  >
    Remove
  </button>
</div>
                  </div>
                </div>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}