import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { BodyShort, Heading } from "@navikt/ds-react";
import styles from "./VideoVisning.module.css";

interface Props {
    tittel: string;
    videoUrl: string;
    punktliste?: string[];
}

export const VideoVisning = ({
    value: { punktliste = [], tittel, videoUrl },
}: PortableTextComponentProps<Props>) => {
    return (
        <div className={styles.wrapper}>
            <Heading size="large">{tittel}</Heading>
            <div className={styles.video}>
                <iframe
                    className={styles.video__iframe}
                    title={tittel}
                    src={videoUrl}
                    allowFullScreen
                />
                {punktliste.length > 1 && (
                    <ul>
                        {punktliste.map((punkt, index) => (
                            <li key={`punkt-${index}`}>{punkt}</li>
                        ))}
                    </ul>
                )}
                {punktliste.length === 1 && (
                    <BodyShort>{punktliste.at(0)}</BodyShort>
                )}
            </div>
        </div>
    );
};
