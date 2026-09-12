import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

let client:
  SupabaseClient | null =
  null;

export function createPleaseRewindClient() {
  if (client) {
    return client;
  }

  const url =
    process.env
      .PLEASE_REWIND_SUPABASE_URL;

  const anonKey =
    process.env
      .PLEASE_REWIND_SUPABASE_ANON_KEY;

  if (
    !url ||
    !anonKey
  ) {
    throw new Error(
      "Please Rewind Supabase credentials are not configured.",
    );
  }

  client =
    createClient(
      url,
      anonKey,
      {
        auth: {
          persistSession:
            false,
          autoRefreshToken:
            false,
          detectSessionInUrl:
            false,
        },
      },
    );

  return client;
}