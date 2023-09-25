import React from "react";

import styles from "./ProgressBar.module.css";

export function ProgressBar({
    max,
    value,
    label,
    className = "",
    width = "12rem",
}: {
    max: number;
    value: number;
    label: string;
    className?: string;
    width?: React.CSSProperties["width"];
}) {
    const progress = value / max;

    return (
        <div
            className={`${className} ${styles["progress-bar-container"]}`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemax={max}
            aria-label={`Fremgang på ${label}`}
            style={{ width }}
            title={`Fremgang på ${label}: ${Math.round(value)} av ${Math.round(
                max,
            )}`}
        >
            <div
                className={`${styles["progress-bar-fill"]} ${getColorClass(
                    progress,
                )}`}
                style={{
                    width: `calc(${progress} * calc(100% - 1.2rem) + 1.2rem)`,
                }}
            />
        </div>
    );
}

function getColorClass(progress: number) {
    if (progress === 1) {
        // dark green
        return styles["progress-bar-fill-level-4"];
    }
    if (progress >= 0.75) {
        // light green
        return styles["progress-bar-fill-level-3"];
    }
    if (progress >= 0.5) {
        // lime green
        return styles["progress-bar-fill-level-2"];
    }
    if (progress > 0.25) {
        // orange
        return styles["progress-bar-fill-level-1"];
    }
    // red
    return styles["progress-bar-fill-level-0"];
}
