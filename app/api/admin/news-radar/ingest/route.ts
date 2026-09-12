import {
  NextResponse,
} from "next/server";

import {
  ingestNewsFeeds,
} from "@/lib/news/NewsFeedIngestor";

function getErrorMessage(
  error: unknown,
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error ===
      "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(
      (
        error as {
          message?: unknown;
        }
      ).message,
    );
  }

  try {
    return JSON.stringify(
      error,
    );
  } catch {
    return String(
      error,
    );
  }
}

export async function POST() {
  try {
    const result =
      await ingestNewsFeeds();

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (
    error
  ) {
    const message =
      getErrorMessage(
        error,
      );

    console.error(
      "[TMT NEWS RADAR] Ingest route failed:",
      message,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          message,
      },
      {
        status: 500,
      },
    );
  }
}