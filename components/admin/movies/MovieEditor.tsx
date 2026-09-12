"use client";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

import {
  useRef,
  useState,
} from "react";

import PeopleSelector, {
  type CuratedPerson,
} from "@/components/admin/people/PeopleSelector";

import RichTextEditor from "@/components/admin/RichTextEditor";

type EditorSection = {
  id: string;
  eyebrow: string;
  heading: string;
  content: string;
  youtubeUrl: string;
  youtubeVideoId: string;
};

export type MovieEditorInitialMovie = {
  id: string;
  slug: string;
  title: string;
  year: number | null;
  synopsis: string | null;
  release_date: string | null;
  poster_url: string | null;
  backdrop_url: string | null;
  director: string | null;
  status:
    | "draft"
    | "published";
  genre: string | null;
  tagline: string | null;
  intro: string | null;
  runtime: string | null;
  certification: string | null;
  studio: string | null;
  distributor: string | null;
  cast_members: string[];
  sections: EditorSection[];
  sidebar_quote: string | null;
  seo_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  is_featured: boolean;
};

type MovieEditorProps = {
  initialMovie?:
    MovieEditorInitialMovie;
  curatedPeople?: CuratedPerson[];
  initialPersonIds?: string[];
};

type MovieForm = {
  title: string;
  slug: string;
  year: string;

  genre: string;
  releaseDate: string;
  runtime: string;
  certification: string;

  director: string;
  studio: string;
  distributor: string;

  tagline: string;
  synopsis: string;
  intro: string;

  castMembers: string[];

  posterUrl: string;
  backdropUrl: string;

  sidebarQuote: string;

  seoTitle: string;
  metaDescription: string;

  sections: EditorSection[];
  isFeatured: boolean;
};

const inputClass =
  "mt-2 w-full border border-white/10 bg-[#0b0d10] px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-white/20 focus:border-[#f21f2b]/70 focus:bg-[#0d0f12]";

const textareaClass =
  `${inputClass} resize-y leading-7`;

const labelClass =
  "text-[10px] font-black uppercase tracking-[0.18em] text-white/45";

function createSlug(
  value: string,
) {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /&/g,
      "and",
    )
    .replace(
      /['’]/g,
      "",
    )
    .replace(
      /[^a-z0-9]+/g,
      "-",
    )
    .replace(
      /^-|-$/g,
      "",
    );
}

function extractYouTubeVideoId(
  value: string,
) {
  const trimmed =
    value.trim();

  if (!trimmed) {
    return "";
  }

  try {
    const url =
      new URL(
        trimmed,
      );

    if (
      url.hostname ===
        "youtu.be" ||
      url.hostname ===
        "www.youtu.be"
    ) {
      return url.pathname
        .split("/")
        .filter(Boolean)[0] ?? "";
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

      if (
        [
          "embed",
          "shorts",
          "live",
        ].includes(
          parts[0],
        )
      ) {
        return parts[1] ?? "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

function createSection():
EditorSection {
  return {
    id: "",
    eyebrow: "",
    heading: "",
    content: "",
    youtubeUrl: "",
    youtubeVideoId: "",
  };
}

function createInitialForm(
  initialMovie?:
    MovieEditorInitialMovie,
): MovieForm {
  return {
    title:
      initialMovie?.title ??
      "",

    slug:
      initialMovie?.slug ??
      "",

    year:
      initialMovie?.year
        ? String(
            initialMovie.year,
          )
        : "",

    genre:
      initialMovie?.genre ??
      "",

    releaseDate:
      initialMovie?.release_date ??
      "",

    runtime:
      initialMovie?.runtime ??
      "",

    certification:
      initialMovie?.certification ??
      "",

    director:
      initialMovie?.director ??
      "",

    studio:
      initialMovie?.studio ??
      "",

    distributor:
      initialMovie?.distributor ??
      "",

    tagline:
      initialMovie?.tagline ??
      "",

    synopsis:
      initialMovie?.synopsis ??
      "",

    intro:
      initialMovie?.intro ??
      "",

    castMembers:
      initialMovie?.cast_members
        ?.length
        ? initialMovie.cast_members
        : [
            "",
          ],

    posterUrl:
      initialMovie?.poster_url ??
      "",

    backdropUrl:
      initialMovie?.backdrop_url ??
      "",

    sidebarQuote:
      initialMovie?.sidebar_quote ??
      "",

    seoTitle:
      initialMovie?.seo_title ??
      "",

    metaDescription:
      initialMovie?.meta_description ??
      "",

    sections:
  initialMovie?.sections
    ?.length
    ? initialMovie.sections.map(
        (
          section,
        ) => ({
          ...section,

          youtubeUrl:
            section.youtubeUrl ??
            "",

          youtubeVideoId:
            section.youtubeVideoId ??
            "",
        }),
      )
    : [
        createSection(),
      ],
      isFeatured:
  initialMovie?.is_featured ??
  false,
  };
}

export default function MovieEditor({
  initialMovie,
  curatedPeople = [],
  initialPersonIds = [],
}: MovieEditorProps) {
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

  const posterInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const backdropInputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const [
    movie,
    setMovie,
  ] = useState<MovieForm>(
    () =>
      createInitialForm(
        initialMovie,
      ),
  );

  const [
    savedMovieId,
    setSavedMovieId,
  ] = useState<
    string | null
  >(
    initialMovie?.id ??
      null,
  );

  const [
    currentStatus,
    setCurrentStatus,
  ] = useState<
    "draft" | "published"
  >(
    initialMovie?.status ??
      "draft",
  );

  const [
    slugEdited,
    setSlugEdited,
  ] = useState(
    Boolean(
      initialMovie,
    ),
  );

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    publishing,
    setPublishing,
  ] = useState(false);

  const [
    saveMessage,
    setSaveMessage,
  ] = useState("");

  const [
    publishMessage,
    setPublishMessage,
  ] = useState("");

  const [
    uploadingPoster,
    setUploadingPoster,
  ] = useState(false);

  const [
    uploadingBackdrop,
    setUploadingBackdrop,
  ] = useState(false);

  const [
    imageMessage,
    setImageMessage,
  ] = useState("");

  function updateField<
    K extends keyof MovieForm,
  >(
    field: K,
    value: MovieForm[K],
  ) {
    setMovie(
      (
        current,
      ) => ({
        ...current,
        [field]:
          value,
      }),
    );
  }

  function updateTitle(
    title: string,
  ) {
    setMovie(
      (
        current,
      ) => ({
        ...current,

        title,

        slug:
          slugEdited
            ? current.slug
            : createSlug(
                title,
              ),
      }),
    );
  }

  function validateMovie():
  string | null {
    if (
      !movie.title.trim()
    ) {
      return "Movie title is required.";
    }

    if (
      !movie.slug.trim()
    ) {
      return "Movie slug is required.";
    }

    if (
      !movie.year.trim()
    ) {
      return "Movie year is required.";
    }

    const year =
      Number(
        movie.year,
      );

    if (
      !Number.isInteger(
        year,
      ) ||
      year < 1880 ||
      year > 2100
    ) {
      return "Enter a valid movie year.";
    }

    return null;
  }

  function createPayload(
    status:
      | "draft"
      | "published",
  ) {
    return {
      title:
        movie.title.trim(),

      slug:
        movie.slug.trim(),

      year:
        Number(
          movie.year,
        ),

      genre:
        movie.genre.trim() ||
        null,

      release_date:
        movie.releaseDate ||
        null,

      runtime:
        movie.runtime.trim() ||
        null,

      certification:
        movie.certification.trim() ||
        null,

      director:
        movie.director.trim() ||
        null,

      studio:
        movie.studio.trim() ||
        null,

      distributor:
        movie.distributor.trim() ||
        null,

      tagline:
        movie.tagline.trim() ||
        null,

      synopsis:
        movie.synopsis.trim() ||
        null,

      intro:
        movie.intro.trim() ||
        null,

      cast_members:
        movie.castMembers
          .map(
            (
              castMember,
            ) =>
              castMember.trim(),
          )
          .filter(
            Boolean,
          ),

      poster_url:
        movie.posterUrl.trim() ||
        null,

      backdrop_url:
        movie.backdropUrl.trim() ||
        null,

      sidebar_quote:
        movie.sidebarQuote.trim() ||
        null,

      seo_title:
        movie.seoTitle.trim() ||
        null,

      meta_description:
        movie.metaDescription.trim() ||
        null,

      sections:
  movie.sections.map(
    (
      section,
    ) => ({
      id:
        section.id.trim(),

      eyebrow:
        section.eyebrow.trim(),

      heading:
        section.heading.trim(),

      content:
        section.content,

      youtubeUrl:
        section.youtubeUrl.trim(),

      youtubeVideoId:
        section.youtubeVideoId.trim(),
    }),
  ),
  personIds:
  selectedPersonIds,

  is_featured:
  movie.isFeatured,

      status,
    };
  }

  async function saveMovie(
    status:
      | "draft"
      | "published",
  ) {
    const validationError =
      validateMovie();

    if (
      validationError
    ) {
      throw new Error(
        validationError,
      );
    }

    const payload =
      createPayload(
        status,
      );

    const endpoint =
      savedMovieId
        ? `/api/admin/movies/${savedMovieId}`
        : "/api/admin/movies";

    const method =
      savedMovieId
        ? "PATCH"
        : "POST";

    const response =
      await fetch(
        endpoint,
        {
          method,

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

    const data =
      (await response.json()) as {
        movie?: {
          id: string;
          slug: string;
          status:
            | "draft"
            | "published";
        };

        error?: string;
      };

    if (
      !response.ok ||
      !data.movie
    ) {
      throw new Error(
        data.error ??
          "Movie could not be saved.",
      );
    }

    setSavedMovieId(
      data.movie.id,
    );

    setCurrentStatus(
      data.movie.status,
    );

    return data.movie;
  }

  async function handleSaveDraft() {
    setSaveMessage("");
    setPublishMessage("");
    setSaving(true);

    try {
      const movieRecord =
        await saveMovie(
          "draft",
        );

      setSaveMessage(
        "Draft saved successfully.",
      );

      if (
        !initialMovie
      ) {
        router.replace(
          `/admin/movies/${movieRecord.id}/edit`,
        );
      }

      router.refresh();
    } catch (
      error
    ) {
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Movie could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaveMessage("");
    setPublishMessage("");
    setPublishing(true);

    try {
      const movieRecord =
        await saveMovie(
          "published",
        );

      setPublishMessage(
        "Movie published successfully.",
      );

      if (
        !initialMovie
      ) {
        router.replace(
          `/admin/movies/${movieRecord.id}/edit`,
        );
      }

      router.refresh();
    } catch (
      error
    ) {
      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Movie could not be published.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function handleUnpublish() {
    if (
      !savedMovieId
    ) {
      return;
    }

    setSaveMessage("");
    setPublishMessage("");
    setPublishing(true);

    try {
      await saveMovie(
        "draft",
      );

      setPublishMessage(
        "Movie returned to draft.",
      );

      router.refresh();
    } catch (
      error
    ) {
      setPublishMessage(
        error instanceof Error
          ? error.message
          : "Movie could not be unpublished.",
      );
    } finally {
      setPublishing(false);
    }
  }

  async function uploadImage(
    file: File,
  ) {
    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      throw new Error(
        "Please choose an image file.",
      );
    }

    if (
      file.size >
      10 *
        1024 *
        1024
    ) {
      throw new Error(
        "Image must be smaller than 10MB.",
      );
    }

    const formData =
      new FormData();

    formData.append(
      "file",
      file,
    );

    const response =
      await fetch(
        "/api/admin/movies/upload",
        {
          method:
            "POST",

          body:
            formData,
        },
      );

    const data =
      (await response.json()) as {
        url?: string;
        error?: string;
      };

    if (
      !response.ok ||
      !data.url
    ) {
      throw new Error(
        data.error ??
          "Image upload failed.",
      );
    }

    return data.url;
  }

  async function handlePosterUpload(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    setImageMessage("");
    setUploadingPoster(
      true,
    );

    try {
      const url =
        await uploadImage(
          file,
        );

      updateField(
        "posterUrl",
        url,
      );

      setImageMessage(
        "Poster uploaded successfully.",
      );
    } catch (
      error
    ) {
      setImageMessage(
        error instanceof Error
          ? error.message
          : "Poster upload failed.",
      );
    } finally {
      setUploadingPoster(
        false,
      );

      event.target.value =
        "";
    }
  }

  async function handleBackdropUpload(
    event:
      React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target
        .files?.[0];

    if (!file) {
      return;
    }

    setImageMessage("");
    setUploadingBackdrop(
      true,
    );

    try {
      const url =
        await uploadImage(
          file,
        );

      updateField(
        "backdropUrl",
        url,
      );

      setImageMessage(
        "Backdrop uploaded successfully.",
      );
    } catch (
      error
    ) {
      setImageMessage(
        error instanceof Error
          ? error.message
          : "Backdrop upload failed.",
      );
    } finally {
      setUploadingBackdrop(
        false,
      );

      event.target.value =
        "";
    }
  }

  function updateCastMember(
    index: number,
    value: string,
  ) {
    const castMembers =
      [
        ...movie.castMembers,
      ];

    castMembers[index] =
      value;

    updateField(
      "castMembers",
      castMembers,
    );
  }

  function addCastMember() {
    updateField(
      "castMembers",
      [
        ...movie.castMembers,
        "",
      ],
    );
  }

  function removeCastMember(
    index: number,
  ) {
    if (
      movie.castMembers
        .length ===
      1
    ) {
      updateField(
        "castMembers",
        [
          "",
        ],
      );

      return;
    }

    updateField(
      "castMembers",
      movie.castMembers.filter(
        (
          _,
          castIndex,
        ) =>
          castIndex !==
          index,
      ),
    );
  }

  function updateSection(
    index: number,
    field:
  | "id"
  | "eyebrow"
  | "heading"
  | "content"
  | "youtubeUrl"
  | "youtubeVideoId",
    value: string,
  ) {
    const sections =
      [
        ...movie.sections,
      ];

    sections[index] = {
      ...sections[index],
      [field]:
        value,
    };

    updateField(
      "sections",
      sections,
    );
  }

  function updateSectionYouTube(
  index: number,
  value: string,
) {
  const sections =
    [
      ...movie.sections,
    ];

  sections[index] = {
    ...sections[index],

    youtubeUrl:
      value,

    youtubeVideoId:
      extractYouTubeVideoId(
        value,
      ),
  };

  updateField(
    "sections",
    sections,
  );
}

  function updateSectionHeading(
    index: number,
    value: string,
  ) {
    const sections =
      [
        ...movie.sections,
      ];

    const section =
      sections[index];

    sections[index] = {
      ...section,

      heading:
        value,

      id:
        section.id
          ? section.id
          : createSlug(
              value,
            ),
    };

    updateField(
      "sections",
      sections,
    );
  }

  function addSection() {
    updateField(
      "sections",
      [
        ...movie.sections,
        createSection(),
      ],
    );
  }

  function removeSection(
    index: number,
  ) {
    if (
      movie.sections.length ===
      1
    ) {
      updateField(
        "sections",
        [
          createSection(),
        ],
      );

      return;
    }

    updateField(
      "sections",
      movie.sections.filter(
        (
          _,
          sectionIndex,
        ) =>
          sectionIndex !==
          index,
      ),
    );
  }

  const busy =
    saving ||
    publishing ||
    uploadingPoster ||
    uploadingBackdrop;

  return (
    <main className="pb-20">
      <div className="border-b border-white/10 pb-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#f21f2b]">
              Editorial Desk
            </p>

            <h1 className="mt-3 text-4xl font-black uppercase tracking-[-0.04em] text-white md:text-5xl">
              {initialMovie
                ? "Edit Movie"
                : "New Movie"}
            </h1>

            <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-white/45">
              Build the complete movie page, release information,
              imagery, cast, SEO and editorial content.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                handleSaveDraft
              }
              disabled={
                busy
              }
              className="border border-white/15 bg-[#111317] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-white/30 hover:bg-[#17191e] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving
                ? "Saving..."
                : "Save Draft"}
            </button>

            {savedMovieId ? (
              <Link
                href={`/movies/${movie.slug}`}
                target="_blank"
                className="border border-white/15 bg-[#111317] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-white/30 hover:bg-[#17191e]"
              >
                View Page
              </Link>
            ) : null}

            {currentStatus ===
            "published" ? (
              <button
                type="button"
                onClick={
                  handleUnpublish
                }
                disabled={
                  busy
                }
                className="border border-white/15 bg-[#111317] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-[#f21f2b]/60 hover:text-[#f21f2b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Unpublish
              </button>
            ) : null}

            <button
              type="button"
              onClick={
                handlePublish
              }
              disabled={
                busy
              }
              className="bg-[#f21f2b] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-[#ff3440] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {publishing
                ? "Publishing..."
                : currentStatus ===
                    "published"
                  ? "Update Published"
                  : "Publish"}
            </button>
          </div>
        </div>

        {saveMessage ? (
          <p className="mt-4 text-sm font-bold text-white/55">
            {saveMessage}
          </p>
        ) : null}

        {publishMessage ? (
          <p className="mt-4 text-sm font-bold text-white/55">
            {publishMessage}
          </p>
        ) : null}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <EditorPanel
            number="01"
            eyebrow="Core Record"
            title="Movie Details"
            description="The primary information used across movie cards, archive pages and search."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Movie title">
                <input
                  value={
                    movie.title
                  }
                  onChange={(
                    event,
                  ) =>
                    updateTitle(
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Practical Magic 2"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="URL slug">
                <input
                  value={
                    movie.slug
                  }
                  onChange={(
                    event,
                  ) => {
                    setSlugEdited(
                      true,
                    );

                    updateField(
                      "slug",
                      createSlug(
                        event
                          .target
                          .value,
                      ),
                    );
                  }}
                  placeholder="practical-magic-2"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Year">
                <input
                  type="number"
                  min="1880"
                  max="2100"
                  value={
                    movie.year
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "year",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="2026"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Genre">
                <input
                  value={
                    movie.genre
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "genre",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Fantasy, Romance"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Release date">
                <input
                  type="date"
                  value={
                    movie.releaseDate
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "releaseDate",
                      event
                        .target
                        .value,
                    )
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Runtime">
                <input
                  value={
                    movie.runtime
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "runtime",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="112 minutes"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Certification">
                <input
                  value={
                    movie.certification
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "certification",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="12A"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Director">
                <input
                  value={
                    movie.director
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "director",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Director name"
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Studio">
                <input
                  value={
                    movie.studio
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "studio",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Warner Bros."
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Distributor">
                <input
                  value={
                    movie.distributor
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "distributor",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder="Warner Bros. Pictures"
                  className={
                    inputClass
                  }
                />
              </Field>
            </div>
          </EditorPanel>

          <EditorPanel
            number="02"
            eyebrow="Copy Desk"
            title="Story & Introduction"
            description="The short movie description and editorial opening copy."
          >
            <div className="space-y-6">
              <Field label="Tagline">
                <textarea
                  value={
                    movie.tagline
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "tagline",
                      event
                        .target
                        .value,
                    )
                  }
                  rows={2}
                  placeholder="A short punchy line for the movie."
                  className={
                    textareaClass
                  }
                />
              </Field>

              <Field label="Synopsis">
                <textarea
                  value={
                    movie.synopsis
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "synopsis",
                      event
                        .target
                        .value,
                    )
                  }
                  rows={5}
                  placeholder="Official-style summary of what the film is about..."
                  className={
                    textareaClass
                  }
                />
              </Field>

              <Field label="Editorial introduction">
                <textarea
                  value={
                    movie.intro
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "intro",
                      event
                        .target
                        .value,
                    )
                  }
                  rows={6}
                  placeholder="The opening paragraph for The Movie Trailer's movie page..."
                  className={
                    textareaClass
                  }
                />
              </Field>
            </div>
          </EditorPanel>

          <EditorPanel
            number="03"
            eyebrow="Talent"
            title="Cast"
            description="Add the principal cast members in the order you want them displayed."
          >
            <div className="space-y-3">
              {movie.castMembers.map(
                (
                  castMember,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                    className="flex gap-3"
                  >
                    <input
                      value={
                        castMember
                      }
                      onChange={(
                        event,
                      ) =>
                        updateCastMember(
                          index,
                          event
                            .target
                            .value,
                        )
                      }
                      placeholder={`Cast member ${
                        index +
                        1
                      }`}
                      className={
                        inputClass.replace(
                          "mt-2 ",
                          "",
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeCastMember(
                          index,
                        )
                      }
                      className="min-w-12 border border-white/10 bg-[#0b0d10] text-lg font-black text-white/30 transition hover:border-[#f21f2b]/50 hover:text-[#f21f2b]"
                    >
                      ×
                    </button>
                  </div>
                ),
              )}
            </div>

            <button
  type="button"
  onClick={
    addCastMember
  }
  className="mt-4 border border-white/15 bg-[#111317] px-4 py-2.5 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:border-[#f21f2b]/60"
>
  + Add Cast Member
</button>
</EditorPanel>

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
  description="Attach curated actors, directors and other people associated with this movie."
/>

<EditorPanel
  number="04"
  eyebrow="Artwork"
            title="Movie Images"
            description="Upload the poster and cinematic backdrop used across the site."
          >
            <input
              ref={
                posterInputRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={
                handlePosterUpload
              }
            />

            <input
              ref={
                backdropInputRef
              }
              type="file"
              accept="image/*"
              hidden
              onChange={
                handleBackdropUpload
              }
            />

            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className={
                  labelClass
                }>
                  Poster
                </p>

                {movie.posterUrl ? (
                  <div
                    className="mt-3 aspect-[2/3] max-w-[260px] border border-white/10 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        `url("${movie.posterUrl}")`,
                    }}
                  />
                ) : (
                  <div className="mt-3 flex aspect-[2/3] max-w-[260px] items-center justify-center border border-dashed border-white/15 bg-[#090a0c] px-6 text-center text-sm font-semibold text-white/25">
                    No poster uploaded
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      posterInputRef
                        .current
                        ?.click()
                    }
                    disabled={
                      uploadingPoster
                    }
                    className="bg-[#f21f2b] px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-40"
                  >
                    {uploadingPoster
                      ? "Uploading..."
                      : movie.posterUrl
                        ? "Replace Poster"
                        : "Upload Poster"}
                  </button>

                  {movie.posterUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "posterUrl",
                          "",
                        )
                      }
                      className="border border-white/15 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white/60"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>

              <div>
                <p className={
                  labelClass
                }>
                  Backdrop / Hero
                </p>

                {movie.backdropUrl ? (
                  <div
                    className="mt-3 aspect-video w-full border border-white/10 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        `url("${movie.backdropUrl}")`,
                    }}
                  />
                ) : (
                  <div className="mt-3 flex aspect-video w-full items-center justify-center border border-dashed border-white/15 bg-[#090a0c] px-6 text-center text-sm font-semibold text-white/25">
                    No backdrop uploaded
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      backdropInputRef
                        .current
                        ?.click()
                    }
                    disabled={
                      uploadingBackdrop
                    }
                    className="bg-[#f21f2b] px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white disabled:opacity-40"
                  >
                    {uploadingBackdrop
                      ? "Uploading..."
                      : movie.backdropUrl
                        ? "Replace Backdrop"
                        : "Upload Backdrop"}
                  </button>

                  {movie.backdropUrl ? (
                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "backdropUrl",
                          "",
                        )
                      }
                      className="border border-white/15 px-4 py-2.5 text-xs font-black uppercase tracking-[0.12em] text-white/60"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            {imageMessage ? (
              <p className="mt-5 border border-white/10 bg-[#0b0d10] px-4 py-3 text-sm font-bold text-white/55">
                {imageMessage}
              </p>
            ) : null}
          </EditorPanel>

          <EditorPanel
            number="05"
            eyebrow="Feature"
            title="Sidebar Quote"
            description="Optional pull quote or short editorial statement for the movie page."
          >
            <textarea
              value={
                movie.sidebarQuote
              }
              onChange={(
                event,
              ) =>
                updateField(
                  "sidebarQuote",
                  event
                    .target
                    .value,
                )
              }
              rows={4}
              placeholder="A short memorable line or editorial pull quote..."
              className={
                textareaClass
              }
            />
          </EditorPanel>

          <EditorPanel
            number="06"
            eyebrow="Search"
            title="SEO"
            description="Custom metadata for search. Leave blank later if you want the public page to generate it automatically."
          >
            <div className="space-y-5">
              <Field label="SEO title">
                <input
                  value={
                    movie.seoTitle
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "seoTitle",
                      event
                        .target
                        .value,
                    )
                  }
                  placeholder={
                    movie.title &&
                    movie.year
                      ? `${movie.title} (${movie.year}) - Cast, Release Date & Trailer`
                      : "Movie title - Cast, Release Date & Trailer"
                  }
                  className={
                    inputClass
                  }
                />
              </Field>

              <Field label="Meta description">
                <textarea
                  value={
                    movie.metaDescription
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "metaDescription",
                      event
                        .target
                        .value,
                    )
                  }
                  rows={4}
                  placeholder="Custom Google search description..."
                  className={
                    textareaClass
                  }
                />
              </Field>

              <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.12em] text-white/25">
                <span>
                  Recommended around 150-160 characters
                </span>

                <span>
                  {movie.metaDescription.length}
                </span>
              </div>
            </div>
          </EditorPanel>

          <section>
            <div className="mb-6 flex flex-col gap-5 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-9 min-w-9 items-center justify-center bg-[#f21f2b] px-2 text-[10px] font-black text-white">
                    07
                  </span>

                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
                    Editorial
                  </p>
                </div>

                <h2 className="mt-4 text-2xl font-black uppercase tracking-[-0.025em] text-white">
                  Article Sections
                </h2>

                <p className="mt-2 text-sm font-medium leading-6 text-white/40">
                  Build the movie feature section by section.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  addSection
                }
                className="bg-[#f21f2b] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                + Add Section
              </button>
            </div>

            <div className="space-y-6">
              {movie.sections.map(
                (
                  section,
                  sectionIndex,
                ) => (
                  <div
                    key={
                      sectionIndex
                    }
                    className="border border-white/10 bg-[#0b0d10] p-5 md:p-7"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
                          Section{" "}
                          {String(
                            sectionIndex +
                              1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </p>

                        <h3 className="mt-1 text-lg font-black uppercase text-white">
                          {section.heading ||
                            "Untitled Section"}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeSection(
                            sectionIndex,
                          )
                        }
                        className="text-[10px] font-black uppercase tracking-[0.14em] text-white/35 transition hover:text-[#f21f2b]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <Field label="Eyebrow">
                        <input
                          value={
                            section.eyebrow
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSection(
                              sectionIndex,
                              "eyebrow",
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="The Story"
                          className={
                            inputClass
                          }
                        />
                      </Field>

                      <Field label="Section ID">
                        <input
                          value={
                            section.id
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSection(
                              sectionIndex,
                              "id",
                              createSlug(
                                event
                                  .target
                                  .value,
                              ),
                            )
                          }
                          placeholder="what-is-the-movie-about"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>

                    <div className="mt-5">
                      <Field label="Headline">
                        <input
                          value={
                            section.heading
                          }
                          onChange={(
                            event,
                          ) =>
                            updateSectionHeading(
                              sectionIndex,
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder="What Is Practical Magic 2 About?"
                          className={
                            inputClass
                          }
                        />
                      </Field>
                    </div>
                    <div className="mt-5">
  <Field label="YouTube video (optional)">
    <input
      value={
        section.youtubeUrl
      }
      onChange={(
        event,
      ) =>
        updateSectionYouTube(
          sectionIndex,
          event.target.value,
        )
      }
      placeholder="https://www.youtube.com/watch?v=..."
      className={
        inputClass
      }
    />
  </Field>

  {section.youtubeVideoId ? (
    <div className="mt-4 overflow-hidden border border-white/10 bg-black">
      <div className="aspect-video">
        <iframe
          src={`https://www.youtube.com/embed/${section.youtubeVideoId}?rel=0`}
          title={
            section.heading ||
            "YouTube video"
          }
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-[#0d0f12] px-4 py-3">
        <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
          Video Preview
        </p>

        <p className="text-[10px] font-bold text-white/30">
          {section.youtubeVideoId}
        </p>
      </div>
    </div>
  ) : section.youtubeUrl ? (
    <p className="mt-3 text-xs font-bold text-[#f21f2b]">
      We couldn&apos;t recognise that YouTube URL.
    </p>
  ) : null}
</div>

                    <div className="mt-6">
                      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-white/45">
                        Article Content
                      </p>

                      <RichTextEditor
                        content={
                          section.content
                        }
                        onChange={(
                          content,
                        ) =>
                          updateSection(
                            sectionIndex,
                            "content",
                            content,
                          )
                        }
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <div className="overflow-hidden border border-white/10 bg-[#0b0d10]">
            {movie.backdropUrl ? (
              <div
                className="aspect-video bg-cover bg-center"
                style={{
                  backgroundImage:
                    `linear-gradient(to top, rgba(5,6,7,.85), rgba(5,6,7,.05)), url("${movie.backdropUrl}")`,
                }}
              />
            ) : null}

            <div className="p-6">
              <p className="text-[9px] font-black uppercase tracking-[0.24em] text-[#f21f2b]">
                Live Preview
              </p>

              <div className="mt-5 flex gap-4">
                {movie.posterUrl ? (
                  <div
                    className="aspect-[2/3] w-[82px] shrink-0 border border-white/10 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        `url("${movie.posterUrl}")`,
                    }}
                  />
                ) : null}

                <div>
                  <h2 className="text-xl font-black leading-tight text-white">
                    {movie.title ||
                      "Untitled Movie"}
                  </h2>

                  <p className="mt-2 text-xs font-black uppercase tracking-[0.12em] text-[#f21f2b]">
                    {movie.year ||
                      "Year"}

                    {movie.genre
                      ? ` · ${movie.genre}`
                      : ""}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-white/45">
                {movie.tagline ||
                  movie.synopsis ||
                  "Movie description will appear here."}
              </p>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/25">
                  URL
                </p>

                <p className="mt-2 break-all text-xs font-bold text-[#f21f2b]">
                  /movies/
                  {movie.slug ||
                    "movie-slug"}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-white/10 bg-[#0b0d10] p-6">
  <div className="flex items-start justify-between gap-5">
    <div>
      <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
        Featured Movie
      </p>

      <p className="mt-3 text-sm font-medium leading-6 text-white/40">
        Feature this movie in the main hero on the Movies page.
      </p>
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={
        movie.isFeatured
      }
      onClick={() =>
        updateField(
          "isFeatured",
          !movie.isFeatured,
        )
      }
      className={`relative mt-1 h-7 w-12 shrink-0 rounded-full transition ${
        movie.isFeatured
          ? "bg-[#f21f2b]"
          : "bg-white/10"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${
          movie.isFeatured
            ? "left-6"
            : "left-1"
        }`}
      />
    </button>
  </div>

  <div className="mt-5 border-t border-white/10 pt-4">
    <p
      className={`text-[9px] font-black uppercase tracking-[0.18em] ${
        movie.isFeatured
          ? "text-[#f21f2b]"
          : "text-white/20"
      }`}
    >
      {movie.isFeatured
        ? "Selected as Featured Movie"
        : "Standard Movie"}
    </p>
  </div>
</div>

          <div className="border border-white/10 bg-[#0b0d10] p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/30">
                Publishing Status
              </p>

              <span
                className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] ${
                  currentStatus ===
                  "published"
                    ? "bg-[#f21f2b] text-white"
                    : "bg-white/10 text-white/55"
                }`}
              >
                {currentStatus}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium leading-6 text-white/40">
              {savedMovieId
                ? "This movie is saved in Supabase. Future saves will update the same record."
                : "This movie has not been saved yet."}
            </p>

            {savedMovieId ? (
              <p className="mt-4 break-all text-[10px] font-bold leading-5 text-white/20">
                ID:{" "}
                {savedMovieId}
              </p>
            ) : null}
          </div>

          <div className="border border-[#f21f2b]/25 bg-[#f21f2b]/5 p-6">
            <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
              Movie Hub
            </p>

            <p className="mt-4 text-sm font-medium leading-6 text-white/45">
              Once saved, this movie can become the central record for
              trailers, release information and related news.
            </p>

            <p className="mt-4 text-xs font-bold leading-5 text-white/25">
              Trailer and news linking controls are coming next.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

function EditorPanel({
  number,
  eyebrow,
  title,
  description,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  children:
    React.ReactNode;
}) {
  return (
    <section className="border border-white/10 bg-[#0b0d10] p-5 md:p-7">
      <div className="flex items-start gap-4">
        <span className="inline-flex h-9 min-w-9 items-center justify-center bg-[#f21f2b] px-2 text-[10px] font-black text-white">
          {number}
        </span>

        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.22em] text-[#f21f2b]">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-2xl font-black uppercase tracking-[-0.025em] text-white">
            {title}
          </h2>

          <p className="mt-2 text-sm font-medium leading-6 text-white/40">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-7 border-t border-white/10 pt-7">
        {children}
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children:
    React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={
        labelClass
      }>
        {label}
      </span>

      {children}
    </label>
  );
}