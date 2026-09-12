import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const maxFileSize =
  8 * 1024 * 1024;

function safeFilename(
  filename: string,
) {
  const extension =
    filename
      .split(".")
      .pop()
      ?.toLowerCase() ??
    "jpg";

  const base =
    filename
      .replace(
        /\.[^/.]+$/,
        "",
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        "-",
      )
      .replace(
        /^-+|-+$/g,
        "",
      ) ||
    "review-image";

  return `${base}-${crypto.randomUUID()}.${extension}`;
}

export async function POST(
  request: Request,
) {
  const formData =
    await request.formData();

  const file =
    formData.get(
      "file",
    );

  if (
    !(file instanceof File)
  ) {
    return NextResponse.json(
      {
        error:
          "No image file received.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    !allowedTypes.has(
      file.type,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Only JPG, PNG and WebP images are allowed.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    file.size >
    maxFileSize
  ) {
    return NextResponse.json(
      {
        error:
          "Image must be smaller than 8MB.",
      },
      {
        status: 400,
      },
    );
  }

  const supabase =
    createAdminClient();

  const filename =
    safeFilename(
      file.name,
    );

  const path =
    `reviews/${filename}`;

  const buffer =
    Buffer.from(
      await file.arrayBuffer(),
    );

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from(
        "news-images",
      )
      .upload(
        path,
        buffer,
        {
          contentType:
            file.type,
          upsert:
            false,
          cacheControl:
            "31536000",
        },
      );

  if (uploadError) {
    return NextResponse.json(
      {
        error:
          uploadError.message,
      },
      {
        status: 500,
      },
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        "news-images",
      )
      .getPublicUrl(
        path,
      );

  return NextResponse.json({
    url:
      data.publicUrl,
    path,
  });
}
