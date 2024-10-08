"use client";

import { useContext, useEffect, useState } from "react";
import { Game } from "./games";
import Prizes from "./prizes";
import { NumberObject } from "./numbers-grid";
import { createClient } from "@/utils/supabase/client";
import PreviousNumbers from "./previous-numbers";
import CurrentNumber from "./current-number";
import { LayoutContext } from "./reducers/layout/layout-reducer";
import { format } from "date-fns";
import Header from "./header";

export default function Projection({ game }: { game: Game }) {
  const [numbers, setNumbers] = useState<NumberObject[]>([]);
  const supabase = createClient();
  const { state: { layout }, dispatch } = useContext(LayoutContext);

  useEffect(() => {
    if (layout !== "main-projector") dispatch({ type: "SET_LAYOUT", payload: "projector" });

    const getData = async () => {
      const { data } = await supabase
        .from("numbers")
        .select()
        .eq("game", game.id);
      setNumbers(data || []);
    };
    getData();

    const channel = supabase
      .channel("numbers-projection-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "numbers",
          filter: `game=eq.${game.id}`,
        },
        (payload: any) => {
          switch (payload.eventType) {
            case "INSERT":
              setNumbers((oldNumbers) => [payload.new, ...oldNumbers]);
              break;
            case "DELETE":
              setNumbers((oldNumbers) =>
                oldNumbers.filter((number) => number.id !== payload.old.id)
              );
              break;
            case "UPDATE":
              setNumbers((oldNumbers) =>
                oldNumbers.map((number) =>
                  number.id === payload.old.id ? payload.new : number
                )
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      if (layout !== "main-projector") dispatch({ type: "SET_LAYOUT", payload: "main" });
    };
  }, []);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-5 flex-1">
        <div className="it_had_border_here bg-white rounded-lg shadow-lg p-4">
          <Header />
        </div>
        <div className="it_had_border_here bg-white rounded-lg shadow-lg p-4 text-2xl text-center">
          Jogo {game.number}
          <span className="h-full w-[1px] it_had_border_here-l mx-4 it_had_border_here-foreground/40" />
          {format(new Date(game.datetime), "dd/MM - HH:mm")}
        </div>
        <Prizes prizes={game.prizes || []} />
        <PreviousNumbers numbers={numbers} />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <CurrentNumber numbers={numbers} />
      </div>
    </div>
  );
}
