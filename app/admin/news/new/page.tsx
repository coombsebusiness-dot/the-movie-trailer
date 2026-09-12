import NewsEditor from "@/components/admin/news/NewsEditor";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

export default async function NewNewsPage() {
  const curatedPeople =
    await getCuratedPeople();

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          News Desk
        </p>

        <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.05em]">
          New Story
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/45">
          Create a new movie or TV news story for The Movie Trailer.
        </p>
      </div>

      <NewsEditor
        curatedPeople={
          curatedPeople
        }
      />
    </div>
  );
}