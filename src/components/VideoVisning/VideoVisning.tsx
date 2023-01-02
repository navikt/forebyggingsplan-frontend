import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { Heading } from "@navikt/ds-react";
import styles from "./VideoVisning.module.css";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";
import { QbrickVideoPlayer } from "../EmbeddedVideoPlayer/QbrickVideoPlayer";

interface Props {
    tittel: string;
    videoUrl: string;
    innhold: PortableTextBlock[];
}

export const VideoVisning = ({
    value: { tittel, videoUrl, innhold },
}: PortableTextComponentProps<Props>) => {
    const DEFAULT_MEDIA_ID = "702ed6e6-00015227-76bc0ebe";
    let mediaId = DEFAULT_MEDIA_ID;

    if (videoUrl) {
        const url = new URL(videoUrl);
        if (url !== null) {
            mediaId = url.searchParams.get("mediaId")
                ? url.searchParams.get("mediaId")!
                : DEFAULT_MEDIA_ID;
        }
    }

    return (
        <div className={styles.wrapper}>
            <Heading size="medium" level="4">
                {tittel}
            </Heading>
            <PortableText
                value={innhold}
                components={{
                    block,
                    marks,
                }}
            />
            <div data-testid={"QbrickVideoPlayerDiv"}>
                {" "}
                {/*OBS: uten div fungerer ikke play/pause lenger*/}
                <QbrickVideoPlayer
                    video={{
                        metadata: {
                            title: "Test video",
                            description: "Her tester vi QBrick videoer",
                        },
                        id: mediaId,
                        tags: [],
                    }}
                />
            </div>
        </div>
    );
};
