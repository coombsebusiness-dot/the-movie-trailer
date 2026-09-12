"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import PeopleSelector from "@/components/admin/people/PeopleSelector";

type MovieOption = {
  id: string;
  title: string;
  year: number | null;
  poster_url: string | null;
};

type CuratedPerson = {
  id: string;
  source_actor_id: string;
  slug: string;
  name: string;
  profile_image_url: string | null;
};

type ReviewSection = {
  eyebrow: string;
  headline: string;
  body: string;
  imageUrl: string;
  youtubeUrl: string;
};

type ReviewEditorInitialData = {
  id: string;
  movie_id: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  hero_image_url: string | null;
  intro: string | null;
  sections: ReviewSection[];
  verdict: string | null;
  rating: number | null;
  seo_title: string | null;
  seo_description: string | null;
  status: string;
};

type ReviewEditorProps = {
  movies?: MovieOption[];
  curatedPeople?: CuratedPerson[];
  initialPersonIds?: string[];
  initialData?: ReviewEditorInitialData;
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

function emptySection(): ReviewSection {
  return {
    eyebrow: "",
    headline: "",
    body: "",
    imageUrl: "",
    youtubeUrl: "",
  };
}

export default function ReviewEditor({
  movies = [],
  curatedPeople = [],
  initialPersonIds = [],
  initialData,
}: ReviewEditorProps) {
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
    movieId,
    setMovieId,
  ] = useState(
    initialData?.movie_id ??
      "",
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
    ReviewSection[]
  >(
    initialData?.sections
      ?.length
      ? initialData.sections
      : [
          emptySection(),
        ],
  );

  const [
    verdict,
    setVerdict,
  ] = useState(
    initialData?.verdict ??
      "",
  );

  const [
    rating,
    setRating,
  ] = useState(
    initialData?.rating !==
      null &&
      initialData?.rating !==
        undefined
      ? String(
          initialData.rating,
        )
      : "",
  );

  const [
    seoTitle,
    setSeoTitle,
  ] = useState(
    initialData?.seo_title ??
      "",
  );

  const [
    seoDescription,
    setSeoDescription,
  ] = useState(
    initialData
      ?.seo_description ??
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
    

  function updateSection(
    index: number,
    field:
      keyof ReviewSection,
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

  async function saveReview(
    status: "draft" | "published",
  ) {
    if (
      !title.trim()
    ) {
      setMessage(
        "A review title is required.",
      );
      return;
    }

    if (
      !effectiveSlug.trim()
    ) {
      setMessage(
        "A review slug is required.",
      );
      return;
    }

    const numericRating =
      rating.trim()
        ? Number(
            rating,
          )
        : null;

    if (
      numericRating !==
        null &&
      (
        Number.isNaN(
          numericRating,
        ) ||
        numericRating <
          0 ||
        numericRating >
          10
      )
    ) {
      setMessage(
        "Rating must be between 0 and 10.",
      );
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const payload = {
        movieId:
          movieId ||
          null,
        slug:
          effectiveSlug,
        title:
          title.trim(),
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
        verdict:
          verdict.trim() ||
          null,
        rating:
          numericRating,
        seoTitle:
          seoTitle.trim() ||
          null,
        seoDescription:
  seoDescription.trim() ||
  null,

personIds:
  selectedPersonIds,

status,
        
      };

      const response =
        await fetch(
          initialData
            ? `/api/admin/reviews/${initialData.id}`
            : "/api/admin/reviews",
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
            "Could not save review.",
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
          `/reviews/${effectiveSlug}`,
        );
        router.refresh();
        return;
      }

      if (
        !initialData
      ) {
        router.push(
          `/admin/reviews/${result.review.id}/edit`,
        );
        router.refresh();
        return;
      }

      setMessage(
        "Review saved.",
      );

      router.refresh();
    } catch (
      error
    ) {
      setMessage(
        error instanceof
          Error
          ? error.message
          : "Could not save review.",
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
      "/api/admin/reviews/upload",
      {
        method: "POST",
        body: formData,
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
  } catch (error) {
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
  } catch (error) {
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
            Review
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
              placeholder="Movie Title Review: Your headline"
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
              placeholder="Short review summary for cards, search and social."
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
              placeholder="Opening paragraphs of the review."
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
                Review Sections
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

        if (file) {
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
                      className="border border-white/10 bg-[#090b0d] px-4 py-3 text-sm text-white/60 outline-none focus:border-[#f21f2b]"
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="border border-white/10 bg-[#090b0d] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Final Word
          </p>

          <h2 className="mt-2 text-xl font-black uppercase tracking-[-0.03em]">
            Verdict
          </h2>

          <textarea
            value={
              verdict
            }
            onChange={(
              event,
            ) =>
              setVerdict(
                event
                  .target
                  .value,
              )
            }
            rows={
              5
            }
            className="mt-5 w-full resize-y border border-white/10 bg-black px-4 py-3 text-sm leading-7 text-white/75 outline-none focus:border-[#f21f2b]"
            placeholder="Your final verdict on the film."
          />
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

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Rating / 10
            </span>

            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={
                rating
              }
              onChange={(
                event,
              ) =>
                setRating(
                  event
                    .target
                    .value,
                )
              }
              className="mt-2 w-full border border-white/10 bg-black px-4 py-3 text-2xl font-black text-[#f21f2b] outline-none focus:border-[#f21f2b]"
              placeholder="8.5"
            />
          </label>

          <div className="mt-5 grid gap-3">
            <button
              type="button"
              disabled={
                isSaving
              }
              onClick={() =>
                void saveReview(
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
                void saveReview(
                  "published",
                )
              }
              className="bg-[#f21f2b] px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black disabled:opacity-40"
            >
              Publish Review
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

        <section className="border border-white/10 bg-[#090b0d] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#f21f2b]">
            Movie
          </p>

          <label className="mt-4 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Related Movie
            </span>

            <select
              value={
                movieId
              }
              onChange={(
                event,
              ) =>
                setMovieId(
                  event
                    .target
                    .value,
                )
              }
              className="mt-2 w-full border border-white/10 bg-black px-3 py-3 text-sm font-bold text-white outline-none focus:border-[#f21f2b]"
            >
              <option value="">
                No movie attached
              </option>

              {movies.map(
                (movie) => (
                  <option
                    key={
                      movie.id
                    }
                    value={
                      movie.id
                    }
                  >
                    {
                      movie.title
                    }
                    {movie.year
                      ? ` (${movie.year})`
                      : ""}
                  </option>
                ),
              )}
            </select>
          </label>
        </section>

                <PeopleSelector
  people={curatedPeople}
  selectedPersonIds={
    selectedPersonIds
  }
  onToggle={
    togglePerson
  }
  description="Attach curated people who are directly featured in this review."
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

      if (file) {
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
            <div className="mt-4 aspect-video overflow-hidden border border-white/10 bg-black">
              <img
                src={
                  heroImageUrl
                }
                alt=""
                className="h-full w-full object-cover"
              />
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
              maxLength={
                70
              }
              className="mt-2 w-full border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none focus:border-[#f21f2b]"
            />
          </label>

          <label className="mt-5 block">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-white/40">
              Meta Description
            </span>

            <textarea
              value={
                seoDescription
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
              maxLength={
                170
              }
              rows={
                5
              }
              className="mt-2 w-full resize-y border border-white/10 bg-black px-3 py-3 text-sm leading-6 text-white/70 outline-none focus:border-[#f21f2b]"
            />
          </label>
        </section>
      </aside>
    </div>
  );
}
