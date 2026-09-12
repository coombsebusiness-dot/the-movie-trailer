import {
  NextResponse,
} from "next/server";

import {
  writeNewsArticle,
} from "@/lib/news/NewsArticleWriter";

function cleanString(
  value: unknown,
) {
  return typeof value ===
    "string"
    ? value.trim()
    : "";
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const sourceName =
      cleanString(
        body.sourceName,
      );

    const sourceUrl =
      cleanString(
        body.sourceUrl,
      );

    const sourceHeadline =
      cleanString(
        body.sourceHeadline,
      );

    const sourceSummary =
      cleanString(
        body.sourceSummary,
      );

    const publishedAt =
      cleanString(
        body.publishedAt,
      );

    if (!sourceName) {
      return NextResponse.json(
        {
          error:
            "Source publication is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!sourceUrl) {
      return NextResponse.json(
        {
          error:
            "Source URL is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!sourceHeadline) {
      return NextResponse.json(
        {
          error:
            "Source headline is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!sourceSummary) {
      return NextResponse.json(
        {
          error:
            "Source material is required.",
        },
        {
          status: 400,
        },
      );
    }

    try {
      const parsedUrl =
        new URL(
          sourceUrl,
        );

      if (
        parsedUrl.protocol !==
          "https:" &&
        parsedUrl.protocol !==
          "http:"
      ) {
        throw new Error();
      }
    } catch {
      return NextResponse.json(
        {
          error:
            "Please enter a valid source URL.",
        },
        {
          status: 400,
        },
      );
    }

    const article =
      await writeNewsArticle(
        {
          sourceName,
          sourceUrl,
          sourceHeadline,
          sourceSummary,
          publishedAt:
            publishedAt ||
            null,
        },
      );

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Article generation failed.";

    console.error(
      "[NEWS WRITER] Generation failed:",
      message,
    );

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}