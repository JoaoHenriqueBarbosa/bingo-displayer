"use client";

import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import GameForm from "./game-form";
import { Database } from "@/utils/supabase/types";
import Link from "next/link";

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

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const onFormClose = useCallback(() => {
    setFormState({ open: false });
  }, []);

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
            className="border rounded-lg p-2 mb-2 flex justify-between items-center pl-6 pr-4"
          >
            <p className="m-0 text-primary-darken font-semibold">
              {format(new Date(game.datetime), "dd/MM - HH:mm")} &nbsp;|
              &nbsp;Jogo {game.number} &nbsp;| &nbsp;
              {game.prizes?.map((prize: string) => prize).join(", ")}
            </p>
            <div className="flex gap-2">
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
