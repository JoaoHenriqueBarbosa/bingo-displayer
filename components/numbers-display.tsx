"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function NumbersDisplay() {
  const [numbers, setNumbers] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("numbers").select();
      setNumbers(data || []);
    };
    getData();

    const channel = supabase
      .channel("numbers-display-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "numbers" },
        (payload) => {
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

  return <pre>{JSON.stringify(numbers, null, 2)}</pre>;
}
