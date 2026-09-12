import MovieEditor from "@/components/admin/movies/MovieEditor";

import {
  getCuratedPeople,
} from "@/lib/people/getCuratedPeople";

export default async function NewMoviePage() {
  const curatedPeople =
    await getCuratedPeople();

  return (
    <MovieEditor
      curatedPeople={
        curatedPeople
      }
    />
  );
}