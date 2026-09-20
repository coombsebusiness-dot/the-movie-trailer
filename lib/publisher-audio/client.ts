export type GeneratePublisherAudioInput = {
  title: string;
  articleUrl: string;
  text: string;
};

export type GeneratePublisherAudioResult = {
  articleId: string;
  taskId: string;
  status: string;
  storageKey: string;
  characters: number;
};

export type PublisherAudioStatusResult = {
  articleId: string;
  status:
    | "pending"
    | "processing"
    | "ready"
    | "failed";
  characters: number;
};

function getPublisherAudioUrl() {
  const url =
    process.env.PUBLISHER_AUDIO_URL;

  if (!url) {
    throw new Error(
      "PUBLISHER_AUDIO_URL is not configured.",
    );
  }

  return url.replace(/\/+$/, "");
}

function getPublisherAudioApiKey() {
  const apiKey =
    process.env.PUBLISHER_AUDIO_API_KEY;

  if (!apiKey) {
    throw new Error(
      "PUBLISHER_AUDIO_API_KEY is not configured.",
    );
  }

  return apiKey;
}

export async function generatePublisherAudio(
  input: GeneratePublisherAudioInput,
): Promise<GeneratePublisherAudioResult> {
  const response =
    await fetch(
      `${getPublisherAudioUrl()}/api/articles/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${getPublisherAudioApiKey()}`,
        },
        body: JSON.stringify({
          title:
            input.title,
          articleUrl:
            input.articleUrl,
          text:
            input.text,
        }),
        cache: "no-store",
      },
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ??
        "Publisher Audio generation failed.",
    );
  }

  return result;
}

export async function getPublisherAudioStatus(
  articleId: string,
): Promise<PublisherAudioStatusResult> {
  const response =
    await fetch(
      `${getPublisherAudioUrl()}/api/articles/status?articleId=${encodeURIComponent(
        articleId,
      )}`,
      {
        headers: {
          Authorization:
            `Bearer ${getPublisherAudioApiKey()}`,
        },
        cache: "no-store",
      },
    );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ??
        "Could not check Publisher Audio status.",
    );
  }

  return result;
}

export function getPublisherAudioPlayerUrl(
  articleId: string,
) {
  return `${getPublisherAudioUrl()}/player/${encodeURIComponent(
    articleId,
  )}`;
}
