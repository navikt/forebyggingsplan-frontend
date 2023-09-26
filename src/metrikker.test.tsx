import { screen, render } from "@testing-library/react";
import { Kategorier } from "./components/Forebyggingsplan/Kategorier";
import { kategorierMock } from "./mocks/kategorierMock";
import userEvent from "@testing-library/user-event";
import { lagreIaMetrikkInformasjonstjeneste } from "./lib/klient/ia-metrikker-klient";

jest.mock("./lib/klient/ia-metrikker-klient", () => ({
    ...jest.requireActual("./lib/klient/ia-metrikker-klient"),
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
        const button = await screen.findByText(
            "Bruk sykefraværstatistikken til å forebygge fravær",
        );

        expect(button).toBeInTheDocument();

        expect(lagreIaMetrikkInformasjonstjeneste).not.toHaveBeenCalled();
        await userEvent.click(button);
        expect(lagreIaMetrikkInformasjonstjeneste).toHaveBeenCalledTimes(1);
    });
});
