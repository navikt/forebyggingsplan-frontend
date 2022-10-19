import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { Heading } from "@navikt/ds-react";
import styles from "./VideoVisning.module.css"

interface Props {
    tittel: string;
    videoUrl: string;
    punktliste?: string[];
}

export const VideoVisning = ({
    value: { punktliste, tittel, videoUrl },
}: PortableTextComponentProps<Props>) => {
    return (
        <div className={styles.wrapper}>
            <Heading size="large">{tittel}</Heading>
            <div className={styles.video}>
                <iframe title={tittel} src={videoUrl} allowFullScreen />
                {punktliste && punktliste.length > 1 &&
                    punktliste.map((punkt, index) => (
                        <li key={`punkt-${index}`}>{punkt}</li>
                    ))
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
