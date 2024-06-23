import { NumberObject } from "./numbers-grid";

export default function PreviousNumbers({
  numbers,
}: {
  numbers: NumberObject[];
}) {
  return (
    <div className="it_had_border_here bg-white rounded-lg shadow-lg p-2 px-8 pb-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        ⏮️ Números anteriores
      </h2>
      <div className="flex flex-wrap gap-2">
        {numbers.slice(1, 10).map((number) => (
          <div key={number.id} className="previous-number">
            {number.number}
          </div>
        ))}
      </div>
    </div>
  );
}
