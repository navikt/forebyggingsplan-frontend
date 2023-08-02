import { useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Heading } from "@navikt/ds-react";
import { OrgnrSearchParamType } from "@navikt/bedriftsmeny/lib/types/velger/utils";
import { ForebyggeSykefravaer, Organisasjon } from "@navikt/bedriftsmeny";
import { NotifikasjonWidget } from "@navikt/arbeidsgiver-notifikasjon-widget";
import { isMock } from "../../../lib/miljø";

interface Props {
    organisasjoner: Organisasjon[];
}

const Bedriftsmeny = dynamic(() => import("@navikt/bedriftsmeny"), {
    ssr: false,
});

export const useHentOrgnummer = () => {
    const { push, query } = useRouter();
    const retriever = useCallback<OrgnrSearchParamType>(() => {
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
    return {
        hook: retriever,
        orgnr: retriever()[0],
    };
};

export default function Banner({ organisasjoner }: Props) {
    return (
        <Bedriftsmeny
            orgnrSearchParam={useHentOrgnummer().hook}
            sidetittel={
                <Heading size="xlarge" level="1">
                    Slik forebygger dere sykefravær
                </Heading>
            }
            undertittel="Inkluderende arbeidsliv"
            piktogram={<ForebyggeSykefravaer />}
            organisasjoner={organisasjoner}
        >
            <NotifikasjonWidget
                miljo={isMock() ? "dev" : "prod"}
                apiUrl="/forebyggingsplan/api/authenticated/notifikasjoner"
            />
        </Bedriftsmeny>
    );
}
