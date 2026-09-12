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