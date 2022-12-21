import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { Heading } from "@navikt/ds-react";
import styles from "./VideoVisning.module.css";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { block } from "../PortableText/block/Block";
import { marks } from "../PortableText/marks/Marks";

interface Props {
    tittel: string;
    videoUrl: string;
    innhold: PortableTextBlock[];
}

export const VideoVisning = ({
    value: { tittel, videoUrl, innhold },
}: PortableTextComponentProps<Props>) => {
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
            <div className={styles.video}>
                <iframe
                    className={styles.video__iframe}
                    loading="lazy"
                    title={tittel}
                    src={videoUrl}
                    referrerPolicy={"no-referrer"}
                    allowFullScreen
                />
            </div>
        </div>
    );
};
