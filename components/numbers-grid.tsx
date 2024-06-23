"use client";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/types";
import { useEffect, useRef, useState } from "react";

export const lettersAndNumbers = [
  { letter: "B", maxNumber: 15 },
  { letter: "I", maxNumber: 30 },
  { letter: "N", maxNumber: 45 },
  { letter: "G", maxNumber: 60 },
  { letter: "O", maxNumber: 75 },
];

export type NumberObject = Database["public"]["Tables"]["numbers"]["Row"];

export function NumbersGrid({ gameId: game }: { gameId: number }) {
  const [selectNumber, setSelectNumber] = useState<number | null>(null);
  const firstNumberSelectedAux = useRef<number | null>(null);
  const [numbers, setNumbers] = useState<NumberObject[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("numbers").select().eq("game", game);
      setNumbers(data || []);
    };
    getData();

    const channel = supabase
      .channel("numbers-grid-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "numbers",
          filter: `game=eq.${game}`,
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

  useEffect(() => {
    const handleNumpadKeyDown = (event: KeyboardEvent) => {
      if (event.key === ",") {
        setSelectNumber(null);
        firstNumberSelectedAux.current = null;
      }

      if (Array.from("0123456789").includes(event.key)) {
        let toSelect = null;
        if (firstNumberSelectedAux.current === null) {
          firstNumberSelectedAux.current = Number(event.key);
          toSelect = Number(event.key);
        } else {
          toSelect = Number(
            firstNumberSelectedAux.current.toString() + event.key
          );
        }
        setSelectNumber(toSelect);

        const numberEl = document.getElementById(`number-${toSelect}`);
        numberEl?.focus();

        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleNumpadKeyDown);

    return () => {
      window.removeEventListener("keydown", handleNumpadKeyDown);
    };
  }, []);

  const handleNumberClick = async (number: number) => {
    setSelectNumber(null);
    firstNumberSelectedAux.current = null;
    const numberExists = await supabase
      .from("numbers")
      .select()
      .eq("game", game)
      .eq("number", number)
      .single();

    if (numberExists.data) {
      await supabase.from("numbers").delete().eq("id", numberExists.data.id);
      const container = document.getElementById("numbers-grid");
      container?.focus();
    } else {
      await supabase.from("numbers").insert({ game, number }).select();
    }
  };

  return (
    <div id="numbers-grid" tabIndex={0}>
      {lettersAndNumbers.map(({ letter, maxNumber }, letterIndex) => (
        <div
          key={letter}
          className="it_had_border_here bg-white rounded-lg shadow-lg p-5 mb-2 pl-3 flex gap-2 flex-wrap"
        >
          <p className="text-primary-darken font-semibold text-2xl h-11 w-11 justify-center m-0 flex items-center">
            {letter}
          </p>
          {Array.from(
            {
              length:
                maxNumber -
                (lettersAndNumbers[letterIndex - 1]
                  ? lettersAndNumbers[letterIndex - 1].maxNumber
                  : 0),
            },
            (_, i) =>
              i +
              1 +
              (lettersAndNumbers[letterIndex - 1]
                ? lettersAndNumbers[letterIndex - 1].maxNumber
                : 0)
          ).map((number) => (
            <button
              key={number}
              className="number-button"
              id={`number-${number}`}
              data-selected={
                selectNumber === number ||
                numbers.some((n) => n.number === number)
              }
              onClick={() => handleNumberClick(number)}
            >
              {number}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
