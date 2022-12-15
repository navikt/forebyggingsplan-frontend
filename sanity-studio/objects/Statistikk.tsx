import * as React from "react";
import styles from "./statistikkPreview.module.css";
import { defineType } from "sanity";

export const StatistikkPreview = () => {
    return (
        <div className={styles.statistikkContainer}>
            <div className={styles.panel}>
                <p className={styles.bodyShort}>Sykefravær hos deg</p>
                <span className={styles.tag}>89,3 %</span>
            </div>
            <div className={styles.panel}>
                <p className={styles.bodyShort}>Sykefravær i bransjen</p>
                <span className={styles.tag}>17,5 %</span>
            </div>
        </div>
    );
};

const statistikkSchema = defineType({
    type: "object",
    name: "statistikk",
    title: "Statistikk-blokk",
    fields: [
        {
            name: "langtidsfravar",
            type: "boolean",
            hidden: true,
        },
    ],
    components: {
        preview: StatistikkPreview,
    },
});

export default statistikkSchema;
