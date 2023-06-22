import { screen, render } from "@testing-library/react";
import { Kategorier } from "./Kategorier";
import { axe } from "jest-axe";
import { kategorierMock } from "../../mocks/kategorierMock";
import userEvent from "@testing-library/user-event";

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

describe("Kategorier", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Kategorier kategorier={kategorierMock} />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Hver kategori har en tittel og innhold", async () => {
        render(<Kategorier kategorier={kategorierMock} />);
        const artikler = screen.getAllByRole("article");
        expect(artikler.length).toBe(2);
        const tittelElementer = screen.getAllByRole("heading", { level: 3 });
        expect(tittelElementer.length).toBe(3);
        artikler.forEach((artikkel, idx) => {
            expect(artikkel).toHaveTextContent(kategorierMock[idx].tittel);
            expect(screen.getByText(kategorierMock[idx].tittel)).toBeVisible();
        });
    });

    it("Skal kunne åpne en aktivitet", async () => {
        render(<Kategorier kategorier={kategorierMock} />);
        expect(
            await screen.findByRole("button", {
                name: "Bruk sykefraværstatistikken til å forebygge fravær",
                expanded: false,
            })
        ).toBeInTheDocument();
        const button = await screen.findByRole("button", {
            name: "Bruk sykefraværstatistikken til å forebygge fravær",
        });
        await userEvent.click(button);

        const påPlassKnapper = await screen.findAllByRole("button", {
            name: "Marker som gjort",
        });
        expect(påPlassKnapper.length).toBeGreaterThanOrEqual(1);
        påPlassKnapper.forEach((knapp) =>
            expect(knapp).toHaveClass("navds-button", "navds-button--secondary")
        );

        expect(
            await screen.findByRole("button", {
                name: "Bruk sykefraværstatistikken til å forebygge fravær",
                expanded: true,
            })
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Du vet hvilke plikter du har til å føre sykefraværsstatstikk/
            )
        ).toBeVisible();
        expect(
            screen.getByText(
                "Før fravær og ha oversikt over plager som skyldes forhold på arbeidsplassen"
            )
        ).toBeVisible();
    });
});
