import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { Heading } from "@navikt/ds-react";

interface Props {
    tittel: string;
    videoUrl: string;
    punktliste?: string[];
}

export const VideoVisning = ({
    value: { punktliste, tittel, videoUrl },
}: PortableTextComponentProps<Props>) => {
    return (
        <div>
            <Heading size="large">{tittel}</Heading>
            <iframe title={tittel} src={videoUrl} allowFullScreen />
            {!!punktliste &&
                punktliste.map((punkt, index) => (
                    <li key={`punkt-${index}`}>{punkt}</li>
                ))}
        </div>
    );
};
