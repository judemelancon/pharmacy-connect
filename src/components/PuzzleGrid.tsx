'use client'

import { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import styles from "./PuzzleGrid.module.css";
import { Puzzle, ColorClassNames, Item } from "@/types";
import shuffle from "@/util/shuffle";

const InitialStrikes = 4;

export default function PuzzleGrid({ puzzle }: Readonly<{ puzzle: Puzzle }>) {
    const [items, setItems] = useState<Item[]>(extractItems(puzzle));
    const [solvedConnections, setSolvedConnections] = useState<string[]>([]);
    const [strikes, setStrikes] = useState(InitialStrikes);

    useEffect(() => {
        // Shuffling at initialization time produces hydration errors.
        const shuffled = [...items];
        shuffle(shuffled);
        setItems(shuffled);
    }, []);

    useEffect(() => {
        const activeItems = items.filter(item => item.active);
        if (activeItems.length === 4) {
            const matchingGroup = puzzle.groups.find(group => activeItems.every(item => group.items.includes(item.text)));
            if (matchingGroup) {
                const alreadyDone = items.filter(item => item.done);
                activeItems.sort((a, b) => a.text < b.text ? -1 : a.text > b.text ? 1 : 0);
                for (const item of activeItems) {
                    item.done = true;
                    item.active = false;
                }
                const remainder = items.filter(item => !item.done);
                setItems([...alreadyDone, ...activeItems, ...remainder]);
                setSolvedConnections(previous => [...previous, matchingGroup.connection]);
            }
            else {
                setStrikes(previous => previous - 1);
                for (const item of activeItems)
                    item.active = false;
                setItems([...items]);
            }
        }
    }, [items, puzzle.groups]);

    const handleItemClick = useCallback(
        (target: Item) => {
            setItems(previous => {
                const i = previous.findIndex(item => item.text === target.text);
                return previous.with(i, { ...previous[i], active: !target.active });
            });
        },
        []);

    const itemElements = items?.map(item => (
        <button
            key={item.text}
            className={classNames(styles.item, item.active && styles.active, item.done ? styles[item.color] : strikes && styles.todo)}
            onClick={item.done || !strikes ? undefined : e => handleItemClick(item)}>
            {item.text}
        </button>
    ));

    return (<>
        <div className={classNames(styles.grid, styles.items)}>
            {itemElements}
        </div>
        {/* TODO {solvedConnections?.map(connection => <div key={connection} className={styles.connection}>{connection}</div>)} */}
        <div className={styles.strikes}>
            <span>{[...Array(InitialStrikes)].map((_, i) => i >= strikes ? '😞' : '😏')}</span>
        </div>
    </>);
}

function extractItems(puzzle: Puzzle): Item[] {
    return (
        puzzle
            .groups
            .flatMap((group, i) =>
                group
                    .items
                    .map(itemText => ({
                        text: itemText,
                        color: ColorClassNames[i],
                        done: false,
                        active: false
                    }))));
}
