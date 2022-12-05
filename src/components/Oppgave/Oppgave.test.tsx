import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Oppgave } from "./Oppgave";

describe("Oppgave", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Oppgave
                value={{ tekst: "Heisann" }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
    it("Har tekst og label", async () => {
        const tekst = "Heisann";
        render(
            <Oppgave
                value={{ tekst: tekst }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        expect(screen.getByText("Oppgave")).toBeInTheDocument();
        expect(screen.getByText("Oppgave")).toHaveClass(
            "navds-tag",
            "tag",
            "navds-tag--neutral"
        );
        expect(screen.getByText(tekst)).toBeInTheDocument();
        expect(screen.getByText(tekst)).toHaveClass("wrapper");
    });
});
