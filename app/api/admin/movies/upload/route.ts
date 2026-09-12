import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

function createSafeFileName(
  fileName: string,
) {
  return fileName
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9._-]+/g,
      "-",
    )
    .replace(
      /-+/g,
      "-",
    );
}

export async function POST(
  request: Request,
) {
  try {
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
            "No image file supplied.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only image files are allowed.",
        },
        {
          status:
            400,
        },
      );
    }

    const maxFileSize =
      10 *
      1024 *
      1024;

    if (
      file.size >
      maxFileSize
    ) {
      return NextResponse.json(
        {
          error:
            "Image must be smaller than 10MB.",
        },
        {
          status:
            400,
        },
      );
    }

    const supabase =
      createAdminClient();

    const safeFileName =
      createSafeFileName(
        file.name,
      );

    const filePath =
      `articles/${Date.now()}-${crypto.randomUUID()}-${safeFileName}`;

    const arrayBuffer =
      await file.arrayBuffer();

    const {
      error:
        uploadError,
    } =
      await supabase.storage
        .from(
          "movie-images",
        )
        .upload(
          filePath,
          Buffer.from(
            arrayBuffer,
          ),
          {
            contentType:
              file.type,

            cacheControl:
              "3600",

            upsert:
              false,
          },
        );

    if (
      uploadError
    ) {
      return NextResponse.json(
        {
          error:
            uploadError.message,
        },
        {
          status:
            500,
        },
      );
    }

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from(
          "movie-images",
        )
        .getPublicUrl(
          filePath,
        );

    return NextResponse.json({
      url:
        publicUrlData.publicUrl,
    });
  } catch (
    error
  ) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Image upload failed.",
      },
      {
        status:
          500,
      },
    );
  }
}