import { screen, render } from "@testing-library/react";
import { Kategorier } from "./Kategorier";
import { axe } from "jest-axe";
import { kategorierMock } from "../../mocks/kategorierMock";
import userEvent from "@testing-library/user-event";
import { lagreIaMetrikkInformasjonstjeneste } from "../../lib/klient/ia-metrikker-klient";

jest.mock("../../lib/klient/ia-metrikker-klient", () => ({
    ...jest.requireActual("../../lib/klient/ia-metrikker-klient"),
    lagreIaMetrikkInformasjonstjeneste: jest.fn(),
    lagreIaMetrikkInteraksjonstjeneste: jest.fn(),
}));

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
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Kategorier kategorier={kategorierMock} />,
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
            await screen.findByText(
                "Bruk sykefraværstatistikken til å forebygge fravær",
            ),
        ).toBeInTheDocument();
        const button = await screen.findByText(
            "Bruk sykefraværstatistikken til å forebygge fravær",
        );
        await userEvent.click(button);

        expect(
            await screen.findByText(
                "Bruk sykefraværstatistikken til å forebygge fravær",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Du vet hvilke plikter du har til å føre sykefraværsstatstikk/,
            ),
        ).toBeVisible();
        expect(
            screen.getByText(
                "Før fravær og ha oversikt over plager som skyldes forhold på arbeidsplassen",
            ),
        ).toBeVisible();
    });

    it("Skal sende metrikker ved åpning av aktivitet", async () => {
        render(<Kategorier kategorier={kategorierMock} />);
        const button = await screen.findByText(
            "Bruk sykefraværstatistikken til å forebygge fravær",
        );

        expect(button).toBeInTheDocument();

        expect(lagreIaMetrikkInformasjonstjeneste).not.toHaveBeenCalled();
        await userEvent.click(button);
        expect(lagreIaMetrikkInformasjonstjeneste).toHaveBeenCalledTimes(1);
    });
});
