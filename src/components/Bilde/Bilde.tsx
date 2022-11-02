import { PortableTextComponentProps } from "@portabletext/react/src/types";
import { urlFor } from "../../lib/sanity-image";
import Image from "next/image";

interface Props {
    beskrivelse: string;
    tittel: string;
    asset: { _ref: string };
}

export const Bilde = (props: PortableTextComponentProps<Props>) => {
    const { tittel, asset, beskrivelse } = props.value;
    const url = urlFor(asset._ref).auto("format").url();
    return (
        <Image
            alt={beskrivelse}
            title={tittel}
            src={url}
            width={700}
            height={475}
            style={{
                width: "100%",
                height: "auto",
            }}
        />
    );
};
