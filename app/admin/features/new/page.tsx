import Link from "next/link";

import FeatureEditor from "@/components/admin/features/FeatureEditor";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

export default async function NewFeaturePage() {
  const curatedPeople =
    await getCuratedPeople();

  return (
    <main className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-white/10 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            Features
          </p>

          <h1 className="mt-2 text-3xl font-black uppercase tracking-[-0.04em] text-white sm:text-4xl">
            New Feature
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Create a long-form editorial feature for The Movie Trailer.
          </p>
        </div>

        <Link
          href="/admin/features"
          className="border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
        >
          ← All Features
        </Link>
      </div>

      <FeatureEditor
        curatedPeople={
          curatedPeople
        }
      />
    </main>
  );
}