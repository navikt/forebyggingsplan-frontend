import React from "react";

import styles from "./ProgressBar.module.css";
import { AktivitetStatistikkType } from "../Forebyggingsplan/useAktivitetStatistikk";

type ProgressBarProps = {
    aktivitetStatistikk: AktivitetStatistikkType;
    label: string;
    className?: string;
    width?: React.CSSProperties["width"];
};

export function ProgressBar({
    label,
    className = "",
    width = "12rem",
    aktivitetStatistikk: { ferdige, totalt },
}: ProgressBarProps) {
    if (totalt === 0) {
        return null;
    }

    const progress = ferdige / totalt;

    return (
        <div
            className={`${className} ${styles["progress-bar-container"]}`}
            role="progressbar"
            aria-valuenow={ferdige}
            aria-valuemax={totalt}
            aria-label={`Fremgang på ${label}`}
            style={{ width }}
            title={`Fremgang på ${label}: ${Math.round(
                ferdige,
            )} av ${Math.round(totalt)}`}
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
    if (progressBarProps.aktivitetStatistikk.totalt === 0) {
        return null;
    }

    return (
        <div className={styles["progress-bar-wrapper"]}>
            <ProgressBar {...progressBarProps} />
            <div className={styles["progress-bar-label"]}>
                {`${Math.round(
                    progressBarProps.aktivitetStatistikk.ferdige,
                )} av ${Math.round(
                    progressBarProps.aktivitetStatistikk.totalt,
                )} oppgaver gjort.`}
                {`${Math.round(
                    progressBarProps.aktivitetStatistikk.påbegynte,
                )} av ${Math.round(
                    progressBarProps.aktivitetStatistikk.totalt,
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
