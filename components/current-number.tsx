import { NumberObject, lettersAndNumbers } from "./numbers-grid";

function getNumberLetter(number: number): string | null {
  for (const { letter, maxNumber } of lettersAndNumbers) {
    if (number <= maxNumber) {
      return letter;
    }
  }
  return null;
}

export default function CurrentNumber({
  numbers,
}: {
  numbers: NumberObject[];
}) {
  if (numbers.length === 0) {
    return null;
  }

  return (
    <div className="it_had_border_here bg-white rounded-lg shadow-lg p-2 px-8 pb-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Número da vez</h2>
      <div className="flex flex-wrap gap-2">
        <div className="current-number">
          <div className="letter">{getNumberLetter(numbers[0].number)}</div>
          <div className="number">{numbers[0].number}</div>
        </div>
      </div>
    </div>
  );
}
