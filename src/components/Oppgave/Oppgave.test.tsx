import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Oppgave } from "./Oppgave";
import { PortableTextBlock } from "@portabletext/types";

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
                    oppgavetype: "Oppgave",
                    tittel: "Heisann",
                    innhold,
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    it("Har tekst og label", async () => {
        const tittel = "Heisann";
        render(
            <Oppgave
                value={{
                    oppgavetype: "Oppgave",
                    tittel: tittel,
                    innhold,
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        expect(screen.getByText("Oppgave")).toBeInTheDocument();
        expect(screen.getByText("Oppgave")).toHaveClass(
            "navds-tag",
            "navds-tag--neutral"
        );
        expect(screen.getByText("Innholdstekst")).toBeInTheDocument();
        expect(screen.getByText(tittel)).toBeInTheDocument();
    });
});
