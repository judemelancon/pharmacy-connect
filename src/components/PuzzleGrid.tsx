'use client';

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./PuzzleGrid.module.css";
import { Puzzle, IndexedGroup, Item } from "@/types";
import shuffle from "@/util/shuffle";
import FireworksBattery from "./FireworksBattery";

const TotalGroups = 4;
const TotalItems = 16;
const InitialStrikes = 4;

export default function PuzzleGrid({ puzzle }: Readonly<{ puzzle: Puzzle }>) {
    const [initialized, setInitialized] = useState(false);
    const [unsolvedItems, setUnsolvedItems] = useState<Item[]>(extractItems(puzzle));
    const [solvedGroups, setSolvedGroups] = useState<IndexedGroup[]>([]);
    const [showingIncorrectGuess, setShowingIncorrectGuess] = useState(false);
    const [strikes, setStrikes] = useState(InitialStrikes);

    useEffect(() => {
        // Shuffling at initialization time produces hydration errors.
        setUnsolvedItems(previous => shuffle([...previous]));
        setInitialized(true);
    }, []);

    useEffect(() => {
        const activeItems = unsolvedItems.filter(item => item.active);
        if (activeItems.length === 4) {
            const matchingGroupIndex = puzzle.groups.findIndex(group => activeItems.every(item => group.items.includes(item.text)));
            if (matchingGroupIndex >= 0) {
                setUnsolvedItems(previous => previous.filter(item => !item.active));
                setSolvedGroups(previous => [...previous, { ...puzzle.groups[matchingGroupIndex], index: matchingGroupIndex }]);
            }
            else {
                setStrikes(previous => previous - 1);
                setShowingIncorrectGuess(true);
            }
        }
    }, [unsolvedItems, puzzle.groups]);

    useEffect(() => {
        if (!showingIncorrectGuess)
            return;
        const timeoutId = setTimeout(() => {
            setUnsolvedItems(previous => previous.map(item => ({ ...item, active: false })));
            setShowingIncorrectGuess(false);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [showingIncorrectGuess]);

    const handleItemClick = useCallback(
        (target: Item) => {
            setUnsolvedItems(previous => {
                const i = previous.findIndex(item => item.text === target.text);
                return previous.with(i, { ...previous[i], active: !target.active });
            });
        },
        []);

    return (<>
        <div className={classNames(styles.grid, styles.items)}>
            {initialized
                ?
                <>
                    {solvedGroups.map(group => (
                        <div key={group.connection} className={classNames(styles.group, styles[`group-${group.index}`])}>
                            <span className={styles.connection}>{group.connection}</span>
                            <span className={styles.solvedItems}>{group.items.join(', ')}</span>
                        </div>
                    ))}
                    {unsolvedItems.map(item => (
                        <button
                            key={item.text}
                            className={classNames(styles.item, item.active && styles.active, strikes && styles.todo)}
                            disabled={!strikes}
                            onClick={!strikes ? undefined : e => handleItemClick(item)}>
                            <span className={classNames(item.active && showingIncorrectGuess && styles.guessedIncorrectly)}>
                                {item.text}
                            </span>
                        </button>
                    ))}
                </>
                :
                [...Array(TotalItems)].map((_, i) => <button key={`__temporary_${i}`} className={classNames(styles.item, styles.todo)} disabled></button>)
            }
        </div >
        <div className={styles.strikes}>
            <span>{[...Array(InitialStrikes)].map((_, i) => i >= strikes ? '😞' : '😏')}</span>
        </div>
        <FireworksBattery firing={solvedGroups.length === TotalGroups} />
    </>);
}

function extractItems(puzzle: Puzzle): Item[] {
    return (
        puzzle
            .groups
            .flatMap(group =>
                group
                    .items
                    .map(text => ({ text, active: false })))
    );
}
