import type {
  Metadata,
} from "next";

import PeopleDirectory, {
  type PersonCard,
} from "@/components/people/PeopleDirectory";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

import BreakingBar from "@/components/site/BreakingBar";
import NewsletterSignup from "@/components/home/NewsletterSignup";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title:
    "People | Actors, Filmmakers & Entertainment Talent",

  description:
    "Explore the actors, filmmakers and entertainment talent currently making headlines on The Movie Trailer.",

  alternates: {
    canonical:
      "/people",
  },

  openGraph: {
    type:
      "website",
    siteName:
      "The Movie Trailer",
    title:
      "People | Actors, Filmmakers & Entertainment Talent | The Movie Trailer",
    description:
      "Explore the actors, filmmakers and entertainment talent currently making headlines on The Movie Trailer.",
    url:
      "/people",
  },

  twitter: {
    card:
      "summary_large_image",
    title:
      "People | Actors, Filmmakers & Entertainment Talent | The Movie Trailer",
    description:
      "Explore the actors, filmmakers and entertainment talent currently making headlines on The Movie Trailer.",
  },
};

type FeaturedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  featured: boolean;
  sort_order: number;
};

type Actor = {
  id: string;
  slug: string;
  name: string;
  birth_date: string | null;
  birth_place: string | null;
  bio: string | null;
  profile_image_url: string | null;
};




export default async function PeoplePage() {
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
      featured,
      sort_order
    `)
    .eq("status", "active")
    .order("featured", {
      ascending: false,
    })
    .order("sort_order", {
      ascending: true,
    });

  if (featuredError) {
    console.error(
      "Failed to load featured people:",
      featuredError,
    );
  }

  const featuredPeople =
    (featuredData ??
      []) as FeaturedPerson[];

  const actorIds =
    featuredPeople.map(
      (person) =>
        person.source_actor_id,
    );

  let people: PersonCard[] = [];

  if (actorIds.length > 0) {
    const pleaseRewind =
      createPleaseRewindClient();

    const {
      data: actorData,
      error: actorError,
    } = await pleaseRewind
      .from("actors")
      .select(`
        id,
        slug,
        name,
        birth_date,
        birth_place,
        bio,
        profile_image_url
      `)
      .in("id", actorIds)
      .eq("status", "published");

    if (actorError) {
      console.error(
        "Failed to load actor profiles:",
        actorError,
      );
    }

    const actors =
      (actorData ?? []) as Actor[];

    const actorMap =
      new Map(
        actors.map(
          (actor) => [
            actor.id,
            actor,
          ],
        ),
      );

    people =
      featuredPeople
        .map((featuredPerson) => {
          const actor =
            actorMap.get(
              featuredPerson
                .source_actor_id,
            );

          if (!actor) {
            return null;
          }

          return {
            id: featuredPerson.id,
            slug:
              featuredPerson.slug,
            name: actor.name,
            birth_date:
              actor.birth_date,
            birth_place:
              actor.birth_place,
            bio: actor.bio,
            profile_image_url:
              actor.profile_image_url,
            featured:
              featuredPerson.featured,
            sort_order:
              featuredPerson.sort_order,
          };
        })
        .filter(
          (
            person,
          ): person is PersonCard =>
            person !== null,
        );
  }

  return (
  <main className="min-h-screen bg-[#050607] text-white">
    <SiteHeader />

    <BreakingBar />

    <div className="site-shell py-10 sm:py-14 lg:py-16">
      <section className="border-b border-white/10 pb-8 sm:pb-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-[2px] w-8 bg-red-600" />
          <span className="text-xs font-black uppercase tracking-[0.28em] text-red-500">
            The Movie Trailer
          </span>
        </div>

        <div className="max-w-4xl">
          <h1 className="text-4xl font-black uppercase tracking-[-0.04em] text-white sm:text-5xl lg:text-7xl">
            People
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-7 text-white/60 sm:text-lg">
            The actors, filmmakers and
            entertainment talent making
            headlines right now.
          </p>
        </div>
      </section>

      <PeopleDirectory people={people} />
    </div>

    <NewsletterSignup />

    <SiteFooter />
  </main>
)}