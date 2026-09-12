"use client";

import {
  useRouter,
} from "next/navigation";

import {
  useState,
} from "react";

type IngestResult = {
  success: boolean;
  sourcesChecked?: number;
  itemsSeen?: number;
  inserted?: number;
  skipped?: number;
  failedSources?: number;
  errors?: string[];
  error?: string;
};

export default function NewsRadarRefreshButton() {
  const router =
    useRouter();

  const [
    isRefreshing,
    setIsRefreshing,
  ] =
    useState(false);

  const [
    message,
    setMessage,
  ] =
    useState<string | null>(
      null,
    );

  async function refreshRadar() {
    if (
      isRefreshing
    ) {
      return;
    }

    setIsRefreshing(
      true,
    );

    setMessage(
      "Checking entertainment feeds...",
    );

    try {
      const response =
        await fetch(
          "/api/admin/news-radar/ingest",
          {
            method:
              "POST",
          },
        );

      const result =
        (await response.json()) as IngestResult;

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.error ??
            "Radar refresh failed.",
        );
      }

      const parts = [
        `${result.sourcesChecked ?? 0} sources checked`,
        `${result.inserted ?? 0} new stories`,
        `${result.skipped ?? 0} already seen`,
      ];

      if (
        (result.failedSources ??
          0) >
        0
      ) {
        parts.push(
          `${result.failedSources} feed failures`,
        );
      }

      setMessage(
        parts.join(
          " · ",
        ),
      );

      router.refresh();
    } catch (
      error
    ) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Radar refresh failed.",
      );
    } finally {
      setIsRefreshing(
        false,
      );
    }
  }

  return (
    <div className="flex flex-col items-start gap-2 lg:items-end">
      <button
        type="button"
        onClick={
          refreshRadar
        }
        disabled={
          isRefreshing
        }
        className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isRefreshing
          ? "Scanning..."
          : "Refresh Radar"}
      </button>

      {message && (
        <p className="max-w-md text-xs font-semibold text-white/40 lg:text-right">
          {
            message
          }
        </p>
      )}
    </div>
  );
}