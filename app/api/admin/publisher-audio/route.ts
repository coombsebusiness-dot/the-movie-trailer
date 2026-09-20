import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generatePublisherAudio,
  getPublisherAudioStatus,
} from "@/lib/publisher-audio/client";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

export const runtime =
  "nodejs";

type GenerateRequest = {

  storyId?: string;
  title?: string;
  slug?: string;
  intro?: string;
  sections?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
  }[];
};

function cleanText(
  value?: string,
) {
  return (
    value
      ?.replace(
        /<[^>]*>/g,
        " ",
      )
      .replace(
        /\s+/g,
        " ",
      )
      .trim() ?? ""
  );
}

function buildNarration(
  payload: GenerateRequest,
) {
  const parts: string[] = [];

  const title =
    cleanText(
      payload.title,
    );

  const intro =
    cleanText(
      payload.intro,
    );

  if (title) {
    parts.push(title);
  }

  if (intro) {
    parts.push(intro);
  }

  for (
    const section of
      payload.sections ?? []
  ) {
    const headline =
      cleanText(
        section.headline,
      );

    const body =
      cleanText(
        section.body,
      );

    if (headline) {
      parts.push(headline);
    }

    if (body) {
      parts.push(body);
    }
  }

  return parts
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(
  request: NextRequest,
) {
  try {
    const payload =
      (await request.json()) as
        GenerateRequest;

    const storyId =
      payload.storyId?.trim();

    const title =
      cleanText(
        payload.title,
      );

    const slug =
      payload.slug
        ?.trim()
        .replace(
          /^\/+|\/+$/g,
          "",
        );

    if (!storyId) {
      return NextResponse.json(
        {
          error:
            "Story ID is required.",
        },
        {
          status: 400,
        },
      );
    }


    if (!title) {
      return NextResponse.json(
        {
          error:
            "Story title is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          error:
            "Story slug is required.",
        },
        {
          status: 400,
        },
      );
    }

    const text =
      buildNarration(
        payload,
      );

    if (!text) {
      return NextResponse.json(
        {
          error:
            "The story has no text to narrate.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    const {
      data: existingStory,
      error: existingStoryError,
    } = await supabase
      .from("news")
      .select(
        "publisher_audio_enabled, publisher_audio_article_id",
      )
      .eq(
        "id",
        storyId,
      )
      .maybeSingle();

    if (existingStoryError) {
      console.error(
        "Could not load current Publisher Audio player state:",
        existingStoryError,
      );

      return NextResponse.json(
        {
          error:
            "Audio generation started but TMT could not verify the current player state.",
        },
        {
          status: 500,
        },
      );
    }

    if (!existingStory) {
      return NextResponse.json(
        {
          error:
            "The TMT story was not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      existingStory.publisher_audio_article_id
    ) {
      return NextResponse.json(
        {
          error:
            "Publisher Audio has already been generated for this story.",
          articleId:
            existingStory.publisher_audio_article_id,
        },
        {
          status: 409,
        },
      );
    }

    const articleUrl =
      `https://the-movie-trailer.com/news/${slug}`;

    const result =
      await generatePublisherAudio(
        {
          title,
          articleUrl,
          text,
        },
      );

    const {
      error: persistError,
    } = await supabase
      .from("news")
      .update({
        publisher_audio_article_id:
          result.articleId,
        publisher_audio_voice_id:
          null,
        publisher_audio_status:
          "processing",
        publisher_audio_enabled:
          existingStory.publisher_audio_enabled ??
          false,
        publisher_audio_generated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        storyId,
      );

    if (persistError) {
      console.error(
        "Could not persist Publisher Audio generation:",
        persistError,
      );

      return NextResponse.json(
        {
          error:
            "Audio generation started but TMT could not save its Publisher Audio reference.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      result,
    );
  } catch (error) {
    console.error(
      "Publisher Audio generation failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Publisher Audio generation failed.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(
  request: NextRequest,
) {
  try {
    const articleId =
      request.nextUrl
        .searchParams
        .get(
          "articleId",
        );

    const storyId =
      request.nextUrl
        .searchParams
        .get(
          "storyId",
        );

    if (!articleId) {
      return NextResponse.json(
        {
          error:
            "articleId is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (!storyId) {
      return NextResponse.json(
        {
          error:
            "storyId is required.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      await getPublisherAudioStatus(
        articleId,
      );

    if (
      result.status === "ready" ||
      result.status === "failed"
    ) {
      const supabase =
        createAdminClient();

      const {
        error: persistError,
      } = await supabase
        .from("news")
        .update({
          publisher_audio_status:
            result.status,
        })
        .eq(
          "id",
          storyId,
        )
        .eq(
          "publisher_audio_article_id",
          articleId,
        );

      if (persistError) {
        console.error(
          "Could not persist Publisher Audio status:",
          persistError,
        );
      }
    }

    return NextResponse.json(
      result,
    );
  } catch (error) {
    console.error(
      "Publisher Audio status check failed:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not check Publisher Audio status.",
      },
      {
        status: 500,
      },
    );
  }
}


export async function PATCH(
  request: NextRequest,
) {
  try {
    const payload =
      (await request.json()) as {
        storyId?: string;
        enabled?: boolean;
      };

    const storyId =
      payload.storyId?.trim();

    if (!storyId) {
      return NextResponse.json(
        {
          error:
            "Story ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof payload.enabled !==
      "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "Enabled state is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    const {
      data: story,
      error: storyError,
    } = await supabase
      .from("news")
      .select(
        `
          id,
          publisher_audio_article_id,
          publisher_audio_status
        `,
      )
      .eq(
        "id",
        storyId,
      )
      .maybeSingle();

    if (
      storyError ||
      !story
    ) {
      return NextResponse.json(
        {
          error:
            storyError?.message ??
            "Story not found.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      payload.enabled &&
      (
        !story.publisher_audio_article_id ||
        story.publisher_audio_status !==
          "ready"
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Audio must be ready before the player can be enabled.",
        },
        {
          status: 400,
        },
      );
    }

    const {
      error: updateError,
    } = await supabase
      .from("news")
      .update({
        publisher_audio_enabled:
          payload.enabled,
      })
      .eq(
        "id",
        storyId,
      );

    if (updateError) {
      return NextResponse.json(
        {
          error:
            updateError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      enabled:
        payload.enabled,
    });
  } catch (error) {
    console.error(
      "Could not update Publisher Audio player state:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not update player state.",
      },
      {
        status: 500,
      },
    );
  }
}
