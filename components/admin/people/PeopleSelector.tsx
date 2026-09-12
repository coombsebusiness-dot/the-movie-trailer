"use client";

import {
  useMemo,
  useState,
} from "react";

export type CuratedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  name: string;
  profile_image_url: string | null;
};

type PeopleSelectorProps = {
  people: CuratedPerson[];
  selectedPersonIds: string[];
  onToggle: (
    personId: string,
  ) => void;
  description?: string;
};

function getMatchScore(
  name: string,
  query: string,
) {
  const normalizedName =
    name
      .trim()
      .toLowerCase();

  const normalizedQuery =
    query
      .trim()
      .toLowerCase();

  if (!normalizedQuery) {
    return 0;
  }

  /*
   * Exact full-name match.
   */
  if (
    normalizedName ===
    normalizedQuery
  ) {
    return 120;
  }

  /*
   * Full name begins with
   * what Lee is typing.
   */
  if (
    normalizedName.startsWith(
      normalizedQuery,
    )
  ) {
    return 100;
  }

  /*
   * Any individual name begins
   * with the query.
   *
   * "dam" therefore brings
   * Matt Damon to the top.
   */
  const words =
    normalizedName.split(
      /\s+/,
    );

  if (
    words.some(
      (word) =>
        word.startsWith(
          normalizedQuery,
        ),
    )
  ) {
    return 80;
  }

  /*
   * Match anywhere else.
   */
  if (
    normalizedName.includes(
      normalizedQuery,
    )
  ) {
    return 60;
  }

  return 0;
}

export default function PeopleSelector({
  people,
  selectedPersonIds,
  onToggle,
  description = "Attach curated people who are directly featured in this content.",
}: PeopleSelectorProps) {
  const [
    search,
    setSearch,
  ] = useState("");

  const rankedPeople =
    useMemo(() => {
      return [
        ...people,
      ].sort(
        (
          a,
          b,
        ) => {
          const aScore =
            getMatchScore(
              a.name,
              search,
            );

          const bScore =
            getMatchScore(
              b.name,
              search,
            );

          if (
            aScore !==
            bScore
          ) {
            return (
              bScore -
              aScore
            );
          }

          /*
           * When search relevance
           * is equal, keep selected
           * people near the top.
           */
          const aSelected =
            selectedPersonIds.includes(
              a.id,
            );

          const bSelected =
            selectedPersonIds.includes(
              b.id,
            );

          if (
            aSelected !==
            bSelected
          ) {
            return aSelected
              ? -1
              : 1;
          }

          return a.name.localeCompare(
            b.name,
          );
        },
      );
    }, [
      people,
      search,
      selectedPersonIds,
    ]);

  return (
    <section className="border border-white/10 bg-[#0b0d0f] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            People
          </p>

          <p className="mt-2 text-xs leading-5 text-white/40">
            {description}
          </p>
        </div>

        <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
          {
            selectedPersonIds.length
          }{" "}
          selected
        </span>
      </div>

      {people.length > 0 ? (
        <>
          <div className="mt-5">
            <input
              type="search"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search people..."
              className="w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#f21f2b]"
            />
          </div>

          <div className="mt-3 max-h-[430px] space-y-2 overflow-y-auto overscroll-contain pr-2">
            {rankedPeople.map(
              (person) => {
                const isSelected =
                  selectedPersonIds.includes(
                    person.id,
                  );

                return (
                  <button
                    key={
                      person.id
                    }
                    type="button"
                    onClick={() =>
                      onToggle(
                        person.id,
                      )
                    }
                    className={`flex w-full items-center gap-3 border px-3 py-3 text-left transition ${
                      isSelected
                        ? "border-[#f21f2b] bg-[#f21f2b]/10"
                        : "border-white/10 bg-black hover:border-white/25"
                    }`}
                  >
                    {person.profile_image_url ? (
                      <img
                        src={
                          person.profile_image_url
                        }
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-black text-white/30">
                        {person.name
                          .slice(
                            0,
                            1,
                          )
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-black text-white">
                        {
                          person.name
                        }
                      </p>

                      <p className="mt-1 truncate text-[10px] uppercase tracking-[0.08em] text-white/35">
                        /people/
                        {
                          person.slug
                        }
                      </p>
                    </div>

                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] font-black ${
                        isSelected
                          ? "border-[#f21f2b] bg-[#f21f2b] text-white"
                          : "border-white/20 text-transparent"
                      }`}
                    >
                      ✓
                    </div>
                  </button>
                );
              },
            )}
          </div>
        </>
      ) : (
        <div className="mt-5 border border-dashed border-white/10 bg-black/40 px-4 py-5">
          <p className="text-xs leading-5 text-white/35">
            No curated people have
            been added yet.
          </p>
        </div>
      )}
    </section>
  );
}