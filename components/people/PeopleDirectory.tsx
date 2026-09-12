"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";
import Link from "next/link";

export type PersonCard = {
  id: string;
  slug: string;
  name: string;
  birth_date: string | null;
  birth_place: string | null;
  bio: string | null;
  profile_image_url: string | null;
  featured: boolean;
  sort_order: number;
};

function getShortBio(
  value: string | null,
) {
  if (!value) {
    return "";
  }

  const plainText = value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= 150) {
    return plainText;
  }

  return `${plainText
    .slice(0, 147)
    .trim()}...`;
}

export default function PeopleDirectory({
  people,
}: {
  people: PersonCard[];
}) {
  const [
    search,
    setSearch,
  ] = useState("");

  const filteredPeople =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return people;
      }

      return people.filter(
        (person) =>
          person.name
            .toLowerCase()
            .includes(query) ||
          (
            person.birth_place ??
            ""
          )
            .toLowerCase()
            .includes(query),
      );
    }, [
      people,
      search,
    ]);

  return (
    <>
      <div className="border-b border-white/10 py-8">
        <label
          htmlFor="people-search"
          className="mb-3 block text-xs font-black uppercase tracking-[0.22em] text-red-500"
        >
          Find People
        </label>

        <div className="relative max-w-2xl">
          <input
            id="people-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value,
              )
            }
            placeholder="Search actors and filmmakers..."
            autoComplete="off"
            className="w-full border border-white/15 bg-white/[0.03] px-5 py-4 pr-14 text-base font-bold text-white outline-none transition placeholder:font-normal placeholder:text-white/25 focus:border-red-600 focus:bg-white/[0.05]"
          />

          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="pointer-events-none absolute right-5 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </div>

        {search ? (
          <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-white/35">
            {filteredPeople.length}{" "}
            {filteredPeople.length ===
            1
              ? "result"
              : "results"}{" "}
            for &ldquo;{search}&rdquo;
          </p>
        ) : null}
      </div>

      <section className="py-10 sm:py-12">
        <div className="mb-7 flex items-end justify-between gap-6 border-b border-white/10 pb-4">
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-[0.25em] text-red-500">
              In Focus
            </p>

            <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
              Current People
            </h2>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            {filteredPeople.length}{" "}
            {filteredPeople.length ===
            1
              ? "Person"
              : "People"}
          </p>
        </div>

        {filteredPeople.length ===
        0 ? (
          <div className="border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-white/50">
              No people found
            </p>

            <p className="mt-3 text-sm text-white/35">
              Try another name.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
            {filteredPeople.map(
              (person) => (
                <article
                  key={person.id}
                  className="group"
                >
                  <Link
                    href={`/people/${person.slug}`}
                    className="block"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                      {person.profile_image_url ? (
                        <Image
                          src={
                            person.profile_image_url
                          }
                          alt={
                            person.name
                          }
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-5 text-center text-xs font-black uppercase tracking-[0.18em] text-white/25">
                          No Image
                        </div>
                      )}

                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

                      {person.featured ? (
                        <span className="absolute left-3 top-3 bg-red-600 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                          Trending
                        </span>
                      ) : null}
                    </div>

                    <div className="pt-4">
                      <h2 className="text-lg font-black uppercase leading-tight tracking-[-0.02em] text-white transition group-hover:text-red-500 sm:text-xl">
                        {person.name}
                      </h2>

                      {person.birth_place ? (
                        <p className="mt-2 line-clamp-1 text-xs font-bold uppercase tracking-[0.12em] text-white/35">
                          {
                            person.birth_place
                          }
                        </p>
                      ) : null}

                      {person.bio ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">
                          {getShortBio(
                            person.bio,
                          )}
                        </p>
                      ) : null}

                      <span className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-red-500">
                        View Profile
                        <span
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </span>
                    </div>
                  </Link>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </>
  );
}