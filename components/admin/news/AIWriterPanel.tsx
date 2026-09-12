"use client";

import {
  useState,
} from "react";

type GeneratedSection = {
  id: string;
  eyebrow: string;
  heading: string;
  content: string;
};

export type GeneratedArticle = {
  headline: string;
  slug: string;
  excerpt: string;
  category:
    | "movie-news"
    | "tv-news"
    | "trailers"
    | "casting"
    | "release-dates"
    | "horror"
    | "streaming"
    | "features";
  intro: string;
  sections: GeneratedSection[];
  seoTitle: string;
  metaDescription: string;
  sourceName: string;
  sourceUrl: string;
};

type AIWriterPanelProps = {
  onGenerated: (
    article: GeneratedArticle,
  ) => void;
};

export default function AIWriterPanel({
  onGenerated,
}: AIWriterPanelProps) {
  const [
    sourceName,
    setSourceName,
  ] = useState("");

  const [
    sourceHeadline,
    setSourceHeadline,
  ] = useState("");

  const [
    sourceUrl,
    setSourceUrl,
  ] = useState("");

  const [
    sourceSummary,
    setSourceSummary,
  ] = useState("");

  const [
    publishedAt,
    setPublishedAt,
  ] = useState("");

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState("");

  async function generateArticle() {
    setMessage("");

    if (!sourceName.trim()) {
      setMessage(
        "Enter the source publication.",
      );
      return;
    }

    if (!sourceHeadline.trim()) {
      setMessage(
        "Enter the source headline.",
      );
      return;
    }

    if (!sourceUrl.trim()) {
      setMessage(
        "Enter the source URL.",
      );
      return;
    }

    if (!sourceSummary.trim()) {
      setMessage(
        "Paste the factual source material.",
      );
      return;
    }

    setIsGenerating(true);

    try {
      const response =
        await fetch(
          "/api/admin/news/generate",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                sourceName:
                  sourceName.trim(),

                sourceHeadline:
                  sourceHeadline.trim(),

                sourceUrl:
                  sourceUrl.trim(),

                sourceSummary:
                  sourceSummary.trim(),

                publishedAt:
                  publishedAt
                    ? new Date(
                        publishedAt,
                      ).toISOString()
                    : null,
              }),
          },
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ??
            "Article generation failed.",
        );
      }

      if (
        !result.article
      ) {
        throw new Error(
          "No generated article was returned.",
        );
      }

      onGenerated(
        result.article,
      );

      setMessage(
        "Article generated. Review everything before publishing.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Article generation failed.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="border border-[#f21f2b]/30 bg-[#0b0d0f] p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f21f2b]">
            The Movie Trailer Writer
          </p>

          <h2 className="mt-2 text-2xl font-black tracking-[-0.03em]">
            Generate News Article
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
            Give the writer the factual
            reporting and it will populate
            the news editor. Nothing is
            published automatically.
          </p>
        </div>

        <div className="border border-white/10 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/35">
          OpenAI powered
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
            Source Publication
          </span>

          <input
            value={sourceName}
            onChange={(event) =>
              setSourceName(
                event.target.value,
              )
            }
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
            placeholder="Deadline"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
            Source Headline
          </span>

          <input
            value={sourceHeadline}
            onChange={(event) =>
              setSourceHeadline(
                event.target.value,
              )
            }
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
            placeholder="Original story headline"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_240px]">
        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
            Source URL
          </span>

          <input
            type="url"
            value={sourceUrl}
            onChange={(event) =>
              setSourceUrl(
                event.target.value,
              )
            }
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
            placeholder="https://..."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
            Published
          </span>

          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) =>
              setPublishedAt(
                event.target.value,
              )
            }
            className="w-full border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none transition focus:border-[#f21f2b]"
          />
        </label>
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-xs font-black uppercase tracking-[0.1em] text-white/50">
          Factual Source Material
        </span>

        <textarea
          value={sourceSummary}
          onChange={(event) =>
            setSourceSummary(
              event.target.value,
            )
          }
          rows={12}
          className="w-full border border-white/10 bg-black px-4 py-4 text-sm leading-7 text-white outline-none transition focus:border-[#f21f2b]"
          placeholder="Paste the source summary, notes or factual reporting here..."
        />

        <p className="mt-2 text-[10px] leading-5 text-white/30">
          The writer is instructed to use
          only the factual material supplied
          here and not invent missing
          details.
        </p>
      </label>

      <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-white/40">
          Generation uses OpenAI credits.
          Always review the resulting article
          before publishing.
        </p>

        <button
          type="button"
          disabled={isGenerating}
          onClick={() =>
            void generateArticle()
          }
          className="min-w-[220px] bg-[#f21f2b] px-6 py-4 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isGenerating
            ? "Writing Article..."
            : "Generate Article"}
        </button>
      </div>

      {message ? (
        <div className="mt-5 border border-white/10 bg-black px-4 py-3 text-sm text-white/60">
          {message}
        </div>
      ) : null}
    </section>
  );
}