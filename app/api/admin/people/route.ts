import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createPleaseRewindClient,
} from "@/lib/supabase/pleaseRewind";

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      await request.json();

    const sourceActorId =
      typeof body.sourceActorId ===
      "string"
        ? body.sourceActorId.trim()
        : "";

    if (!sourceActorId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Actor ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * Verify the actor actually
     * exists in Please Rewind.
     */
    const pleaseRewind =
      createPleaseRewindClient();

    const {
      data: actor,
      error: actorError,
    } =
      await pleaseRewind
        .from("actors")
        .select(`
          id,
          slug,
          name,
          status
        `)
        .eq(
          "id",
          sourceActorId,
        )
        .eq(
          "status",
          "published",
        )
        .maybeSingle();

    if (
      actorError ||
      !actor
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Published actor not found in Please Rewind.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * Store only the relationship
     * inside The Movie Trailer.
     */
    const supabase =
  createAdminClient();

    const {
      data: person,
      error: insertError,
    } =
      await supabase
        .from(
          "featured_people",
        )
        .insert({
          source_actor_id:
            actor.id,
          slug:
            actor.slug,
          featured: false,
          status: "active",
        })
        .select(`
          id,
          source_actor_id,
          slug,
          featured,
          status,
          sort_order,
          created_at,
          updated_at
        `)
        .single();

    if (insertError) {
      if (
        insertError.code ===
        "23505"
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              `${actor.name} is already on The Movie Trailer.`,
          },
          {
            status: 409,
          },
        );
      }

      console.error(
        "Failed to add person:",
        insertError,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            insertError.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      person,
      actor: {
        id: actor.id,
        slug: actor.slug,
        name: actor.name,
      },
    });
  } catch (error) {
    console.error(
      "Add person error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
  }
}

export async function DELETE(
  request: NextRequest,
) {
  try {
    const id =
      request.nextUrl
        .searchParams
        .get("id")
        ?.trim();

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Person ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    const {
      error,
    } =
      await supabase
        .from(
          "featured_people",
        )
        .delete()
        .eq(
          "id",
          id,
        );

    if (error) {
      console.error(
        "Failed to remove person:",
        error,
      );

      return NextResponse.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Remove person error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      },
    );
    
  }
  
}
export async function PATCH(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const {
      id,
      featured,
      sortOrder,
    } = body as {
      id?: string;
      featured?: boolean;
      sortOrder?: number;
    };

    if (!id) {
      return Response.json(
        {
          success: false,
          error:
            "Person ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      typeof featured !==
        "boolean" &&
      typeof sortOrder !==
        "number"
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Featured or sort order is required.",
        },
        {
          status: 400,
        },
      );
    }

    const updates: {
      featured?: boolean;
      sort_order?: number;
    } = {};

    if (
      typeof featured ===
      "boolean"
    ) {
      updates.featured =
        featured;
    }

    if (
      typeof sortOrder ===
      "number"
    ) {
      updates.sort_order =
        sortOrder;
    }

    const supabase =
      createAdminClient();

    const {
      data,
      error,
    } = await supabase
      .from(
        "featured_people",
      )
      .update(
        updates,
      )
      .eq(
        "id",
        id,
      )
      .select(`
        id,
        source_actor_id,
        slug,
        featured,
        status,
        sort_order
      `)
      .single();

    if (error) {
      return Response.json(
        {
          success: false,
          error:
            error.message,
        },
        {
          status: 500,
        },
      );
    }

    return Response.json({
      success: true,
      person: data,
    });
  } catch (error) {
    console.error(
      "People PATCH failed:",
      error,
    );

    return Response.json(
      {
        success: false,
        error:
          "Could not update person.",
      },
      {
        status: 500,
      },
    );
  }
}