import * as React from "react";
import { PortableText } from "@portabletext/react";
import { Lovpålagt } from "./Lovpålagt";
import { VideoPreview } from "./Video";

export const seksjon = {
    type: "object",
    name: "seksjon",
    title: "Seksjon for innhold",
    fields: [
        {
            title: "Innhold",
            name: "seksjonInnhold",
            type: "array",
            of: [
                {
                    type: "block",
                    styles: [
                        {
                            title: "Normal tekst",
                            value: "normal",
                        },
                        {
                            title: "Overskrift",
                            value: "h1",
                        },
                        {
                            title: "Undertittel",
                            value: "h2",
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
                {
                    type: "lovpalagt",
                },
                {
                    type: "video",
                },
            ],
        },
    ],
    preview: {
        select: {
            seksjonInnhold: "seksjonInnhold",
        },
        component: (props: any) => {
            return <div>{props.value.media}</div>;
        },
        prepare: (value: any) => {
            return {
                title: "Innhold",
                media: (
                    <div
                        style={{
                            backgroundColor: "lightgray",
                            borderRadius: "4px",
                        }}
                    >
                        <PortableText
                            value={value.seksjonInnhold}
                            components={{
                                types: {
                                    lovpalagt: Lovpålagt,
                                    video: VideoPreview,
                                },
                            }}
                        />
                    </div>
                ),
            };
        },
    },
};
