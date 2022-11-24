import { screen, render } from "@testing-library/react";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { axe } from "jest-axe";

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

describe("Sykefraværsstatistikk", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(<Sykefraværsstatistikk />);

        expect(
            await screen.findByText("Sykefravær hos deg")
        ).toBeInTheDocument(); // Vent på kall til backend (msw)

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Skal vise sykefravær med riktige verdier", async () => {
        render(<Sykefraværsstatistikk />);
        expect(
            await screen.findByText("Sykefravær hos deg")
        ).toBeInTheDocument(); // Vent på kall til backend (msw)
        expect(screen.getByText("8.8 %")).toBeInTheDocument();
        expect(screen.getByText("Sykefravær i bransje")).toBeInTheDocument();
        expect(screen.getByText("9.2 %")).toBeInTheDocument();
    });
});
