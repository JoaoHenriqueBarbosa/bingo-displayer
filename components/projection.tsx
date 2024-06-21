"use client";

import { useEffect, useState } from "react";
import { Game } from "./games";
import Prizes from "./prizes";
import { NumberObject } from "./numbers-grid";
import { createClient } from "@/utils/supabase/client";
import PreviousNumbers from "./previous-numbers";
import CurrentNumber from "./current-number";

export default function Projection({ game }: { game: Game }) {
  const [numbers, setNumbers] = useState<NumberObject[]>([]);
  const supabase = createClient();

  useEffect(() => {
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
              setNumbers((oldNumbers) => [...oldNumbers, payload.new]);
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
    };
  }, []);

  return (
    <div className="flex gap-5">
      <div className="flex flex-col gap-8 flex-1">
        <Prizes prizes={game.prizes || []} />
        <PreviousNumbers numbers={numbers} />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <CurrentNumber numbers={numbers} />
      </div>
    </div>
  );
}
