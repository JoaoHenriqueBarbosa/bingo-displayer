import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { NumbersGrid } from "@/components/numbers-grid";

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
    <div>
      <div className="it_had_border_here bg-white rounded-lg shadow-lg p-2 mb-2 pl-6 pr-4">
        {format(new Date(game.datetime), "dd/MM - HH:mm")} &nbsp;| &nbsp;Jogo{" "}
        {game.number} &nbsp;| &nbsp;
        {game.prizes?.map((prize: string) => prize).join(", ")}
      </div>
      <NumbersGrid gameId={params.id} />
    </div>
  );
}
