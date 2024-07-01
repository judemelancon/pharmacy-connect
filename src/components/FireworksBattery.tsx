'use client';

import styles from "./FireworksBattery.module.css";
import { useEffect, useMemo, useRef } from "react";
import Fireworks from "@fireworks-js/react";
import type { FireworksHandlers } from '@fireworks-js/react';

const hues = [214, 357, 44];

export default function FireworksBattery({ firing }: Readonly<{ firing: boolean }>) {
    const fireworksRefs = useRef<FireworksHandlers[]>([]);

    const fireworks = useMemo(() =>
        hues.map(hue => ({
            hue,
            options: {
                hue: { min: hue, max: hue },
                delay: { min: 20, max: 25 },
                rocketsPoint: { min: 40, max: 60 },
                explosion: 5
            }
        })), []);

    useEffect(() => {
        for (const instance of fireworksRefs.current) {
            if (firing) {
                if (!instance.isRunning)
                    instance.start();
            }
            else {
                if (instance.isRunning)
                    instance.stop();
            }
        }
    }, [firing]);

    const refs =
        (i: number) =>
            (entry: FireworksHandlers) => {
                if (entry) {
                    fireworksRefs.current[i] = entry;

                } else {
                    fireworksRefs.current.splice(i, 1);
                }
            };

    return fireworks.map((firework, i) => <Fireworks key={firework.hue} ref={refs(i)} className={styles.fireworks} options={firework.options} />);
}
