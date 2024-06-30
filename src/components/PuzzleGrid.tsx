'use client'

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./PuzzleGrid.module.css";
import { Puzzle, IndexedGroup, Item } from "@/types";
import shuffle from "@/util/shuffle";

const InitialStrikes = 4;

export default function PuzzleGrid({ puzzle }: Readonly<{ puzzle: Puzzle }>) {
    const [unsolvedItems, setUnsolvedItems] = useState<Item[]>(extractItems(puzzle));
    const [solvedGroups, setSolvedGroups] = useState<IndexedGroup[]>([]);
    const [strikes, setStrikes] = useState(InitialStrikes);

    useEffect(() => {
        // Shuffling at initialization time produces hydration errors.
        setUnsolvedItems(previous => shuffle([...previous]));
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
                for (const item of activeItems)
                    item.active = false;
                setUnsolvedItems(previous => [...previous]);
                setStrikes(previous => previous - 1);
            }
        }
    }, [unsolvedItems, puzzle.groups]);

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
                    {item.text}
                </button>
            ))}
        </div>
        <div className={styles.strikes}>
            <span>{[...Array(InitialStrikes)].map((_, i) => i >= strikes ? '😞' : '😏')}</span>
        </div>
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
