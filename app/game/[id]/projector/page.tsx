import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
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
    <div className="flex flex-col gap-8">
      <div className="border rounded-lg p-4 text-2xl text-center">
        Jogo {game.number}
        <span className="h-full w-[1px] border-l mx-4 border-foreground/40" />
        {format(new Date(game.datetime), "dd/MM - HH:mm")}
      </div>
      <Projection game={game} />
    </div>
  );
}
