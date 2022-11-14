import { screen, render, fireEvent } from "@testing-library/react";
import { Aktivitetskategorier } from "./Aktivitetskategorier";
import { axe } from "jest-axe";
import { aktivitetskategorierMock } from "./aktivitetskategorierMock";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {
                bedrift: "123456789",
            },
            asPath: "",
        };
    },
}));

describe("Aktivitetskategorier", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Aktivitetskategorier kategorier={aktivitetskategorierMock} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Hver kategori har en tittel og en beskrivelse", async () => {
        render(<Aktivitetskategorier kategorier={aktivitetskategorierMock} />);
        const artikler = screen.getAllByRole("article");
        expect(artikler.length).toBe(3);
        const tittelElementer = screen.getAllByRole("heading", { level: 2 });
        expect(tittelElementer.length).toBe(3);
        artikler.forEach((artikkel, idx) => {
            expect(artikkel).toHaveTextContent(
                aktivitetskategorierMock[idx].tittel
            );
            expect(artikkel).toHaveTextContent(
                aktivitetskategorierMock[idx].beskrivelse
            );
        });
    });

    it("Skal kunne åpne en aktivitet", async () => {
        render(<Aktivitetskategorier kategorier={aktivitetskategorierMock} />);
        fireEvent.click(screen.getAllByRole("button")[0]);
        expect(
            await screen.findByText("Dette har vi på plass")
        ).toBeInTheDocument();
    });
});
