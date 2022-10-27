import { ReactNode } from "react";
import Banner from "./Banner/Banner";
import { Organisasjon } from "@navikt/bedriftsmeny/lib/organisasjon";

interface Props {
    children: ReactNode;
    organisasjoner: Organisasjon[];
}

const Layout = ({ children, organisasjoner }: Props) => {
    return (
        <>
            <Banner organisasjoner={organisasjoner} />
            {children}
        </>
    );
};

export default Layout;
