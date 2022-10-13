import { ReactNode } from "react";
import Banner from "./Banner/Banner";

interface Props {
    children: ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <Banner />
            {children}
        </>
    );
};

export default Layout;
