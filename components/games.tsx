"use client";

import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import GameForm from "./game-form";
import { Database } from "@/utils/supabase/types";
import Link from "next/link";
import { cn } from "@/utils/tw";

type FormState = {
  open: boolean;
  editing?: any | null;
};

export type Game = Database["public"]["Tables"]["games"]["Row"];

export default function GamesDisplay() {
  const [formState, setFormState] = useState<FormState>({
    open: false,
    editing: null,
  });
  const [games, setGames] = useState<Game[]>([]);
  const supabase = createClient();
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("games").select();
      setGames(data || []);
    };
    getData();

    const channel = supabase
      .channel("games-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "games" },
        (payload: any) => {
          switch (payload.eventType) {
            case "INSERT":
              setGames((oldGames) => [...oldGames, payload.new]);
              break;
            case "DELETE":
              setGames((oldGames) =>
                oldGames.filter((game) => game.id !== payload.old.id)
              );
              break;
            case "UPDATE":
              setGames((oldGames) =>
                oldGames.map((game) =>
                  game.id === payload.old.id ? payload.new : game
                )
              );
              break;
            default:
              break;
          }
        }
      )
      .subscribe();

    const getGame = async () => {
      const { data } = await supabase
        .from("shared-context")
        .select()
        .eq("id", 1);

      setCurrentGameId(data?.[0].current_game);
    };
    getGame();

    const channel2 = supabase
      .channel("games-current-game-update-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared-context",
          filter: "id=eq.1",
        },
        async (payload: any) => {
          setCurrentGameId(payload.new.current_game);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      channel2.unsubscribe();
    };
  }, []);

  const onFormClose = useCallback(() => {
    setFormState({ open: false });
  }, []);

  const onGameSelect = async (game: Game) => {
    const currentId = currentGameId === game.id ? null : game.id;
    console.log(currentId);
    await supabase
      .from("shared-context")
      .update({ current_game: currentId })
      .eq("id", 1);
  };

  return (
    <div className="relative">
      {formState.open && (
        <GameForm editing={formState.editing} onClose={onFormClose} />
      )}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold mb-4">Jogos</h2>
        <button onClick={() => setFormState({ open: true })}>Novo jogo</button>
      </div>
      <ul>
        {games.map((game) => (
          <li
            key={game.id}
            className="it_had_border_here bg-white rounded-lg shadow-lg p-2 mb-2 flex justify-between items-center pl-6 pr-4"
          >
            <p className="m-0 text-primary-darken font-semibold">
              {format(new Date(game.datetime), "dd/MM - HH:mm")} &nbsp;|
              &nbsp;Jogo {game.number} &nbsp;| &nbsp;
              {game.prizes?.map((prize: string) => prize).join(", ")}
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => onGameSelect(game)}
                className={cn("m-0", {
                  "bg-white text-primary-darken hover:bg-primary-darken hover:text-white":
                    currentGameId !== game.id,
                })}
              >
                {currentGameId === game.id ? "Jogo atual" : "Selecionar"}
              </button>
              <Link
                href={`/game/${game.id}/check-numbers`}
                title="Marcar números"
                role="button"
                className="action-button"
              >
                ☑️
              </Link>
              <Link
                href={`/game/${game.id}/projector`}
                title="Projetar"
                role="button"
                className="action-button"
              >
                📽️
              </Link>
              <button
                className="action-button"
                title="Editar"
                onClick={() => setFormState({ open: true, editing: game })}
              >
                ✏️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
