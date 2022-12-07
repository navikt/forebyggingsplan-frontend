import { render, screen } from "@testing-library/react";
import { EksporterTilKalender } from "./EksporterTilKalender";
import { Aktivitet } from "../../types/Aktivitet";
import Mock = jest.Mock;

describe("Eksporter til kalender", () => {
    it("Man kan eksportere en aktivitet til kalenderen", async () => {
        (global.URL.createObjectURL as Mock).mockImplementationOnce(
            () => "blob:123"
        );

        const aktivitet: Aktivitet = {
            innhold: [],
            aktivitetsmalId: "1",
            aktivitetsmalVersjon: "1",
            mål: "Mitt mål",
            beskrivelse: "Heiheihei",
            status: "IKKE_VALGT",
            tittel: "Min kalenderaktivitet",
            frist: new Date().toISOString(),
        };
        const { unmount } = render(
            <EksporterTilKalender aktivitet={aktivitet} />
        );
        expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(0);
        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);

        const linkTag: HTMLAnchorElement = screen.getByText(
            /last ned til kalender/i
        );

        expect(linkTag.download).toBe("kalendar.ics");
        expect(linkTag.href).toBe("blob:123");

        unmount();

        expect(global.URL.createObjectURL).toHaveBeenCalledTimes(1);
        expect(global.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
    });
});
