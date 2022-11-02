import { useCallback } from "react";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

const Bedriftsmeny = dynamic(() => import("@navikt/bedriftsmeny"), {
    ssr: false,
});
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";

interface Props {
    organisasjoner: Organisasjon[];
}

export default function Banner({ organisasjoner }: Props) {
    const { push, query } = useRouter();

    const useOrgnrHook: () => [string | null, (orgnr: string) => void] =
        useCallback(() => {
            const currentOrgnr =
                typeof query.bedrift === "string" ? query.bedrift : null;

            return [
                currentOrgnr,
                (orgnr: string) => {
                    if (currentOrgnr !== orgnr) {
                        if (orgnr === null) {
                            push("");
                        } else {
                            push(`?bedrift=${orgnr}`);
                        }
                    }
                },
            ];
        }, [push, query.bedrift]);

    return (
        <Bedriftsmeny
            orgnrSearchParam={useOrgnrHook}
            sidetittel={<Heading size="xlarge" level="1">Forebyggingsplan</Heading>}
            organisasjoner={organisasjoner}
        />
    );
}
