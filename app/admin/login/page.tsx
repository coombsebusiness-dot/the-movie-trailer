import {
  redirect,
} from "next/navigation";

import AdminLoginForm from "@/components/admin/auth/AdminLoginForm";

import {
  createClient,
} from "@/lib/supabase/server";

export const dynamic =
  "force-dynamic";

export default async function AdminLoginPage() {
  const supabase =
    await createClient();

  const {
    data: {
      user,
    },
  } =
    await supabase.auth.getUser();

  /*
   * Already authenticated users do not
   * need to see the login screen again.
   */
  if (
    user
  ) {
    redirect(
      "/admin",
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050607] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
            The Movie Trailer
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Newsroom Login
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Authorised editorial access only.
          </p>
        </div>

        <section className="rounded-xl border border-white/10 bg-[#090b0d] p-6 shadow-2xl sm:p-8">
          <AdminLoginForm />
        </section>

        <p className="mt-5 text-center text-xs text-white/20">
          The Movie Trailer Editorial System
        </p>
      </div>
    </main>
  );
}