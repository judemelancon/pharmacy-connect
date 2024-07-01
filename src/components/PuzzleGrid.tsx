'use client';

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./PuzzleGrid.module.css";
import { Puzzle, Item } from "@/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import shuffle from "@/util/shuffle";
import FireworksBattery from "./FireworksBattery";

const TotalGroups = 4;
const TotalItems = 16;
const InitialStrikes = 4;

export default function PuzzleGrid({ puzzle }: Readonly<{ puzzle: Puzzle }>) {
    const [initialized, setInitialized] = useState(false);
    const [unsolvedItems, setUnsolvedItems] = useState<Item[]>(extractItems(puzzle));
    const [solvedGroups, setSolvedGroups] = useLocalStorage<number[]>(`solved-${puzzle.slug}`, []);
    const [checking, setChecking] = useState(false);
    const [showingIncorrectGuess, setShowingIncorrectGuess] = useState(false);
    const [strikes, setStrikes] = useLocalStorage(`strikes-${puzzle.slug}`, InitialStrikes);

    useEffect(() => {
        // Shuffling at initialization time produces hydration errors.
        setUnsolvedItems(previous => shuffle([...previous]));
        setInitialized(true);
    }, []);

    useEffect(() => {
        setUnsolvedItems(previous => previous.filter(item => !solvedGroups.some(groupIndex => puzzle.groups[groupIndex].items.includes(item.text))));
    }, [puzzle.groups, solvedGroups]);

    useEffect(() => {
        if (!checking)
            return;
        setChecking(false);
        const activeItems = unsolvedItems.filter(item => item.active);
        if (activeItems.length === 4) {
            const matchingGroupIndex = puzzle.groups.findIndex(group => activeItems.every(item => group.items.includes(item.text)));
            if (matchingGroupIndex >= 0) {
                // Removing the items is not strictly necessary,
                //  as the failsafe for removing items from groups previously solved would catch it;
                //  however, it avoids a render.
                setUnsolvedItems(previous => previous.filter(item => !item.active));
                setSolvedGroups(previous => [...previous, matchingGroupIndex]);
            }
            else {
                setStrikes(previous => previous - 1);
                setShowingIncorrectGuess(true);
            }
        }
    }, [puzzle.groups, unsolvedItems, checking, setStrikes, setSolvedGroups]);

    useEffect(() => {
        if (!showingIncorrectGuess)
            return;
        const timeoutId = setTimeout(() => {
            setUnsolvedItems(previous => previous.map(item => ({ ...item, active: false })));
            setShowingIncorrectGuess(false);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [showingIncorrectGuess]);

    const handleItemClick = useCallback(
        (target: Item) => {
            setUnsolvedItems(previous => {
                const i = previous.findIndex(item => item.text === target.text);
                return previous.with(i, { ...previous[i], active: !target.active });
            });
            setChecking(true);
        },
        []);

    return (<>
        <div className={classNames(styles.grid, styles.items)}>
            {initialized
                ?
                <>
                    {solvedGroups.map(groupIndex => (
                        <div key={puzzle.groups[groupIndex].connection} className={classNames(styles.group, styles[`group-${groupIndex}`])}>
                            <span className={styles.connection}>{puzzle.groups[groupIndex].connection}</span>
                            <span className={styles.solvedItems}>{puzzle.groups[groupIndex].items.join(', ')}</span>
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
