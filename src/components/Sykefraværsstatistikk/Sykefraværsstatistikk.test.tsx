import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";

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
    const props = {
        value: { bakgrunnsfarge: "HVIT" },
        index: 1,
        isInline: false,
        renderNode: () => <></>,
    };

    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(<Sykefraværsstatistikk {...props} />);

        expect(
            await screen.findByText("Sykefravær hos deg")
        ).toBeInTheDocument(); // Vent på kall til backend (msw)

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Skal vise sykefravær med riktige verdier", async () => {
        render(<Sykefraværsstatistikk {...props} />);
        expect(
            await screen.findByText("Sykefravær hos deg")
        ).toBeInTheDocument(); // Vent på kall til backend (msw)
        expect(screen.getByText("8.8 %")).toBeInTheDocument();
        expect(screen.getByText("Sykefravær i bransje")).toBeInTheDocument();
        expect(screen.getByText("9.2 %")).toBeInTheDocument();
    });
});
