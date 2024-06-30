import { Puzzle } from "@/types";
import puzzles from "@/puzzles.json";
import Instructions from "@/components/Instructions";

export default function Home() {
  return (
    <main>
      <h1>OncRx Connect</h1>
      <Instructions />
      <h2>Available Puzzles</h2>
      <ul>
        {puzzles.map((puzzle: Puzzle) => <li key={puzzle.slug}><a href={`puzzle/${puzzle.slug}`}>{puzzle.name}</a></li>)}
      </ul>
    </main>
  );
}
