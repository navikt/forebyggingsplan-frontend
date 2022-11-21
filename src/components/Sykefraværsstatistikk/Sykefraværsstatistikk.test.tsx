import { render } from "@testing-library/react";
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
        //msw
        const { container } = render(<Sykefraværsstatistikk />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
