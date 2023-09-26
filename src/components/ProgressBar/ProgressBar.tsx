import React from "react";

import styles from "./ProgressBar.module.css";

type ProgressBarProps = {
    max: number;
    value: number;
    inProgress: number;
    label: string;
    className?: string;
    width?: React.CSSProperties["width"];
};

export function ProgressBar({
    max,
    value,
    label,
    className = "",
    width = "12rem",
}: ProgressBarProps) {
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

export function ProgressBarWithLabel({
    ...progressBarProps
}: ProgressBarProps) {
    return (
        <div className={styles["progress-bar-wrapper"]}>
            <ProgressBar {...progressBarProps} />
            <div className={styles["progress-bar-label"]}>
                {`${Math.round(progressBarProps.value)} av ${Math.round(
                    progressBarProps.max,
                )} oppgaver gjort.`}
                {`${Math.round(progressBarProps.inProgress)} av ${Math.round(
                    progressBarProps.max,
                )} oppgaver påbegynt.`}
            </div>
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
