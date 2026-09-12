import {
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

function isValidEmail(
  email: string,
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email,
  );
}

export async function POST(
  request: Request,
) {
  try {
    const body =
      await request.json();

    const email =
      typeof body.email ===
      "string"
        ? body.email
            .trim()
            .toLowerCase()
        : "";

    if (
      !email ||
      !isValidEmail(email)
    ) {
      return NextResponse.json(
        {
          error:
            "Please enter a valid email address.",
        },
        {
          status: 400,
        },
      );
    }

    const supabase =
      createAdminClient();

    /*
     * Check whether this address
     * already exists.
     */
    const {
      data: existing,
      error: lookupError,
    } = await supabase
      .from(
        "newsletter_subscribers",
      )
      .select(
        `
          id,
          status
        `,
      )
      .eq(
        "email",
        email,
      )
      .maybeSingle();

    if (lookupError) {
      console.error(
        "Newsletter lookup failed:",
        lookupError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to subscribe right now. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    /*
     * Already subscribed.
     *
     * Return success rather than
     * exposing unnecessary account
     * information.
     */
    if (
      existing?.status ===
      "subscribed"
    ) {
      return NextResponse.json({
        success: true,
        message:
          "You're on the list.",
      });
    }

    /*
     * Existing address that was
     * previously unsubscribed.
     */
    if (existing) {
      const {
        error: updateError,
      } = await supabase
        .from(
          "newsletter_subscribers",
        )
        .update({
          status:
            "subscribed",
        })
        .eq(
          "id",
          existing.id,
        );

      if (updateError) {
        console.error(
          "Newsletter resubscribe failed:",
          updateError,
        );

        return NextResponse.json(
          {
            error:
              "Unable to subscribe right now. Please try again.",
          },
          {
            status: 500,
          },
        );
      }

      return NextResponse.json({
        success: true,
        message:
          "Welcome back. You're subscribed.",
      });
    }

    /*
     * Brand-new subscriber.
     */
    const {
      error: insertError,
    } = await supabase
      .from(
        "newsletter_subscribers",
      )
      .insert({
        email,
        status:
          "subscribed",
      });

    if (insertError) {
      console.error(
        "Newsletter signup failed:",
        insertError,
      );

      return NextResponse.json(
        {
          error:
            "Unable to subscribe right now. Please try again.",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "You're subscribed. Welcome to The Movie Trailer.",
    });
  } catch (error) {
    console.error(
      "Newsletter API error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to subscribe right now. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}