import styles from "./page.module.css";
import commonStyles from "@/app/commonStyles.module.css";
import puzzles from "@/puzzles.json";
import { Puzzle } from "@/types";
import PuzzleGrid from "@/components/PuzzleGrid";
import Instructions from "@/components/Instructions";
import DynamicQR from "@/components/DynamicQR";

export function generateStaticParams(): { slug: string }[] {
  return puzzles.map(puzzle => ({ slug: puzzle.slug }));
}

//export const dynamicParams = false;

export default function Page({ params: { slug } }: Readonly<{ params: { slug: string } }>) {
  const puzzle = puzzles.find((puzzle: Puzzle) => puzzle.slug === slug);

  return (
    <main className={styles.main}>
      <h1>Pharmacy Connect</h1>

      {puzzle
        ?
        <>
          <h2>{puzzle.name}</h2>
          <PuzzleGrid puzzle={puzzle} />
          <Instructions />
        </>
        :
        <>
          <h2>Missing Puzzle</h2>
          <p className={commonStyles.error}>
            This puzzle is missing.
            <a href="/">The list of available puzzles is here.</a>
          </p>
        </>}

      <DynamicQR />
    </main>
  );
}
