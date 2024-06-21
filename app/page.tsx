import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GamesDisplay from "@/components/games";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return <GamesDisplay />;
}
