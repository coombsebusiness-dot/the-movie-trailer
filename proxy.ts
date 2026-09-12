import {
  createServerClient,
} from "@supabase/ssr";

import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function proxy(
  request: NextRequest,
) {
  let response =
    NextResponse.next({
      request,
    });

  const supabase =
    createServerClient(
      process.env
        .NEXT_PUBLIC_SUPABASE_URL!,
      process.env
        .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },

          setAll(
            cookiesToSet,
          ) {
            cookiesToSet.forEach(
              ({
                name,
                value,
              }) =>
                request.cookies.set(
                  name,
                  value,
                ),
            );

            response =
              NextResponse.next({
                request,
              });

            cookiesToSet.forEach(
              ({
                name,
                value,
                options,
              }) =>
                response.cookies.set(
                  name,
                  value,
                  options,
                ),
            );
          },
        },
      },
    );

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  const pathname =
    request.nextUrl.pathname;

  /*
   * The login page must stay public,
   * otherwise we'd create a redirect loop.
   */
  const isLoginPage =
    pathname ===
    "/admin/login";

  const isAdminPage =
    pathname ===
      "/admin" ||
    pathname.startsWith(
      "/admin/",
    );

  const isAdminApi =
    pathname.startsWith(
      "/api/admin/",
    );

  /*
   * Protect newsroom pages.
   */
  if (
    isAdminPage &&
    !isLoginPage &&
    !user
  ) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/admin/login";

    loginUrl.search = "";

    return NextResponse.redirect(
      loginUrl,
    );
  }

  /*
   * Protect admin APIs separately.
   *
   * API callers receive JSON 401 rather
   * than an HTML redirect.
   */
  if (
    isAdminApi &&
    !user
  ) {
    return NextResponse.json(
      {
        success:
          false,

        error:
          "Unauthorized",
      },
      {
        status:
          401,
      },
    );
  }

  /*
   * Don't show the login page to somebody
   * who is already authenticated.
   */
  if (
    isLoginPage &&
    user
  ) {
    const adminUrl =
      request.nextUrl.clone();

    adminUrl.pathname =
      "/admin";

    adminUrl.search = "";

    return NextResponse.redirect(
      adminUrl,
    );
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};