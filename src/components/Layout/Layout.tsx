import { ReactNode } from "react";
import Banner from "./Banner/Banner";
import { Organisasjon } from "@navikt/bedriftsmeny";

interface Props {
    children: ReactNode;
    organisasjoner: Organisasjon[];
}

const Layout = ({ children, organisasjoner }: Props) => {
    return (
        <main id="maincontent" role="main" tabIndex={-1}>
            <Banner organisasjoner={organisasjoner} />
            {children}
        </main>
    );
};

export default Layout;
