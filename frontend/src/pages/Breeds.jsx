import { parrots } from "../data/parrots";
import BreedCard from "../components/BreedCard";

export default function Breeds() {
  return (
    <div className="bg-[#f8fafc] p-10 grid md:grid-cols-3 gap-8">
      {parrots.map((p) => (
        <BreedCard key={p.id} parrot={p} />
      ))}
    </div>
  );
}