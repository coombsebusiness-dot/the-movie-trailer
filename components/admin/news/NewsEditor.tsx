"use client";

import {
  useMemo,
  useState,
} from "react";

import Image from "next/image";

import {
  useRouter,
} from "next/navigation";

import AIWriterPanel, {
  type GeneratedArticle,
} from "@/components/admin/news/AIWriterPanel";

import PeopleSelector from "@/components/admin/people/PeopleSelector";

type NewsSection = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  youtubeUrl: string;
};

type PublisherAudioStatus =
  | "idle"
  | "processing"
  | "ready"
  | "failed";

const categories = [
  "movie-news",
  "tv-news",
  "trailers",
  "casting",
  "release-dates",
  "horror",
  "streaming",
  "features",
] as const;

type NewsEditorInitialData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  intro: string;
  category:
    | "movie-news"
    | "tv-news"
    | "trailers"
    | "casting"
    | "release-dates"
    | "horror"
    | "streaming"
    | "features";
  heroImageUrl: string;
  sourceName: string;
  sourceUrl: string;
  seoTitle: string;
  seoDescription: string;
  sections: NewsSection[];
  status:
  | "draft"
  | "published";

publishedAt: string | null;

  publisherAudioArticleId: string | null;
  publisherAudioVoiceId: string | null;
  publisherAudioStatus: string | null;
  publisherAudioEnabled: boolean;
  publisherAudioGeneratedAt: string | null;
};

type CuratedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  name: string;
  profile_image_url: string | null;
};

type NewsEditorProps = {
  initialData?: NewsEditorInitialData;
  curatedPeople?: CuratedPerson[];
  initialPersonIds?: string[];
};

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /['"]/g,
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

export default function NewsEditor({
  initialData,
  curatedPeople = [],
  initialPersonIds = [],
}: NewsEditorProps) {
  const [
  title,
  setTitle,
] =
  useState(
    initialData?.title ?? "",
  );

    const router =
  useRouter();

  const [
  selectedPersonIds,
  setSelectedPersonIds,
] = useState<string[]>(
  initialPersonIds,
);

function togglePerson(
  personId: string,
) {
  setSelectedPersonIds(
    (current) =>
      current.includes(
        personId,
      )
        ? current.filter(
            (id) =>
              id !== personId,
          )
        : [
            ...current,
            personId,
          ],
  );
}

  const [
  currentStatus,
  setCurrentStatus,
] =
  useState<
    "draft" | "published"
  >(
    initialData?.status ??
      "draft",
  );

  const [
  isUploadingImage,
  setIsUploadingImage,
] =
  useState(false);

  const [
  uploadingSectionIndex,
  setUploadingSectionIndex,
] =
  useState<number | null>(
    null,
  );

const [
  publishedAt,
  setPublishedAt,
] =
  useState<string | null>(
    initialData?.publishedAt ??
      null,
  );

  const [
  slug,
  setSlug,
] =
  useState(
    initialData?.slug ?? "",
  );

  const [
  excerpt,
  setExcerpt,
] =
  useState(
    initialData?.excerpt ?? "",
  );

const [
  intro,
  setIntro,
] =
  useState(
    initialData?.intro ?? "",
  );

  const [
  category,
  setCategory,
] =
  useState<
    (typeof categories)[number]
  >(
    initialData?.category ??
      "movie-news",
  );

  const [
  heroImageUrl,
  setHeroImageUrl,
] =
  useState(
    initialData?.heroImageUrl ??
      "",
  );

  const [
  sourceName,
  setSourceName,
] =
  useState(
    initialData?.sourceName ??
      "",
  );

  const [
  sourceUrl,
  setSourceUrl,
] =
  useState(
    initialData?.sourceUrl ??
      "",
  );

  const [
  seoTitle,
  setSeoTitle,
] =
  useState(
    initialData?.seoTitle ??
      "",
  );

  const [
  seoDescription,
  setSeoDescription,
] =
  useState(
    initialData?.seoDescription ??
      "",
  );

  const [
  sections,
  setSections,
] =
  useState<
    NewsSection[]
  >(
    initialData?.sections
      ?.length
      ? initialData.sections.map(
          (section) => ({
            eyebrow:
              section.eyebrow ??
              "",
            headline:
              section.headline ??
              "",
            body:
              section.body ??
              "",
            imageUrl:
              section.imageUrl ??
              "",
            youtubeUrl:
              section.youtubeUrl ??
              "",
          }),
        )
      : [
          {
            eyebrow: "",
            headline: "",
            body: "",
            imageUrl: "",
            youtubeUrl: "",
          },
        ],
  );
  const [
    publisherAudioStatus,
    setPublisherAudioStatus,
  ] =
    useState<PublisherAudioStatus>(
      initialData?.publisherAudioStatus === "ready"
        ? "ready"
        : initialData?.publisherAudioStatus === "processing"
          ? "processing"
          : initialData?.publisherAudioStatus === "failed"
            ? "failed"
            : "idle",
    );

  const [
    publisherAudioArticleId,
    setPublisherAudioArticleId,
  ] =
    useState<string | null>(
      initialData?.publisherAudioArticleId ?? null,

    );

  const [
    publisherAudioMessage,
    setPublisherAudioMessage,
  ] =
    useState(
      initialData?.publisherAudioStatus === "ready"
        ? "Article audio is ready."
        : initialData?.publisherAudioStatus === "processing"
          ? "Article audio is processing."
          : initialData?.publisherAudioStatus === "failed"
            ? "Article audio generation failed."
            : "",
    );

  const [
    publisherAudioEnabled,
    setPublisherAudioEnabled,
  ] =
    useState(
      initialData
        ?.publisherAudioEnabled ??
        false,
    );

  const [
    isUpdatingPublisherAudioEnabled,
    setIsUpdatingPublisherAudioEnabled,
  ] =
    useState(false);

  const [
    isGeneratingAudio,
    setIsGeneratingAudio,
  ] =
    useState(false);

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

  const [
  slugEdited,
  setSlugEdited,
] =
  useState(
    Boolean(initialData),
  );

  const effectiveSlug =
    useMemo(
      () =>
        slugEdited
          ? slug
          : slugify(
              title,
            ),
      [
        slugEdited,
        slug,
        title,
      ],
    );

  function updateSection(
    index: number,
    field: keyof NewsSection,
    value: string,
  ) {
    setSections(
      (
        current,
      ) =>
        current.map(
          (
            section,
            sectionIndex,
          ) =>
            sectionIndex ===
            index
              ? {
                  ...section,
                  [field]:
                    value,
                }
              : section,
        ),
    );
  }

  function addSection() {
    setSections(
      (
        current,
      ) => [
        ...current,
        {
          eyebrow: "",
  headline: "",
  body: "",
  imageUrl: "",
  youtubeUrl: "",
        },
      ],
    );
  }

  function removeSection(
    index: number,
  ) {
    setSections(
      (
        current,
      ) =>
        current.filter(
          (
            _,
            sectionIndex,
          ) =>
            sectionIndex !==
            index,
        ),
    );
  }

  async function uploadHeroImage(
  file: File,
) {
  setMessage("");
  setIsUploadingImage(
    true,
  );

  try {
    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    const response =
      await fetch(
        "/api/admin/news/upload",
        {
          method:
            "POST",
          body:
            formData,
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Image upload failed.",
      );
    }

    setHeroImageUrl(
      result.url,
    );

    setMessage(
      "Hero image uploaded.",
    );
  } catch (
    error
  ) {
    setMessage(
      error instanceof
        Error
        ? error.message
        : "Image upload failed.",
    );
  } finally {
    setIsUploadingImage(
      false,
    );
  }
}

async function uploadSectionImage(
  index: number,
  file: File,
) {
  setMessage("");
  setUploadingSectionIndex(
    index,
  );

  try {
    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    const response =
      await fetch(
        "/api/admin/news/upload",
        {
          method: "POST",
          body: formData,
        },
      );

    const result =
      await response.json();

    if (!response.ok) {
      throw new Error(
        result.error ??
          "Image upload failed.",
      );
    }

    updateSection(
      index,
      "imageUrl",
      result.url,
    );

    setMessage(
      `Section ${index + 1} image uploaded.`,
    );
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Image upload failed.",
    );
  } finally {
    setUploadingSectionIndex(
      null,
    );
  }
}

function applyGeneratedArticle(
  article: GeneratedArticle,
) {
  setTitle(
    article.headline,
  );

  setSlugEdited(true);

  setSlug(
    article.slug,
  );

  setExcerpt(
    article.excerpt,
  );

  setIntro(
    article.intro,
  );

  setCategory(
    article.category,
  );

  setSections(
    article.sections.map(
     (section) => ({
  eyebrow:
    section.eyebrow,

  headline:
    section.heading,

  body:
    section.content,

  imageUrl: "",

  youtubeUrl: "",
}),
    ),
  );

  setSourceName(
    article.sourceName,
  );

  setSourceUrl(
    article.sourceUrl,
  );

  setSeoTitle(
    article.seoTitle,
  );

  setSeoDescription(
    article.metaDescription,
  );

  setMessage(
    "AI article loaded into the editor. Review it before saving or publishing.",
  );
}

  async function waitForPublisherAudio(
    articleId: string,
  ) {
    for (
      let attempt = 0;
      attempt < 120;
      attempt += 1
    ) {
      await new Promise(
        (resolve) =>
          window.setTimeout(
            resolve,
            3000,
          ),
      );

      const response =
        await fetch(
          `/api/admin/publisher-audio?articleId=${encodeURIComponent(
            articleId,
          )}&storyId=${encodeURIComponent(
            initialData!.id,
          )}`,
          {
            cache: "no-store",
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Could not check audio status.",
        );
      }

      if (
        result.status ===
        "ready"
      ) {
        setPublisherAudioStatus(
          "ready",
        );

        setPublisherAudioMessage(
          "Article audio is ready.",
        );

        return;
      }

      if (
        result.status ===
        "failed"
      ) {
        throw new Error(
          result.error ??
            "Audio generation failed.",
        );
      }

      setPublisherAudioStatus(
        "processing",
      );

      setPublisherAudioMessage(
        "Publisher Audio is generating the narration...",
      );
    }

    throw new Error(
      "Audio is still processing. Try again shortly.",
    );
  }

  async function updatePublisherAudioEnabled(
    enabled: boolean,
  ) {
    if (!initialData) {
      return;
    }

    setIsUpdatingPublisherAudioEnabled(
      true,
    );

    try {
      const response =
        await fetch(
          "/api/admin/publisher-audio",
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                storyId:
                  initialData.id,
                enabled,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Could not update player state.",
        );
      }

      setPublisherAudioEnabled(
        result.enabled,
      );

      setPublisherAudioMessage(
        result.enabled
          ? "Article audio is ready and visible on the published story."
          : "Article audio is ready but hidden from readers.",
      );
    } catch (error) {
      setPublisherAudioMessage(
        error instanceof Error
          ? error.message
          : "Could not update player state.",
      );
    } finally {
      setIsUpdatingPublisherAudioEnabled(
        false,
      );
    }
  }

  async function generateArticleAudio() {
    if (!initialData) {
      setPublisherAudioMessage(
        "Save the story before generating audio.",
      );

      return;
    }

    if (
      !title.trim() ||
      !effectiveSlug.trim()
    ) {
      setPublisherAudioMessage(
        "The story needs a title and slug.",
      );

      return;
    }

    setIsGeneratingAudio(
      true,
    );

    setPublisherAudioStatus(
      "processing",
    );

    setPublisherAudioMessage(
      "Sending article to Publisher Audio...",
    );

    try {
      const response =
        await fetch(
          "/api/admin/publisher-audio",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body:
              JSON.stringify({
                storyId:
                  initialData.id,
                title,
                slug:
                  effectiveSlug,
                intro,
                sections,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Could not generate article audio.",
        );
      }

      setPublisherAudioArticleId(
        result.articleId,
      );

      setPublisherAudioMessage(
        "Narration started. Waiting for audio...",
      );

      await waitForPublisherAudio(
        result.articleId,
      );
    } catch (error) {
      setPublisherAudioStatus(
        "failed",
      );

      setPublisherAudioMessage(
        error instanceof Error
          ? error.message
          : "Could not generate article audio.",
      );
    } finally {
      setIsGeneratingAudio(
        false,
      );
    }
  }

  async function saveStory(
    status:
      | "draft"
      | "published",
  ) {
    setMessage("");

    if (
      !title.trim()
    ) {
      setMessage(
        "A title is required.",
      );
      return;
    }

    if (
      !effectiveSlug.trim()
    ) {
      setMessage(
        "A slug is required.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const endpoint =
  initialData
    ? `/api/admin/news/${initialData.id}`
    : "/api/admin/news";

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
    title,
    slug:
      effectiveSlug,
    excerpt:
      excerpt ||
      null,
    category,
    heroImageUrl:
      heroImageUrl ||
      null,
    sourceName:
      sourceName ||
      null,
    sourceUrl:
      sourceUrl ||
      null,
    seoTitle:
      seoTitle ||
      null,
    seoDescription:
      seoDescription ||
      null,
    status,
    body: {
      intro,
      sections,
    },
    personIds:
      selectedPersonIds,
  },
),
    },
  );

      const result =
        await response.json();

      if (
        !response.ok
      ) {
        throw new Error(
          result.error ??
            "Failed to save story.",
        );
      }

      setCurrentStatus(
  status,
);

if (
  status ===
    "published" &&
  !publishedAt
) {
  setPublishedAt(
    new Date().toISOString(),
  );
}

if (
  status ===
    "draft"
) {
  setPublishedAt(
    null,
  );
}

setMessage(
  status ===
    "published"
    ? "Story published."
    : currentStatus ===
        "published"
      ? "Story unpublished and returned to draft."
      : "Draft saved.",
);

      if (
  status === "published"
) {
  router.push(
    `/news/${effectiveSlug}`,
  );
} else {
  router.push(
    `/admin/news/${result.story.id}/edit`,
  );
}
    } catch (
      error
    ) {
      setMessage(
        error instanceof
          Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setIsSaving(
        false,
      );
    }
  }

  return (
  <div className="space-y-8">
    <AIWriterPanel
      onGenerated={
        applyGeneratedArticle
      }
    />

    <div className="grid gap-8 xl:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <section className="border border-white/10 bg-[#0b0d0f] p-6">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Story
          </p>

          <div className="mt-5 space-y-5">
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
                  setTitle(
                    event
                      .target
                      .value,
                  )
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-lg font-bold text-white outline-none transition focus:border-[#f21f2b]"
                placeholder="Story title"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Slug
              </span>

              <input
                value={
                  effectiveSlug
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
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Excerpt
              </span>

              <textarea
                value={
                  excerpt
                }
                onChange={(
                  event,
                ) =>
                  setExcerpt(
                    event
                      .target
                      .value,
                  )
                }
                rows={
                  3
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none transition focus:border-[#f21f2b]"
                placeholder="Short summary for cards and search previews"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
                Intro
              </span>

              <textarea
                value={
                  intro
                }
                onChange={(
                  event,
                ) =>
                  setIntro(
                    event
                      .target
                      .value,
                  )
                }
                rows={
                  6
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-[#f21f2b]"
                placeholder="Opening paragraphs"
              />
            </label>
          </div>
        </section>

        <section className="border border-white/10 bg-[#0b0d0f] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Sections
              </p>

              <p className="mt-2 text-sm text-white/40">
                Build the main article body.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addSection
              }
              className="border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.1em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
            >
              Add Section
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {sections.map(
              (
                section,
                index,
              ) => (
                <div
                  key={
                    index
                  }
                  className="border border-white/10 bg-black p-5"
                >
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <p className="text-xs font-black uppercase tracking-[0.1em] text-white/40">
                      Section{" "}
                      {index +
                        1}
                    </p>

                    {sections.length >
                    1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          removeSection(
                            index,
                          )
                        }
                        className="text-xs font-black uppercase tracking-[0.1em] text-white/35 transition hover:text-[#f21f2b]"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="space-y-4">
                    <input
                      value={
                        section.eyebrow
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSection(
                          index,
                          "eyebrow",
                          event
                            .target
                            .value,
                        )
                      }
                      className="w-full border border-white/10 bg-[#0b0d0f] px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
                      placeholder="Eyebrow"
                    />

                    <input
                      value={
                        section.headline
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSection(
                          index,
                          "headline",
                          event
                            .target
                            .value,
                        )
                      }
                      className="w-full border border-white/10 bg-[#0b0d0f] px-4 py-3 text-base font-bold text-white outline-none transition focus:border-[#f21f2b]"
                      placeholder="Section headline"
                    />

                    <textarea
                      value={
                        section.body
                      }
                      onChange={(
                        event,
                      ) =>
                        updateSection(
                          index,
                          "body",
                          event
                            .target
                            .value,
                        )
                      }
                      rows={
                        8
                      }
                      className="w-full border border-white/10 bg-[#0b0d0f] px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-[#f21f2b]"
                      placeholder="Section body"
                    />
                    <div className="grid gap-4 lg:grid-cols-2">
  <div className="border border-white/10 bg-[#0b0d0f] p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
      Section Image
    </p>

    <p className="mt-2 text-xs leading-5 text-white/30">
      Optional image displayed with this section.
    </p>

    {section.imageUrl ? (
      <div className="mt-4">
        <img
          src={section.imageUrl}
          alt=""
          className="aspect-video w-full object-cover"
        />

        <div className="mt-3 flex items-center gap-3">
          <label className="cursor-pointer border border-white/15 px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/60 transition hover:border-[#f21f2b] hover:text-white">
            Replace Image

            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={
                uploadingSectionIndex ===
                index
              }
              onChange={(event) => {
                const file =
                  event.target
                    .files?.[0];

                if (file) {
                  void uploadSectionImage(
                    index,
                    file,
                  );
                }

                event.currentTarget.value =
                  "";
              }}
            />
          </label>

          <button
            type="button"
            onClick={() =>
              updateSection(
                index,
                "imageUrl",
                "",
              )
            }
            className="text-[10px] font-black uppercase tracking-[0.1em] text-white/35 transition hover:text-[#f21f2b]"
          >
            Remove
          </button>
        </div>
      </div>
    ) : (
      <label className="mt-4 flex cursor-pointer items-center justify-center border border-dashed border-white/15 px-4 py-8 text-xs font-black uppercase tracking-[0.1em] text-white/40 transition hover:border-[#f21f2b] hover:text-white">
        {uploadingSectionIndex ===
        index
          ? "Uploading..."
          : "Upload Image"}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          disabled={
            uploadingSectionIndex ===
            index
          }
          onChange={(event) => {
            const file =
              event.target.files?.[0];

            if (file) {
              void uploadSectionImage(
                index,
                file,
              );
            }

            event.currentTarget.value =
              "";
          }}
        />
      </label>
    )}
  </div>

  <div className="border border-white/10 bg-[#0b0d0f] p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
      YouTube Video
    </p>

    <p className="mt-2 text-xs leading-5 text-white/30">
      Optional YouTube video displayed with this section.
    </p>

    <input
      type="url"
      value={
        section.youtubeUrl
      }
      onChange={(event) =>
        updateSection(
          index,
          "youtubeUrl",
          event.target.value,
        )
      }
      className="mt-4 w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
      placeholder="https://www.youtube.com/watch?v=..."
    />

    {section.youtubeUrl ? (
      <button
        type="button"
        onClick={() =>
          updateSection(
            index,
            "youtubeUrl",
            "",
          )
        }
        className="mt-3 text-[10px] font-black uppercase tracking-[0.1em] text-white/35 transition hover:text-[#f21f2b]"
      >
        Remove Video
      </button>
    ) : null}
  </div>
</div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      <aside className="space-y-6">
        <section className="overflow-hidden border border-[#f21f2b]/35 bg-[#0b0d0f]">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                  Publisher Audio
                </p>

                <h2 className="mt-2 text-lg font-black tracking-tight text-white">
                  Give this article a voice.
                </h2>

                <p className="mt-1 text-xs leading-5 text-white/40">
                  Generate narration directly from the story you are editing.
                </p>
              </div>

              <div
                className={`shrink-0 border px-2.5 py-1.5 text-[9px] font-black uppercase tracking-[0.12em] ${
                  publisherAudioStatus ===
                  "ready"
                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                    : publisherAudioStatus ===
                        "processing"
                      ? "border-[#f21f2b]/40 bg-[#f21f2b]/10 text-[#ff5b65]"
                      : publisherAudioStatus ===
                          "failed"
                        ? "border-red-700/40 bg-red-950/30 text-red-400"
                        : "border-white/10 bg-black text-white/35"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      publisherAudioStatus ===
                      "ready"
                        ? "bg-green-500"
                        : publisherAudioStatus ===
                            "processing"
                          ? "animate-pulse bg-[#f21f2b]"
                          : publisherAudioStatus ===
                              "failed"
                            ? "bg-red-600"
                            : "bg-white/25"
                    }`}
                  />

                  {publisherAudioStatus ===
                  "ready"
                    ? "Ready"
                    : publisherAudioStatus ===
                        "processing"
                      ? "Generating"
                      : publisherAudioStatus ===
                          "failed"
                        ? "Failed"
                        : "Not generated"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5">
            {!initialData ? (
              <div className="mt-4 border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 text-amber-400">
                    ●
                  </span>

                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.12em] text-amber-300">
                      Save draft first
                    </p>

                    <p className="mt-1 text-xs leading-5 text-white/45">
                      Save this story once to create its article URL. Publisher Audio will then be ready to generate narration.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {publisherAudioMessage ? (
              <div
                className={`mt-4 border p-4 ${
                  publisherAudioStatus ===
                  "failed"
                    ? "border-red-700/30 bg-red-950/20"
                    : publisherAudioStatus ===
                        "ready"
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-white/10 bg-black"
                }`}
              >
                <p
                  className={`text-xs leading-5 ${
                    publisherAudioStatus ===
                    "failed"
                      ? "text-red-300"
                      : publisherAudioStatus ===
                          "ready"
                        ? "text-green-300"
                        : "text-white/55"
                  }`}
                >
                  {
                    publisherAudioMessage
                  }
                </p>
              </div>
            ) : null}

            <button
              type="button"
              disabled={
                !initialData ||
                isGeneratingAudio
              }
              onClick={() =>
                void generateArticleAudio()
              }
              className="mt-5 w-full bg-[#f21f2b] px-4 py-3.5 text-xs font-black uppercase tracking-[0.12em] text-white transition hover:bg-[#ff3340] disabled:cursor-not-allowed disabled:opacity-35"
            >
              {isGeneratingAudio
                ? "Generating Narration..."
                : publisherAudioStatus ===
                    "ready"
                  ? "Regenerate Audio"
                  : publisherAudioStatus ===
                      "failed"
                    ? "Try Again"
                    : "Generate Article Audio"}
            </button>

            {publisherAudioStatus ===
              "ready" &&
            publisherAudioArticleId ? (
              <>
                <div className="mt-5 border border-white/10 bg-black p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            publisherAudioEnabled
                              ? "bg-green-500"
                              : "bg-white/25"
                          }`}
                        />

                        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/60">
                          Public Player
                        </p>
                      </div>

                      <p className="mt-2 text-[11px] leading-5 text-white/40">
                        {publisherAudioEnabled
                          ? "Readers can listen to this article."
                          : "Audio is ready but hidden from readers."}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-label="Show Publisher Audio player on article"
                      aria-checked={
                        publisherAudioEnabled
                      }
                      disabled={
                        isUpdatingPublisherAudioEnabled
                      }
                      onClick={() =>
                        void updatePublisherAudioEnabled(
                          !publisherAudioEnabled,
                        )
                      }
                      className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                        publisherAudioEnabled
                          ? "bg-[#f21f2b]"
                          : "bg-white/15"
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                          publisherAudioEnabled
                            ? "left-6"
                            : "left-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/40">
                      Preview
                    </p>

                    <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-green-400">
                      Audio Ready
                    </span>
                  </div>

                  <iframe
                    src={`${process.env
                      .NEXT_PUBLIC_PUBLISHER_AUDIO_URL ??
                      "http://localhost:3000"}/player/${encodeURIComponent(
                      publisherAudioArticleId,
                    )}`}
                    title="Publisher Audio preview"
                    className="w-full border-0"
                    style={{
                      height: "230px",
                    }}
                    loading="lazy"
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="border-t border-white/10 bg-black/30 px-5 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25">
                Powered by Please Rewind Network
              </p>

              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/20">
                Publisher Audio
              </span>
            </div>
          </div>
        </section>
        <section className="border border-white/10 bg-[#0b0d0f] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Publishing
          </p>
          <div className="mt-5 border border-white/10 bg-black p-4">
  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35">
    Status
  </p>

  <div className="mt-2 flex items-center gap-2">
    <span
      className={`h-2 w-2 rounded-full ${
        currentStatus ===
        "published"
          ? "bg-green-500"
          : "bg-[#f21f2b]"
      }`}
    />

    <span className="text-sm font-black uppercase tracking-[0.08em]">
      {currentStatus}
    </span>
  </div>

  {currentStatus ===
    "published" &&
  publishedAt ? (
    <p className="mt-2 text-[10px] text-white/35">
      Published{" "}
      {new Date(
        publishedAt,
      ).toLocaleString(
        "en-GB",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        },
      )}
    </p>
  ) : null}
</div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
              Category
            </span>

            <select
              value={
                category
              }
              onChange={(
                event,
              ) =>
                setCategory(
                  event
                    .target
                    .value as
                    (typeof categories)[number],
                )
              }
              className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
            >
              {categories.map(
                (
                  item,
                ) => (
                  <option
                    key={
                      item
                    }
                    value={
                      item
                    }
                  >
                    {item}
                  </option>
                ),
              )}
            </select>
          </label>

          <div className="mt-5">
  <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
    Hero Image
  </span>

  {heroImageUrl ? (
    <div className="mb-4 overflow-hidden border border-white/10 bg-black">
      <div className="relative aspect-video w-full">
        <Image
          src={
            heroImageUrl
          }
          alt="Hero image preview"
          fill
          unoptimized
          sizes="340px"
          className="object-cover"
        />
      </div>
    </div>
  ) : null}

  <label className="block cursor-pointer border border-dashed border-white/20 bg-black px-4 py-4 text-center transition hover:border-[#f21f2b]">
    <span className="text-xs font-black uppercase tracking-[0.1em] text-white/60">
      {isUploadingImage
        ? "Uploading..."
        : "Upload Hero Image"}
    </span>

    <input
      type="file"
      accept="image/jpeg,image/png,image/webp"
      disabled={
        isUploadingImage
      }
      className="hidden"
      onChange={(
        event,
      ) => {
        const file =
          event
            .target
            .files?.[0];

        if (file) {
          void uploadHeroImage(
            file,
          );
        }

        event.target.value =
          "";
      }}
    />
  </label>

  <p className="mt-3 text-[10px] leading-5 text-white/30">
    JPG, PNG or WebP. Maximum 8MB.
  </p>

  <div className="mt-4">
    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.1em] text-white/30">
      Or use image URL
    </p>

    <input
      value={
        heroImageUrl
      }
      onChange={(
        event,
      ) =>
        setHeroImageUrl(
          event
            .target
            .value,
        )
      }
      className="w-full border border-white/10 bg-black px-4 py-3 text-xs text-white outline-none focus:border-[#f21f2b]"
      placeholder="https://..."
    />
  </div>

  {heroImageUrl ? (
    <button
      type="button"
      onClick={() =>
        setHeroImageUrl(
          "",
        )
      }
      className="mt-3 text-[10px] font-black uppercase tracking-[0.1em] text-white/35 transition hover:text-[#f21f2b]"
    >
      Remove Image
    </button>
  ) : null}
</div>

          <div className="mt-6 grid gap-3">
            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                saveStory(
                  "draft",
                )
              }
              className="border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:border-white disabled:opacity-40"
            >
              {currentStatus ===
"published"
  ? "Unpublish"
  : initialData
    ? "Save Draft"
    : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                saveStory(
                  "published",
                )
              }
              className="bg-[#f21f2b] px-4 py-3 text-xs font-black uppercase tracking-[0.12em] transition hover:bg-white hover:text-black disabled:opacity-40"
            >
              {currentStatus ===
"published"
  ? "Save Changes"
  : "Publish"}
            </button>
          </div>

          {message ? (
            <p className="mt-4 text-sm text-white/60">
              {message}
            </p>
          ) : null}
        </section>

        <PeopleSelector
  people={curatedPeople}
  selectedPersonIds={
    selectedPersonIds
  }
  onToggle={
    togglePerson
  }
  description="Attach curated people who are directly featured in this story."
/>

        <section className="border border-white/10 bg-[#0b0d0f] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Sources
          </p>

          <div className="mt-5 space-y-4">
            <input
              value={
                sourceName
              }
              onChange={(
                event,
              ) =>
                setSourceName(
                  event
                    .target
                    .value,
                )
              }
              className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              placeholder="Source name"
            />

            <input
              value={
                sourceUrl
              }
              onChange={(
                event,
              ) =>
                setSourceUrl(
                  event
                    .target
                    .value,
                )
              }
              className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              placeholder="Source URL"
            />
          </div>
        </section>

        <section className="border border-white/10 bg-[#0b0d0f] p-5">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            SEO
          </p>

          <div className="mt-5 space-y-5">
            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-white/50">
                  SEO Title
                </span>

                <span className="text-[10px] text-white/30">
                  {
                    seoTitle.length
                  }
                  /60
                </span>
              </div>

              <input
                value={
                  seoTitle
                }
                maxLength={
                  60
                }
                onChange={(
                  event,
                ) =>
                  setSeoTitle(
                    event
                      .target
                      .value,
                  )
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-xs font-black uppercase tracking-[0.1em] text-white/50">
                  SEO Description
                </span>

                <span className="text-[10px] text-white/30">
                  {
                    seoDescription.length
                  }
                  /160
                </span>
              </div>

              <textarea
                value={
                  seoDescription
                }
                maxLength={
                  160
                }
                onChange={(
                  event,
                ) =>
                  setSeoDescription(
                    event
                      .target
                      .value,
                  )
                }
                rows={
                  5
                }
                className="w-full border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white outline-none focus:border-[#f21f2b]"
              />
            </label>
          </div>
        </section>
           </aside>
    </div>
  </div>
);
}