import { screen, render, waitFor } from "@testing-library/react";
import { Kategorier } from "./components/Forebyggingsplan/Kategorier";
import { kategorierMock } from "./mocks/kategorierMock";
import userEvent from "@testing-library/user-event";
import {
    lagreIaMetrikkInformasjonstjeneste,
    lagreIaMetrikkInteraksjonstjeneste,
} from "./lib/ia-metrikker-klient";

jest.mock("./lib/ia-metrikker-klient", () => ({
    ...jest.requireActual("./lib/ia-metrikker-klient"),
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

describe("Metrikkutsendelser fra full page render", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Skal sende metrikker ved åpning av aktivitet", async () => {
        render(<Kategorier kategorier={kategorierMock} />);
        const button = await screen.findByRole("button", {
            name: "Bruk sykefraværstatistikken til å forebygge fravær",
        });

        expect(button).toBeInTheDocument();

        expect(lagreIaMetrikkInformasjonstjeneste).not.toHaveBeenCalled();
        await userEvent.click(button);
        expect(lagreIaMetrikkInformasjonstjeneste).toHaveBeenCalledTimes(1);
    });

    it("Skal sende metrikker ved fullføring av aktivitet", async () => {
        render(<Kategorier kategorier={kategorierMock} />);
        const expandButton = await screen.findByRole("button", {
            name: "Bruk sykefraværstatistikken til å forebygge fravær",
        });
        expect(expandButton).toBeInTheDocument();
        await userEvent.click(expandButton);

        const markerButton = await screen
            .findAllByRole("button", {
                name: "Marker som gjort",
            })
            .then((buttons) => buttons[0]);
        expect(markerButton).toBeInTheDocument();
        expect(lagreIaMetrikkInteraksjonstjeneste).not.toHaveBeenCalled();
        await userEvent.click(markerButton);
        await waitFor(() => {
            expect(lagreIaMetrikkInteraksjonstjeneste).toHaveBeenCalledTimes(1);
        });
    });
});
