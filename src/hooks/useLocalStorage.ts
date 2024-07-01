import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

const onServer = typeof window === "undefined";

const updateFunctions: { [key: string]: (() => void)[] } = {};

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
    listenToStorageEvents();

    const [state, setState] = useState(defaultValue);

    const updateValue = useCallback(() => {
        const stored = window.localStorage.getItem(key);
        setState(stored ? JSON.parse(stored) : defaultValue);
    }, [key, defaultValue]);

    const setValue = useCallback((value: SetStateAction<T>) => {
        setState(previous => {
            const computed = value instanceof Function ? value(previous) : value;
            if (computed === undefined) {
                window.localStorage.removeItem(key);
            }
            else {
                window.localStorage.setItem(key, JSON.stringify(computed));
            }
            updateFunctions[key]
                .filter(update => update !== updateValue)
                .forEach(update => { setTimeout(update, 0); });
            return computed;
        });
    }, [key, updateValue]);

    useEffect(() => {
        if (updateFunctions[key]) {
            if (!updateFunctions[key].includes(updateValue))
                updateFunctions[key].push(updateValue);
        }
        else {
            updateFunctions[key] = [updateValue];
        }

        return () => {
            updateFunctions[key] = updateFunctions[key].filter(update => update !== updateValue);
        };
    }, [key, updateValue]);

    useEffect(() => {
        updateValue();
    }, [updateValue]);

    return [state, setValue];
}

const listening = false;

function listenToStorageEvents() {
    if (onServer || listening)
        return;
    window.addEventListener(
        'storage',
        e => {
            if (e.storageArea !== window.localStorage)
                return;
            if (!e.key)
                return;
            const updates = updateFunctions[e.key];
            if (!updates)
                return;
            for (const update of updates)
                update();
        });
}
