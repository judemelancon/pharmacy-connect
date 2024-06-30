import styles from "./page.module.css";
import commonStyles from "@/app/commonStyles.module.css";
import puzzles from "@/puzzles.json";
import PuzzleGrid from "@/components/PuzzleGrid";
import Instructions from "@/components/Instructions";

export function generateStaticParams(): { slug: string }[] {
  return puzzles.map(puzzle => ({ slug: puzzle.slug }));
}

//export const dynamicParams = false;

export default function Page({ params: { slug } }: Readonly<{ params: { slug: string } }>) {
  const puzzle = puzzles.find(puzzle => puzzle.slug === slug);

  return (
    <main className={styles.main}>
      <h1><a href="/">OncRx Connect</a></h1>

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
    </main>);
}
