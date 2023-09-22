import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Oppgave } from "./Oppgave";
import { PortableTextBlock } from "@portabletext/types";
import userEvent from "@testing-library/user-event";
import { oppdaterStatus } from "../../lib/status-klient";

const BEDRIFTSID = "17724538";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {
                bedrift: BEDRIFTSID,
            },
            asPath: "",
        };
    },
}));

jest.mock("../../lib/status-klient", () => ({
    ...jest.requireActual("../../lib/status-klient"),
    oppdaterStatus: jest.fn(),
}));

jest.mock("../../lib/aktivitet-klient", () => ({
    ...jest.requireActual("../../lib/aktivitet-klient"),
    useStatusForAktivitet: jest.fn(() => null),
}));

describe("Oppgave", () => {
    const innhold: PortableTextBlock[] = [
        {
            _key: "344d441ce325",
            _type: "block",
            children: [
                {
                    _key: "59755abb81a6",
                    _type: "span",
                    marks: [],
                    text: "Innholdstekst",
                },
            ],
            markDefs: [],
            style: "normal",
        },
    ];

    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Oppgave
                value={{
                    tittel: "Heisann",
                    innhold,
                    id: "12341234",
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    it("Har tekst og label", async () => {
        const tittel = "Heisann";
        render(
            <Oppgave
                value={{
                    tittel: tittel,
                    innhold,
                    id: "12341234",
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />,
        );
        expect(screen.getByText("Innholdstekst")).toBeInTheDocument();
        expect(screen.getByText(`Oppgave: ${tittel}`)).toBeInTheDocument();
    });

    it("Prøver å sende statuser ved klikk på statusknapper", async () => {
        const ID = "31415926";
        render(
            <Oppgave
                value={{
                    tittel: "Heisann",
                    innhold,
                    id: ID,
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />,
        );

        let button = (await screen.findAllByText("Start"))[1];
        expect(button).toBeInTheDocument();
        expect(oppdaterStatus).not.toHaveBeenCalled();
        await userEvent.click(button);
        expect(oppdaterStatus).toHaveBeenCalledTimes(1);
        expect(oppdaterStatus).toHaveBeenLastCalledWith(
            ID,
            BEDRIFTSID,
            "STARTET",
        );

        button = (await screen.findAllByText("Avbryt"))[1];
        expect(button).toBeInTheDocument();
        await userEvent.click(button);
        expect(oppdaterStatus).toHaveBeenCalledTimes(2);
        expect(oppdaterStatus).toHaveBeenLastCalledWith(
            ID,
            BEDRIFTSID,
            "AVBRUTT",
        );

        button = (await screen.findAllByText("Start"))[1];
        await userEvent.click(button);
        expect(oppdaterStatus).toHaveBeenCalledTimes(3);
        expect(oppdaterStatus).toHaveBeenLastCalledWith(
            ID,
            BEDRIFTSID,
            "STARTET",
        );

        button = (await screen.findAllByText("Fullfør"))[1];
        await userEvent.click(button);
        expect(oppdaterStatus).toHaveBeenCalledTimes(4);
        expect(oppdaterStatus).toHaveBeenLastCalledWith(
            ID,
            BEDRIFTSID,
            "FULLFØRT",
        );

        button = (await screen.findAllByText("Start på nytt"))[1];
        await userEvent.click(button);
        expect(oppdaterStatus).toHaveBeenCalledTimes(5);
        expect(oppdaterStatus).toHaveBeenLastCalledWith(
            ID,
            BEDRIFTSID,
            "AVBRUTT",
        );
    });
});
