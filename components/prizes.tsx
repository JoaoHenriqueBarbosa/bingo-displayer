export default function Prizes({ prizes }: { prizes: string[] }) {
  return (
    <div className="it_had_border_here bg-white rounded-lg shadow-lg p-2 px-10">
      <h2 className="text-3xl font-bold mb-4 text-center">🏆 Prêmios</h2>
      <ul>
        {prizes.map((prize, i) => (
          <li key={prize} className="text-4xl font-bold text-primary-darken">
            {i + 1}º - {prize}
          </li>
        ))}
      </ul>
    </div>
  );
}
