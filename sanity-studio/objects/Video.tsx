import { Rule } from "@sanity/types";
import * as React from "react";
import { CSSProperties } from "react";
import { defineType } from "sanity";
import { PortableTextBlock } from "@portabletext/types";
import { PortableText } from "@portabletext/react";

const MAKS_TEKSTLENGDE = 64;

interface Props {
    value: {
        videoUrl: string;
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
    value: { videoUrl, tittel, innhold },
}: Props) => {
    return (
        <div style={videoBoksStyle}>
            <h2>{tittel}</h2>
            <PortableText value={innhold} />
            <div>
                <iframe
                    title={tittel}
                    src={videoUrl}
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
                    if (url.startsWith(baseUrl) && url.includes("mediaId="))
                        return true;

                    return {
                        message: `Urlen må starte med ${baseUrl} og ha en mediaId`,
                    };
                }),
            ],
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
            videoUrl: "videoUrl",
            tittel: "tittel",
            innhold: "innhold",
        },
        prepare: (props: {
            videoUrl: string;
            tittel: string;
            punktliste: string[];
            innhold: PortableTextBlock[];
        }) => {
            return {
                title: "Innhold",
                media: (
                    <VideoPreview
                        value={{
                            videoUrl: props.videoUrl,
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
