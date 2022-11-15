import { screen, render } from "@testing-library/react";
import { Bilde } from "./Bilde";
import { axe } from "jest-axe";

describe("Bilde", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Bilde
                value={{
                    tittel: "Bilde",
                    asset: { _ref: "image-TestBildeId-2000x3000-jpg" },
                    beskrivelse: "Bilde Bildesen",
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Har tittel, bilde og alt-tekst", async () => {
        const tekst = "Bilde";
        const beskrivelse = "Bilde Bildesen";
        render(
            <Bilde
                value={{
                    tittel: tekst,
                    asset: { _ref: "image-TestBildeId-2000x3000-jpg" },
                    beskrivelse: beskrivelse,
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const videoIframe = screen.getByTitle(tekst);
        const srcField = videoIframe.attributes.getNamedItem("src");
        expect(srcField).toHaveTextContent("cdn.sanity.io");
        expect(srcField).toHaveTextContent("TestBildeId");
        expect(videoIframe.attributes.getNamedItem("alt")).toHaveTextContent(
            beskrivelse
        );
    });
});
