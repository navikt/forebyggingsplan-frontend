import { render } from "@testing-library/react";
import { Sykefraværsstatistikk } from "./Sykefraværsstatistikk";
import { axe } from "jest-axe";
import { sykefraværsstatistikkMock } from "./sykefraværsstatistikkMock";

describe("Sykefraværsstatistikk", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Sykefraværsstatistikk
                sykefraværsstatistikk={sykefraværsstatistikkMock}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
