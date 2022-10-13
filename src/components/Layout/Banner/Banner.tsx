import { useCallback } from "react";

const Bedriftsmeny = dynamic(() => import("@navikt/bedriftsmeny"), {
    ssr: false,
});
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Banner() {
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
            onOrganisasjonChange={console.log}
            orgnrSearchParam={useOrgnrHook}
            sidetittel={"Forebyggingsplan"}
            organisasjoner={[
                {
                    Name: "Forelder",
                    Type: "Enterprise",
                    OrganizationNumber: "811076112",
                    ParentOrganizationNumber: "",
                    OrganizationForm: "FLI",
                    Status: "Active",
                },
                {
                    Name: "BALLSTAD OG HAMARØY",
                    Type: "Business",
                    OrganizationNumber: "811076732",
                    ParentOrganizationNumber: "811076112",
                    OrganizationForm: "BEDR",
                    Status: "Active",
                },
                {
                    Name: "Tvedestrand",
                    Type: "Business",
                    OrganizationNumber: "811076733",
                    ParentOrganizationNumber: "811076112",
                    OrganizationForm: "BEDR",
                    Status: "Active",
                },
            ]}
        />
    );
}
