import styles from "./page.module.css";
import puzzles from "@/puzzles.json";
import { Puzzle } from "@/types";
import PuzzleGrid from "@/components/PuzzleGrid";
import Instructions from "@/components/Instructions";

export function generateStaticParams(): { slug: string }[] {
  return puzzles.map(puzzle => ({ slug: puzzle.slug }));
}

//export const dynamicParams = false;

export default function Page({ params: { slug } }: Readonly<{ params: { slug: string } }>) {
  const puzzle = puzzles.find((puzzle: Puzzle) => puzzle.slug === slug);

  if (!puzzle)
    return (
      <main className={styles.main}>
        <h1>Missing Puzzle</h1>
        <p className={styles.error}>
          This puzzle is missing.
          <a href="/">The list of available puzzles is here.</a>
        </p>
      </main>
    );

  return (
    <main className={styles.main}>
      <h1>Pharmacy Connect {puzzle.name}</h1>
      <Instructions />
      <PuzzleGrid puzzle={puzzle} />
    </main>
  );
}
