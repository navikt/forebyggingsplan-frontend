import { Rule } from "@sanity/types";
import * as React from "react";
import { CSSProperties } from "react";
import { defineType } from "sanity";

const MAKS_TEKSTLENGDE = 64;

interface Props {
    value: {
        videoId: string;
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
    borderRadius: "4px",
};

const videoOgTekstStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
};

export const VideoPreview = ({
    value: { videoId, punktliste, tittel },
}: Props) => {
    return (
        <div style={videoBoksStyle}>
            <h2>{tittel}</h2>
            <div style={videoOgTekstStyle}>
                <iframe
                    title={tittel}
                    src={`https://player.vimeo.com/video/${videoId}`}
                    referrerPolicy={"no-referrer"}
                    allowFullScreen
                />
                {punktliste && punktliste.length > 1 && (
                    <ul>
                        {punktliste.map((punkt, index) => (
                            <li key={`punkt-${index}`}>{punkt}</li>
                        ))}
                    </ul>
                )}
                {punktliste && punktliste.length === 1 && (
                    <div>{punktliste.at(0)}</div>
                )}
            </div>
        </div>
    );
};

const videoSchema = defineType({
    type: "object",
    name: "video",
    title: "Videoavspiller",
    fields: [
        {
            title: "ID til video i Vimeo",
            description:
                "Her skal bare IDen til videoen hos Vimeo. For https://vimeo.com/705283170 så blir det 705283170",
            name: "videoId",
            type: "number",
            validation: (rule: Rule) => rule.integer().positive().required(),
        },
        {
            title: "Tittel på videoen",
            name: "tittel",
            type: "string",
            validation: (rule: Rule) => rule.required().max(MAKS_TEKSTLENGDE),
        },
        {
            title: "Punktliste",
            description:
                "Bullet points som beskriver videoen og eventuelle spørsmål knyttet til den. Det kan være lurt å ha noe beskrivelse for at brukeren skal få bedre utbytte av videoen.",
            name: "punktliste",
            type: "array",
            of: [{ type: "string" }],
            validation: (rule: Rule) => rule.max(7),
        },
    ],
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            videoId: "videoId",
            tittel: "tittel",
            punktliste: "punktliste",
        },
        prepare: (props: {
            videoId: string;
            tittel: string;
            punktliste: string[];
        }) => {
            return {
                title: "Innhold",
                media: (
                    <VideoPreview
                        value={{
                            videoId: props.videoId,
                            tittel: props.tittel,
                            punktliste: props.punktliste,
                        }}
                    />
                ),
            };
        },
    },
});

export default videoSchema;
