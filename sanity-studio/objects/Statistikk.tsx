import * as React from "react";
import styles from "./statistikkPreview.module.css";
import { defineType } from "sanity";

interface Props {
    value: {
        bakgrunnsfarge: string;
    };
}

export const StatistikkPreview = ({ value: { bakgrunnsfarge } }: Props) => {
    const bakgrunnsfargeStyling =
        bakgrunnsfarge == "HVIT" ? styles.hvitBakgrunn : styles.gråBakgrunn;

    return (
        <div className={styles.statistikkContainer}>
            <div className={`${styles.panel} ${bakgrunnsfargeStyling}`}>
                <p className={styles.bodyShort}>Sykefravær hos deg</p>
                <span className={styles.tag}>89,3 %</span>
            </div>
            <div className={`${styles.panel} ${bakgrunnsfargeStyling}`}>
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
        {
            name: "bakgrunnsfarge",
            type: "string",
            options: {
                list: ["HVIT", "GRÅ"],
            },
        },
    ],
    initialValue: {
        bakgrunnsfarge: "HVIT",
    },
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            bakgrunnsfarge: "bakgrunnsfarge",
        },
        prepare: (value: { bakgrunnsfarge: string }) => {
            return {
                title: "Statistikk",
                media: (
                    <StatistikkPreview
                        value={{ bakgrunnsfarge: value.bakgrunnsfarge }}
                    />
                ),
            };
        },
    },
});

export default statistikkSchema;
