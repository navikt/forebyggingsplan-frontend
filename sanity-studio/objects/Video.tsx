import { Rule } from "@sanity/types";
import * as React from "react";
import { CSSProperties } from "react";
import { defineType } from "sanity";
import { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";

const MAKS_TEKSTLENGDE = 64;

interface Props {
    value: {
        videoId: string;
        tittel: string;
        innhold: PortableTextBlock[];
    };
}

const videoBoksStyle: CSSProperties = {
    padding: "1rem",
    backgroundColor: "#f7f7f7",
    borderRadius: "4px",
};

export const VideoPreview = ({
    value: { videoId, tittel, innhold },
}: Props) => {
    return (
        <div style={videoBoksStyle}>
            <h2>{tittel}</h2>
            <PortableText value={innhold} />
            <div>
                <iframe
                    title={tittel}
                    src={`https://player.vimeo.com/video/${videoId}`}
                    referrerPolicy={"no-referrer"}
                    allowFullScreen
                />
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
            title: "Innhold",
            name: "innhold",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {
                            title: "Normal tekst",
                            value: "normal",
                        },
                    ],
                    marks: {
                        decorators: [
                            { title: "Strong", value: "strong" },
                            { title: "Emphasis", value: "em" },
                            { title: "Underline", value: "underline" },
                        ],
                        annotations: [
                            {
                                type: "href",
                            },
                        ],
                    },
                },
            ],
        },
    ],
    components: {
        preview: (props) => <>{props.media}</>,
    },
    preview: {
        select: {
            videoId: "videoId",
            tittel: "tittel",
            innhold: "innhold",
        },
        prepare: (props: {
            videoId: string;
            tittel: string;
            punktliste: string[];
            innhold: PortableTextBlock[];
        }) => {
            return {
                title: "Innhold",
                media: (
                    <VideoPreview
                        value={{
                            videoId: props.videoId,
                            tittel: props.tittel,
                            innhold: props.innhold,
                        }}
                    />
                ),
            };
        },
    },
});

export default videoSchema;
