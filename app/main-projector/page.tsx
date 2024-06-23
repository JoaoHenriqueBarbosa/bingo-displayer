"use client";

import { Game } from "@/components/games";
import Projection from "@/components/projection";
import { LayoutContext } from "@/components/reducers/layout/layout-reducer";
import { createClient } from "@/utils/supabase/client";
import { useContext, useEffect, useState } from "react";

export default function MainProjector() {
  const {
    dispatch,
  } = useContext(LayoutContext);
  const supabase = createClient();
  const [currentGame, setCurrentGame] = useState<Game | null>(null);

  useEffect(() => {
    dispatch({ type: "SET_LAYOUT", payload: "main-projector" });

    const getGame = async () => {
      const { data } = await supabase
        .from("shared-context")
        .select()
        .eq("id", 1);

      const { data: gameData } = await supabase
        .from("games")
        .select()
        .eq("id", data?.[0].current_game);

      setCurrentGame(gameData?.[0] || null);
    };
    getGame();

    const channel = supabase
      .channel("main-projector-update-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "shared-context",
          filter: "id=eq.1",
        },
        async (payload: any) => {
					setCurrentGame(null);

          const { data: gameData } = await supabase
            .from("games")
            .select()
            .eq("id", payload.new.current_game);

					await new Promise((resolve) => setTimeout(resolve, 1000));

          setCurrentGame(gameData?.[0] || null);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
      dispatch({ type: "SET_LAYOUT", payload: "main" });
    };
  }, []);

  if (currentGame) {
    return (
      <div className="p-5">
        <Projection game={currentGame} />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white rounded-lg it_had_border_here shadow-lg p-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-4 mt-2 text-center">
          Aguarde um momento
        </h2>
        <p className="text-gray-600 text-center mb-1 text-2xl">
          Por favor, aguarde...
        </p>
        <p className="text-gray-600 text-center mb-2 text-2xl">
          O jogo começará em breve.
        </p>
      </div>
    </div>
  );
}
