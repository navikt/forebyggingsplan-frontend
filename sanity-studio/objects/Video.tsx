import { Rule } from "@sanity/types";
import * as React from "react";
import {CSSProperties} from "react";

const MAKS_TEKSTLENGDE = 64;

interface Props {
    value: {
        url: string;
        tittel: string;
        punktliste?: string[];
    };
}

const videoBoksStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    backgroundColor: "#f7f7f7",
    borderRadius: "4px"
}

const videoOgTekstStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
}

export const VideoPreview = ({ value: { url, punktliste, tittel } }: Props) => {
    return (
        <div style={videoBoksStyle}>
            <h2>{tittel}</h2>
            <div style={videoOgTekstStyle}>
            <iframe title={tittel} src={url} allowFullScreen />
            {punktliste && punktliste.length > 1 &&
                <ul>
                    {punktliste.map((punkt, index) => (
                        <li key={`punkt-${index}`}>{punkt}</li>
                    ))}
                </ul>
            }
            {punktliste && punktliste.length === 1 &&
                <div>
                    {punktliste.at(0)}
                </div>
            }
            </div>
        </div>
    );
};

export default {
    type: "object",
    name: "video",
    title: "Videoavspiller",
    fields: [
        {
            type: "url",
            name: "videoUrl",
            title: "Videolenke til Qbrick",
            validation: (rule: Rule) => [
                rule
                    .uri({
                        scheme: "https",
                        allowCredentials: false,
                        allowRelative: false,
                    })
                    .required(),
                rule.custom<string>((url) => {
                    const baseUrl =
                        "https://video.qbrick.com/play2/embed/player";
                    if (url.startsWith(baseUrl) && url.includes("mediaId=")) return true;

                    return {
                        message: `Urlen må starte med ${baseUrl} og ha en mediaId`,
                    };
                }),
            ],
        },
        {
            type: "string",
            name: "tittel",
            title: "Tittel på videoen",
            validation: (rule: Rule) => rule.required().max(MAKS_TEKSTLENGDE),
        },
        {
            type: "array",
            name: "punktliste",
            title: "Punktliste",
            description:
                "Bullet points som beskriver videoen og eventuelle spørsmål knyttet til den. Det kan være lurt å ha noe beskrivelse for at brukeren skal få bedre utbytte av videoen.",
            of: [{ type: "string" }],
            validation: (rule: Rule) => rule.max(7),
        },
    ],
    preview: {
        select: {
            url: "videoUrl",
            tittel: "tittel",
            punktliste: "punktliste",
        },
        component: VideoPreview,
    },
};
