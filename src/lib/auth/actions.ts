"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; message?: string } | null;

function validate(email: string, password: string): string | null {
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return "Enter a valid email address.";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

/**
 * Single entry point for both sign-in and sign-up, chosen via the submit
 * button's `intent` value. Runs on the server, so credentials never touch
 * client bundles. On success it redirects to /dashboard; on failure it returns
 * a message for `useActionState` to render.
 */
export async function authenticate(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const intent = String(formData.get("intent") ?? "signin");
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const invalid = validate(email, password);
  if (invalid) return { error: invalid };

  const supabase = await createClient();

  if (intent === "signup") {
    const origin = (await headers()).get("origin") ?? "";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${origin}/auth/confirm?next=/dashboard` },
    });
    if (error) return { error: error.message };

    // If email confirmation is enabled, no session is returned yet.
    if (!data.session) {
      return {
        message: "Account created. Check your email to confirm, then sign in.",
      };
    }
  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
