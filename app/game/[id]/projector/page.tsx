import { createClient } from "@/utils/supabase/server";
import Projection from "@/components/projection";

export default async function CheckNumbers({
  params,
}: {
  params: { id: number };
}) {
  const supabase = createClient();
  const { data: game } = await supabase
    .from("games")
    .select()
    .eq("id", params.id)
    .single();

  return (
    <div className="p-5">
      <Projection game={game} />
    </div>
  );
}
