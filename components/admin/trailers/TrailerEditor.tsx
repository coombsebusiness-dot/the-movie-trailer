"use client";

import Image from "next/image";
import {
  useRouter,
} from "next/navigation";
import {
  useMemo,
  useState,
} from "react";

type TrailerType =
  | "teaser"
  | "official-trailer"
  | "final-trailer"
  | "clip"
  | "featurette";

type TrailerStatus =
  | "draft"
  | "published";

type TrailerEditorProps = {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    trailerType: TrailerType;
    description: string;
    youtubeUrl: string;
    youtubeVideoId: string;
    thumbnailUrl: string;
    status: TrailerStatus;
    publishedAt: string | null;
  };
};

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /['’]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function getYouTubeVideoId(
  value: string,
) {
  if (!value.trim()) {
    return "";
  }

  try {
    const url =
      new URL(
        value.trim(),
      );

    if (
      url.hostname ===
        "youtu.be" ||
      url.hostname ===
        "www.youtu.be"
    ) {
      return url.pathname
        .split("/")
        .filter(Boolean)[0] ??
        "";
    }

    if (
      url.hostname.includes(
        "youtube.com",
      )
    ) {
      const watchId =
        url.searchParams.get(
          "v",
        );

      if (watchId) {
        return watchId;
      }

      const parts =
        url.pathname
          .split("/")
          .filter(Boolean);

      const specialIndex =
        parts.findIndex(
          (
            part,
          ) =>
            part ===
              "embed" ||
            part ===
              "shorts" ||
            part ===
              "live",
        );

      if (
        specialIndex !==
          -1 &&
        parts[
          specialIndex +
            1
        ]
      ) {
        return parts[
          specialIndex +
            1
        ];
      }
    }
  } catch {
    return "";
  }

  return "";
}

function getYouTubeThumbnail(
  videoId: string,
) {
  if (!videoId) {
    return "";
  }

  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export default function TrailerEditor({
  initialData,
}: TrailerEditorProps) {
  const router =
    useRouter();

  const [
    title,
    setTitle,
  ] =
    useState(
      initialData?.title ??
        "",
    );

  const [
    slug,
    setSlug,
  ] =
    useState(
      initialData?.slug ??
        "",
    );

  const [
    slugEdited,
    setSlugEdited,
  ] =
    useState(
      Boolean(
        initialData?.slug,
      ),
    );

  const [
    trailerType,
    setTrailerType,
  ] =
    useState<TrailerType>(
      initialData
        ?.trailerType ??
        "official-trailer",
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      initialData
        ?.description ??
        "",
    );

  const [
    youtubeUrl,
    setYoutubeUrl,
  ] =
    useState(
      initialData
        ?.youtubeUrl ??
        "",
    );

  const [
    youtubeVideoId,
    setYoutubeVideoId,
  ] =
    useState(
      initialData
        ?.youtubeVideoId ??
        "",
    );

  const [
    thumbnailUrl,
    setThumbnailUrl,
  ] =
    useState(
      initialData
        ?.thumbnailUrl ??
        "",
    );

  const [
    currentStatus,
    setCurrentStatus,
  ] =
    useState<TrailerStatus>(
      initialData?.status ??
        "draft",
    );

  const [
    publishedAt,
    setPublishedAt,
  ] =
    useState<
      string | null
    >(
      initialData
        ?.publishedAt ??
        null,
    );

  const [
    isSaving,
    setIsSaving,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const embedUrl =
    useMemo(
      () => {
        if (
          !youtubeVideoId
        ) {
          return "";
        }

        return `https://www.youtube.com/embed/${youtubeVideoId}`;
      },
      [
        youtubeVideoId,
      ],
    );

  function handleTitleChange(
    value: string,
  ) {
    setTitle(
      value,
    );

    if (!slugEdited) {
      setSlug(
        slugify(
          value,
        ),
      );
    }
  }

  function handleYouTubeUrlChange(
    value: string,
  ) {
    setYoutubeUrl(
      value,
    );

    const videoId =
      getYouTubeVideoId(
        value,
      );

    setYoutubeVideoId(
      videoId,
    );

    if (videoId) {
      setThumbnailUrl(
        getYouTubeThumbnail(
          videoId,
        ),
      );
    } else {
      setThumbnailUrl(
        "",
      );
    }
  }

  async function saveTrailer(
    status: TrailerStatus,
  ) {
    if (!title.trim()) {
      setMessage(
        "Trailer title is required.",
      );
      return;
    }

    if (!slug.trim()) {
      setMessage(
        "Trailer slug is required.",
      );
      return;
    }

    if (
      !youtubeUrl.trim() ||
      !youtubeVideoId
    ) {
      setMessage(
        "Please enter a valid YouTube URL.",
      );
      return;
    }

    setMessage(
      "",
    );
    setIsSaving(
      true,
    );

    try {
      const endpoint =
        initialData
          ? `/api/admin/trailers/${initialData.id}`
          : "/api/admin/trailers";

      const response =
        await fetch(
          endpoint,
          {
            method:
              initialData
                ? "PATCH"
                : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  title:
                    title.trim(),

                  slug:
                    slug.trim(),

                  trailerType,

                  description:
                    description.trim(),

                  youtubeUrl:
                    youtubeUrl.trim(),

                  youtubeVideoId,

                  thumbnailUrl,

                  status,
                },
              ),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Failed to save trailer.",
        );
      }

      setCurrentStatus(
        result.trailer
          .status,
      );

      setPublishedAt(
        result.trailer
          .published_at,
      );

      if (!initialData) {
        router.replace(
          `/admin/trailers/${result.trailer.id}/edit`,
        );

        router.refresh();

        return;
      }

      setMessage(
        status ===
          "published"
          ? "Trailer published."
          : currentStatus ===
              "published"
            ? "Trailer unpublished."
            : "Draft saved.",
      );

      router.refresh();
    } catch (
      error
    ) {
      setMessage(
        error instanceof
          Error
          ? error.message
          : "Failed to save trailer.",
      );
    } finally {
      setIsSaving(
        false,
      );
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
          Trailer Editor
        </p>

        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-[-0.045em] text-white">
              {initialData
                ? "Edit Trailer"
                : "New Trailer"}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <span
                className={`text-[10px] font-black uppercase tracking-[0.14em] ${
                  currentStatus ===
                  "published"
                    ? "text-emerald-400"
                    : "text-[#f21f2b]"
                }`}
              >
                {
                  currentStatus
                }
              </span>

              {publishedAt ? (
                <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/25">
                  Published{" "}
                  {new Date(
                    publishedAt,
                  ).toLocaleString(
                    "en-GB",
                    {
                      day:
                        "numeric",
                      month:
                        "short",
                      year:
                        "numeric",
                      hour:
                        "2-digit",
                      minute:
                        "2-digit",
                    },
                  )}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main editor */}
        <div className="space-y-6">
          <section className="border border-white/10 bg-[#0b0d0f] p-6">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
              Trailer Details
            </p>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Title
              </span>

              <input
                value={
                  title
                }
                onChange={(
                  event,
                ) =>
                  handleTitleChange(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="Supergirl Official Trailer"
                className="w-full border border-white/10 bg-black px-4 py-4 text-lg font-bold text-white outline-none focus:border-[#f21f2b]"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Slug
              </span>

              <input
                value={
                  slug
                }
                onChange={(
                  event,
                ) => {
                  setSlugEdited(
                    true,
                  );

                  setSlug(
                    slugify(
                      event
                        .target
                        .value,
                    ),
                  );
                }}
                placeholder="supergirl-official-trailer"
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Trailer Type
              </span>

              <select
                value={
                  trailerType
                }
                onChange={(
                  event,
                ) =>
                  setTrailerType(
                    event
                      .target
                      .value as TrailerType,
                  )
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              >
                <option value="teaser">
                  Teaser
                </option>

                <option value="official-trailer">
                  Official Trailer
                </option>

                <option value="final-trailer">
                  Final Trailer
                </option>

                <option value="clip">
                  Clip
                </option>

                <option value="featurette">
                  Featurette
                </option>
              </select>
            </label>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Description
              </span>

              <textarea
                value={
                  description
                }
                onChange={(
                  event,
                ) =>
                  setDescription(
                    event
                      .target
                      .value,
                  )
                }
                rows={
                  6
                }
                placeholder="Short description of the trailer and what viewers can expect."
                className="w-full resize-y border border-white/10 bg-black px-4 py-4 text-sm leading-7 text-white outline-none focus:border-[#f21f2b]"
              />
            </label>
          </section>

          <section className="border border-white/10 bg-[#0b0d0f] p-6">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
              YouTube
            </p>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                YouTube URL
              </span>

              <input
                value={
                  youtubeUrl
                }
                onChange={(
                  event,
                ) =>
                  handleYouTubeUrlChange(
                    event
                      .target
                      .value,
                  )
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full border border-white/10 bg-black px-4 py-4 text-sm text-white outline-none focus:border-[#f21f2b]"
              />
            </label>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
                  Video ID
                </p>

                <div className="min-h-[45px] border border-white/10 bg-black px-4 py-3 text-xs text-white/50">
                  {youtubeVideoId ||
                    "Waiting for YouTube URL"}
                </div>
              </div>

              <div>
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
                  Thumbnail
                </p>

                <div className="min-h-[45px] truncate border border-white/10 bg-black px-4 py-3 text-xs text-white/50">
                  {thumbnailUrl ||
                    "Generated automatically"}
                </div>
              </div>
            </div>

            {embedUrl ? (
              <div className="mt-6 overflow-hidden border border-white/10 bg-black">
                <div className="aspect-video">
                  <iframe
                    src={
                      embedUrl
                    }
                    title={
                      title ||
                      "Trailer preview"
                    }
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <div className="movie-card-image mt-6 flex aspect-video items-center justify-center border border-white/10">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-white/20">
                  Trailer Preview
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Publishing sidebar */}
        <aside className="space-y-6">
          <section className="border border-white/10 bg-[#0b0d0f] p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
              Publishing
            </p>

            <div className="mt-5 border-y border-white/10 py-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.1em] text-white/35">
                  Status
                </span>

                <span
                  className={`text-[10px] font-black uppercase tracking-[0.12em] ${
                    currentStatus ===
                    "published"
                      ? "text-emerald-400"
                      : "text-[#f21f2b]"
                  }`}
                >
                  {
                    currentStatus
                  }
                </span>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  void saveTrailer(
                    currentStatus ===
                      "published"
                      ? "draft"
                      : "draft",
                  )
                }
                className="border border-white/15 bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving
                  ? "Saving..."
                  : currentStatus ===
                      "published"
                    ? "Unpublish"
                    : "Save Draft"}
              </button>

              <button
                type="button"
                disabled={
                  isSaving
                }
                onClick={() =>
                  void saveTrailer(
                    "published",
                  )
                }
                className="bg-[#f21f2b] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSaving
                  ? "Saving..."
                  : currentStatus ===
                      "published"
                    ? "Save Changes"
                    : "Publish"}
              </button>
            </div>

            {message ? (
              <p className="mt-4 text-xs leading-5 text-white/50">
                {
                  message
                }
              </p>
            ) : null}
          </section>

          <section className="border border-white/10 bg-[#0b0d0f] p-5">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f21f2b]">
              Thumbnail Preview
            </p>

            <div className="movie-card-image relative mt-4 aspect-video overflow-hidden border border-white/10">
              {thumbnailUrl ? (
                <Image
                  src={
                    thumbnailUrl
                  }
                  alt={
                    title
                      ? `${title} thumbnail`
                      : "Trailer thumbnail"
                  }
                  fill
                  unoptimized
                  sizes="340px"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-black uppercase tracking-[0.12em] text-white/20">
                    No Thumbnail
                  </span>
                </div>
              )}

              {thumbnailUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-black/50 text-lg text-white backdrop-blur-sm">
                    ▶
                  </div>
                </div>
              ) : null}
            </div>

            <p className="mt-3 text-[10px] leading-5 text-white/25">
              The thumbnail is generated automatically from the YouTube video ID.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}