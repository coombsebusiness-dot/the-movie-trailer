import {
  notFound,
} from "next/navigation";

import TrailerEditor from "@/components/admin/trailers/TrailerEditor";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

type EditTrailerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTrailerPage({
  params,
}: EditTrailerPageProps) {
  const {
    id,
  } =
    await params;

  const supabase =
    createAdminClient();

  const {
    data: trailer,
    error,
  } =
    await supabase
      .from("trailers")
      .select(
        `
          id,
          title,
          slug,
          trailer_type,
          description,
          youtube_url,
          youtube_video_id,
          thumbnail_url,
          status,
          published_at
        `,
      )
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (
    error ||
    !trailer
  ) {
    notFound();
  }

  return (
    <TrailerEditor
      initialData={{
        id:
          trailer.id,

        title:
          trailer.title,

        slug:
          trailer.slug,

        trailerType:
          trailer.trailer_type,

        description:
          trailer.description ??
          "",

        youtubeUrl:
          trailer.youtube_url,

        youtubeVideoId:
          trailer.youtube_video_id,

        thumbnailUrl:
          trailer.thumbnail_url ??
          "",

        status:
          trailer.status,

        publishedAt:
          trailer.published_at,
      }}
    />
  );
}