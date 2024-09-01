import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">

      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
{/*         <p>
          Você pode user:
          <br />
          <strong>admin@admin.com</strong> e <strong>admin</strong> como senha
        </p> */}
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md mt-0" htmlFor="password">
          Senha
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border !mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-green-700 rounded-md px-4 py-2 text-foreground"
          pendingText="Entrando..."
        >
          Entrar
        </SubmitButton>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
    </div>
  );
}
