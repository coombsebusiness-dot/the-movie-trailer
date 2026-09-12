"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

type ContentType =
  | "news"
  | "movie"
  | "trailer";

type ContentItem = {
  id: string;
  type: ContentType;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
};

type CurrentFeatured = {
  content_type: string;
  content_id: string;
  eyebrow: string | null;
  headline: string | null;
  excerpt: string | null;
  image_url: string | null;
} | null;

type FeaturedManagerProps = {
  items: ContentItem[];
  currentFeatured:
    CurrentFeatured;
};

export default function FeaturedManager({
  items,
  currentFeatured,
}: FeaturedManagerProps) {
  const router =
    useRouter();

  const initialType =
    currentFeatured?.content_type ===
      "movie" ||
    currentFeatured?.content_type ===
      "trailer" ||
    currentFeatured?.content_type ===
      "news"
      ? currentFeatured.content_type
      : "news";

  const [
    contentType,
    setContentType,
  ] =
    useState<ContentType>(
      initialType,
    );

  const [
    contentId,
    setContentId,
  ] =
    useState(
      currentFeatured?.content_id ??
        "",
    );

  const [
    eyebrow,
    setEyebrow,
  ] =
    useState(
      currentFeatured?.eyebrow ??
        "",
    );

  const [
    headline,
    setHeadline,
  ] =
    useState(
      currentFeatured?.headline ??
        "",
    );

  const [
    excerpt,
    setExcerpt,
  ] =
    useState(
      currentFeatured?.excerpt ??
        "",
    );

  const [
    imageUrl,
    setImageUrl,
  ] =
    useState(
      currentFeatured?.image_url ??
        "",
    );

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState("");

  const filteredItems =
    useMemo(
      () =>
        items.filter(
          (
            item,
          ) =>
            item.type ===
            contentType,
        ),
      [
        items,
        contentType,
      ],
    );

  const selectedItem =
    items.find(
      (
        item,
      ) =>
        item.id ===
        contentId,
    );

  function changeType(
    nextType: ContentType,
  ) {
    setContentType(
      nextType,
    );

    setContentId("");

    setEyebrow("");
    setHeadline("");
    setExcerpt("");
    setImageUrl("");

    setMessage("");
  }

  async function saveFeatured() {
    if (!contentId) {
      setMessage(
        "Choose something to feature first.",
      );

      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response =
        await fetch(
          "/api/admin/homepage-featured",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                contentType,
                contentId,
                eyebrow,
                headline,
                excerpt,
                imageUrl,
              }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to save featured item.",
        );
      }

      setMessage(
        "Homepage featured item updated.",
      );

      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save featured item.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <section className="border border-white/10 bg-[#090b0d] p-6 md:p-8">
        <div className="border-b border-white/10 pb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#f21f2b]">
            Homepage
          </p>

          <h2 className="mt-2 text-2xl font-black uppercase tracking-[-0.04em]">
            Choose Featured Content
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            Choose the story,
            movie or trailer that
            should own the main
            featured position on
            the homepage.
          </p>
        </div>

        <div className="mt-7">
          <label className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
            Content Type
          </label>

          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                "news",
                "movie",
                "trailer",
              ] as ContentType[]
            ).map(
              (
                type,
              ) => (
                <button
                  key={
                    type
                  }
                  type="button"
                  onClick={() =>
                    changeType(
                      type,
                    )
                  }
                  className={`px-4 py-3 text-[10px] font-black uppercase tracking-[0.14em] transition ${
                    contentType ===
                    type
                      ? "bg-[#f21f2b] text-white"
                      : "border border-white/10 bg-[#050607] text-white/45 hover:text-white"
                  }`}
                >
                  {
                    type
                  }
                </button>
              ),
            )}
          </div>
        </div>

        <div className="mt-7">
          <label
            htmlFor="featured-content"
            className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35"
          >
            Choose Content
          </label>

          <select
            id="featured-content"
            value={
              contentId
            }
            onChange={(
              event,
            ) => {
              setContentId(
                event.target
                  .value,
              );

              setMessage("");
            }}
            className="mt-3 w-full border border-white/10 bg-[#050607] px-4 py-4 text-sm font-bold text-white outline-none focus:border-[#f21f2b]"
          >
            <option value="">
              Select{" "}
              {contentType}
            </option>

            {filteredItems.map(
              (
                item,
              ) => (
                <option
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                >
                  {
                    item.title
                  }
                </option>
              ),
            )}
          </select>
        </div>

        <div className="mt-9 border-t border-white/10 pt-7">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              Optional Overrides
            </p>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Leave these blank
              and the homepage will
              use the original
              content automatically.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <Field
              label="Eyebrow"
              value={
                eyebrow
              }
              onChange={
                setEyebrow
              }
              placeholder="e.g. Exclusive"
            />

            <Field
              label="Headline"
              value={
                headline
              }
              onChange={
                setHeadline
              }
              placeholder="Custom homepage headline"
            />

            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
                Excerpt
              </label>

              <textarea
                value={
                  excerpt
                }
                onChange={(
                  event,
                ) =>
                  setExcerpt(
                    event.target
                      .value,
                  )
                }
                rows={5}
                placeholder="Optional custom homepage excerpt"
                className="mt-2 w-full resize-y border border-white/10 bg-[#050607] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-[#f21f2b]"
              />
            </div>

            <Field
              label="Image URL"
              value={
                imageUrl
              }
              onChange={
                setImageUrl
              }
              placeholder="Optional image override"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={
              saveFeatured
            }
            disabled={
              saving ||
              !contentId
            }
            className="bg-[#f21f2b] px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
          >
            {saving
              ? "Saving..."
              : "Set Featured"}
          </button>

          {message ? (
            <p className="text-xs font-bold text-white/50">
              {
                message
              }
            </p>
          ) : null}
        </div>
      </section>

      <aside className="h-fit self-start">
        <div className="border border-white/10 bg-[#090b0d]">
          <div className="border-b border-white/10 px-5 py-4">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
              Preview
            </p>
          </div>

          {selectedItem ? (
            <div>
              {(imageUrl ||
                selectedItem.imageUrl) ? (
                <div className="aspect-video overflow-hidden bg-black">
                  <img
                    src={
                      imageUrl ||
                      selectedItem.imageUrl ||
                      ""
                    }
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="movie-card-image flex aspect-video items-center justify-center">
                  <span className="text-[9px] font-black uppercase tracking-[0.16em] text-white/15">
                    Featured
                  </span>
                </div>
              )}

              <div className="p-6">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#f21f2b]">
                  {eyebrow ||
                    contentType}
                </p>

                <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em]">
                  {headline ||
                    selectedItem.title}
                </h3>

                {(excerpt ||
                  selectedItem.subtitle) ? (
                  <p className="mt-4 text-sm leading-6 text-white/45">
                    {excerpt ||
                      selectedItem.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm font-bold text-white/30">
                Choose an item to
                preview it here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {
          label
        }
      </label>

      <input
        type="text"
        value={
          value
        }
        onChange={(
          event,
        ) =>
          onChange(
            event.target
              .value,
          )
        }
        placeholder={
          placeholder
        }
        className="mt-2 w-full border border-white/10 bg-[#050607] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-[#f21f2b]"
      />
    </div>
  );
}