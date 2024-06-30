import puzzles from "@/puzzles.json";
import Instructions from "@/components/Instructions";

export default function Home() {
  return (
    <main>
      <h1><a href="/">OncRx Connect</a></h1>
      <Instructions />
      <h2>Available Puzzles</h2>
      <ul>
        {puzzles
          .filter(puzzle => !puzzle.secret)
          .map(puzzle => <li key={puzzle.slug}><a href={`puzzle/${puzzle.slug}`}>{puzzle.name}</a></li>)}
      </ul>
    </main>);
}
