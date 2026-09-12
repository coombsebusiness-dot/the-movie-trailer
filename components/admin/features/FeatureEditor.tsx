"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import PeopleSelector from "@/components/admin/people/PeopleSelector";

type CuratedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  name: string;
  profile_image_url: string | null;
};

type FeatureSection = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  youtubeUrl: string;
};

export type FeatureSource = {
  name: string;
  url: string;
};

export type FeatureEditorInitialData = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  intro: string | null;
  sections: FeatureSection[];
  sources?: FeatureSource[];
  seo_title: string | null;
  meta_description: string | null;
  status: string;
};

type FeatureEditorProps = {
  curatedPeople?: CuratedPerson[];
  initialPersonIds?: string[];
  initialData?: FeatureEditorInitialData;
};

function slugify(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-+|-+$/g,
      "",
    );
}

function emptySection(): FeatureSection {
  return {
    eyebrow: "",
    headline: "",
    body: "",
    imageUrl: "",
    youtubeUrl: "",
  };
}

function emptySource(): FeatureSource {
  return {
    name: "",
    url: "",
  };
}

export default function FeatureEditor({
  curatedPeople = [],
  initialPersonIds = [],
  initialData,
}: FeatureEditorProps) {
  const router =
    useRouter();

  const [
    selectedPersonIds,
    setSelectedPersonIds,
  ] = useState<string[]>(
    initialPersonIds,
  );

  const [
    title,
    setTitle,
  ] = useState(
    initialData?.title ??
      "",
  );

  const [
    slug,
    setSlug,
  ] = useState(
    initialData?.slug ??
      "",
  );

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(
    Boolean(
      initialData?.slug,
    ),
  );

  const [
    excerpt,
    setExcerpt,
  ] = useState(
    initialData?.excerpt ??
      "",
  );

  const [
    heroImageUrl,
    setHeroImageUrl,
  ] = useState(
    initialData
      ?.hero_image_url ??
      "",
  );

  const [
    intro,
    setIntro,
  ] = useState(
    initialData?.intro ??
      "",
  );

  const [
    sections,
    setSections,
  ] = useState<
    FeatureSection[]
  >(
    initialData?.sections
      ?.length
      ? initialData.sections
      : [
          emptySection(),
        ],
  );

  const [
    sources,
    setSources,
  ] = useState<
    FeatureSource[]
  >(
    initialData?.sources ??
      [],
  );

  const [
    seoTitle,
    setSeoTitle,
  ] = useState(
    initialData?.seo_title ??
      "",
  );

  const [
    metaDescription,
    setMetaDescription,
  ] = useState(
    initialData
      ?.meta_description ??
      "",
  );

  const [
    currentStatus,
    setCurrentStatus,
  ] = useState(
    initialData?.status ??
      "draft",
  );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    uploadingHero,
    setUploadingHero,
  ] = useState(false);

  const [
    uploadingSectionIndex,
    setUploadingSectionIndex,
  ] = useState<
    number | null
  >(null);

  const effectiveSlug =
    useMemo(
      () =>
        slugEdited
          ? slug
          : slugify(
              title,
            ),
      [
        slug,
        slugEdited,
        title,
      ],
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
                id !==
                personId,
            )
          : [
              ...current,
              personId,
            ],
    );
  }

  function updateSection(
    index: number,
    field:
      keyof FeatureSection,
    value: string,
  ) {
    setSections(
      (current) =>
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
      (current) => [
        ...current,
        emptySection(),
      ],
    );
  }

  function removeSection(
    index: number,
  ) {
    setSections(
      (current) =>
        current.filter(
          (
            _section,
            sectionIndex,
          ) =>
            sectionIndex !==
            index,
        ),
    );
  }

  function updateSource(
    index: number,
    field:
      keyof FeatureSource,
    value: string,
  ) {
    setSources(
      (current) =>
        current.map(
          (
            source,
            sourceIndex,
          ) =>
            sourceIndex ===
            index
              ? {
                  ...source,
                  [field]:
                    value,
                }
              : source,
        ),
    );
  }

  function addSource() {
    setSources(
      (current) => [
        ...current,
        emptySource(),
      ],
    );
  }

  function removeSource(
    index: number,
  ) {
    setSources(
      (current) =>
        current.filter(
          (
            _source,
            sourceIndex,
          ) =>
            sourceIndex !==
            index,
        ),
    );
  }

  async function saveFeature(
    status:
      | "draft"
      | "published",
  ) {
    if (
      !title.trim()
    ) {
      setMessage(
        "A feature title is required.",
      );

      return;
    }

    if (
      !effectiveSlug.trim()
    ) {
      setMessage(
        "A feature slug is required.",
      );

      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        title:
          title.trim(),

        slug:
          effectiveSlug,

        excerpt:
          excerpt.trim() ||
          null,

        heroImageUrl:
          heroImageUrl.trim() ||
          null,

        intro:
          intro.trim() ||
          null,

        sections,

        sources,

        seoTitle:
          seoTitle.trim() ||
          null,

        metaDescription:
          metaDescription.trim() ||
          null,

        personIds:
          selectedPersonIds,

        status,
      };

      const response =
        await fetch(
          initialData
            ? `/api/admin/features/${initialData.id}`
            : "/api/admin/features",
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
                payload,
              ),
          },
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ??
            "Could not save feature.",
        );
      }

      setCurrentStatus(
        status,
      );

      if (
        status ===
        "published"
      ) {
        router.push(
          `/features/${effectiveSlug}`,
        );

        router.refresh();

        return;
      }

      if (
        !initialData
      ) {
        router.push(
          `/admin/features/${result.feature.id}/edit`,
        );

        router.refresh();

        return;
      }

      setMessage(
        "Feature saved.",
      );

      router.refresh();
    } catch (
      error
    ) {
      setMessage(
        error instanceof
          Error
          ? error.message
          : "Could not save feature.",
      );
    } finally {
      setIsSaving(
        false,
      );
    }
  }

  async function uploadImage(
    file: File,
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    const response =
      await fetch(
        "/api/admin/features/upload",
        {
          method:
            "POST",

          body:
            formData,
        },
      );

    const result =
      await response.json();

    if (
      !response.ok ||
      !result.url
    ) {
      throw new Error(
        result.error ??
          "Could not upload image.",
      );
    }

    return result.url as string;
  }

  async function uploadHeroImage(
    file: File,
  ) {
    setUploadingHero(
      true,
    );

    setMessage("");

    try {
      const url =
        await uploadImage(
          file,
        );

      setHeroImageUrl(
        url,
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
          : "Could not upload hero image.",
      );
    } finally {
      setUploadingHero(
        false,
      );
    }
  }

  async function uploadSectionImage(
    index: number,
    file: File,
  ) {
    setUploadingSectionIndex(
      index,
    );

    setMessage("");

    try {
      const url =
        await uploadImage(
          file,
        );

      updateSection(
        index,
        "imageUrl",
        url,
      );

      setMessage(
        `Section ${index + 1} image uploaded.`,
      );
    } catch (
      error
    ) {
      setMessage(
        error instanceof
          Error
          ? error.message
          : "Could not upload section image.",
      );
    } finally {
      setUploadingSectionIndex(
        null,
      );
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-8">
        <section className="border border-white/10 bg-[#090b0d] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Feature
          </p>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Headline
            </span>

            <input
              value={
                title
              }
              onChange={(
                event,
              ) => {
                setTitle(
                  event
                    .target
                    .value,
                );

                if (
                  !slugEdited
                ) {
                  setSlug(
                    slugify(
                      event
                        .target
                        .value,
                    ),
                  );
                }
              }}
              className="mt-2 w-full border border-white/10 bg-black px-4 py-4 text-xl font-black text-white outline-none transition focus:border-[#f21f2b]"
              placeholder="Feature headline"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
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
              className="mt-2 w-full border border-white/10 bg-black px-4 py-3 text-sm font-bold text-white/70 outline-none transition focus:border-[#f21f2b]"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
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
                4
              }
              className="mt-2 w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white/75 outline-none transition focus:border-[#f21f2b]"
              placeholder="Short summary for cards, search and social."
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Introduction
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
                7
              }
              className="mt-2 w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-7 text-white/75 outline-none transition focus:border-[#f21f2b]"
              placeholder="Opening paragraphs of the feature."
            />
          </label>
        </section>

        <section className="border border-white/10 bg-[#090b0d] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Body
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">
                Feature Sections
              </h2>
            </div>

            <button
              type="button"
              onClick={
                addSection
              }
              className="border border-white/15 px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
            >
              + Add Section
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
                  className="border border-white/10 bg-black/40 p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/30">
                      Section{" "}
                      {index +
                        1}
                    </span>

                    {sections.length >
                    1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          removeSection(
                            index,
                          )
                        }
                        className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25 transition hover:text-[#f21f2b]"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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
                      placeholder="Eyebrow"
                      className="border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
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
                      placeholder="Section headline"
                      className="border border-white/10 bg-[#090b0d] px-4 py-3 text-sm font-bold text-white outline-none focus:border-[#f21f2b]"
                    />
                  </div>

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
                      10
                    }
                    placeholder="Write this section..."
                    className="mt-4 w-full resize-y border border-white/10 bg-[#090b0d] px-4 py-3 text-sm leading-7 text-white/75 outline-none focus:border-[#f21f2b]"
                  />

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="block">
                        <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                          Section Image
                        </span>

                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          disabled={
                            uploadingSectionIndex ===
                            index
                          }
                          onChange={(
                            event,
                          ) => {
                            const file =
                              event
                                .target
                                .files?.[0];

                            if (
                              file
                            ) {
                              void uploadSectionImage(
                                index,
                                file,
                              );
                            }

                            event.target.value =
                              "";
                          }}
                          className="block w-full cursor-pointer border border-white/10 bg-[#090b0d] px-3 py-3 text-xs text-white/50 file:mr-4 file:border-0 file:bg-[#f21f2b] file:px-3 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-[0.12em] file:text-white"
                        />
                      </label>

                      {uploadingSectionIndex ===
                      index ? (
                        <p className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-[#f21f2b]">
                          Uploading...
                        </p>
                      ) : null}

                      {section.imageUrl ? (
                        <div className="mt-3">
                          <div className="aspect-video overflow-hidden border border-white/10 bg-black">
                            <img
                              src={
                                section.imageUrl
                              }
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              updateSection(
                                index,
                                "imageUrl",
                                "",
                              )
                            }
                            className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-white/30 transition hover:text-[#f21f2b]"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <div>
                      <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                        Video
                      </span>

                      <input
                        value={
                          section.youtubeUrl
                        }
                        onChange={(
                          event,
                        ) =>
                          updateSection(
                            index,
                            "youtubeUrl",
                            event
                              .target
                              .value,
                          )
                        }
                        placeholder="YouTube URL"
                        className="w-full border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none focus:border-[#f21f2b]"
                      />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="border border-white/10 bg-[#090b0d] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
                Research
              </p>

              <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em] text-white">
                Sources &amp; Further Reading
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/35">
                Add the publications, studios or official sources used for this feature.
              </p>
            </div>

            <button
              type="button"
              onClick={
                addSource
              }
              className="border border-white/15 px-4 py-2 text-[9px] font-black uppercase tracking-[0.12em] text-white transition hover:border-[#f21f2b] hover:text-[#f21f2b]"
            >
              + Add Source
            </button>
          </div>

          {sources.length ===
          0 ? (
            <div className="mt-6 border border-dashed border-white/10 bg-black/30 px-5 py-8 text-center">
              <p className="text-xs font-bold text-white/30">
                No sources added yet.
              </p>

              <button
                type="button"
                onClick={
                  addSource
                }
                className="mt-4 text-[9px] font-black uppercase tracking-[0.12em] text-[#f21f2b]"
              >
                Add First Source
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {sources.map(
                (
                  source,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="border border-white/10 bg-black/40 p-5"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white/30">
                        Source{" "}
                        {index +
                          1}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeSource(
                            index,
                          )
                        }
                        className="text-[9px] font-black uppercase tracking-[0.12em] text-white/25 transition hover:text-[#f21f2b]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                          Source Name
                        </span>

                        <input
                          value={
                            source.name
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSource(
                              index,
                              "name",
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="e.g. Warner Bros."
                          className="w-full border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-[9px] font-black uppercase tracking-[0.12em] text-white/35">
                          Source URL
                        </span>

                        <input
                          type="url"
                          value={
                            source.url
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSource(
                              index,
                              "url",
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="https://..."
                          className="w-full border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white/70 outline-none focus:border-[#f21f2b]"
                        />
                      </label>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <section className="border border-white/10 bg-[#090b0d] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Publishing
          </p>

          <div className="mt-4 flex items-center justify-between border-b border-white/10 pb-4">
            <span className="text-xs font-bold text-white/40">
              Status
            </span>

            <span className="text-[9px] font-black uppercase tracking-[0.14em] text-white">
              {
                currentStatus
              }
            </span>
          </div>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                void saveFeature(
                  "draft",
                )
              }
              className="border border-white/15 px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:border-white disabled:opacity-40"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                void saveFeature(
                  "published",
                )
              }
              className="bg-[#f21f2b] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black disabled:opacity-40"
            >
              Publish Feature
            </button>
          </div>

          {message ? (
            <p className="mt-4 text-xs font-bold leading-5 text-white/50">
              {
                message
              }
            </p>
          ) : null}
        </section>

        <PeopleSelector
          people={
            curatedPeople
          }
          selectedPersonIds={
            selectedPersonIds
          }
          onToggle={
            togglePerson
          }
          description="Attach curated people who are directly featured in this feature."
        />

        <section className="border border-white/10 bg-[#090b0d] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Artwork
          </p>

          <label className="mt-4 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Hero Image
            </span>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={
                uploadingHero
              }
              onChange={(
                event,
              ) => {
                const file =
                  event
                    .target
                    .files?.[0];

                if (
                  file
                ) {
                  void uploadHeroImage(
                    file,
                  );
                }

                event.target.value =
                  "";
              }}
              className="mt-2 block w-full cursor-pointer border border-white/10 bg-black px-3 py-3 text-xs text-white/50 file:mr-4 file:border-0 file:bg-[#f21f2b] file:px-3 file:py-2 file:text-[9px] file:font-black file:uppercase file:tracking-[0.12em] file:text-white"
            />

            {uploadingHero ? (
              <span className="mt-2 block text-[9px] font-black uppercase tracking-[0.12em] text-[#f21f2b]">
                Uploading...
              </span>
            ) : null}
          </label>

          {heroImageUrl ? (
            <div className="mt-4">
              <div className="aspect-video overflow-hidden border border-white/10 bg-black">
                <img
                  src={
                    heroImageUrl
                  }
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setHeroImageUrl(
                    "",
                  )
                }
                className="mt-2 text-[9px] font-black uppercase tracking-[0.12em] text-white/30 transition hover:text-[#f21f2b]"
              >
                Remove Image
              </button>
            </div>
          ) : null}
        </section>

        <section className="border border-white/10 bg-[#090b0d] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            SEO
          </p>

          <label className="mt-4 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              SEO Title
            </span>

            <input
              value={
                seoTitle
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
              className="mt-2 w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
              placeholder="SEO title"
            />

            <span className="mt-2 block text-[9px] font-bold text-white/25">
              {seoTitle.length}
              /60
            </span>
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Meta Description
            </span>

            <textarea
              value={
                metaDescription
              }
              onChange={(
                event,
              ) =>
                setMetaDescription(
                  event
                    .target
                    .value,
                )
              }
              rows={
                5
              }
              className="mt-2 w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-6 text-white/70 outline-none focus:border-[#f21f2b]"
              placeholder="Search result description"
            />

            <span className="mt-2 block text-[9px] font-bold text-white/25">
              {
                metaDescription.length
              }
              /160
            </span>
          </label>
        </section>
      </aside>
    </div>
  );
}