import { screen, render, within } from "@testing-library/react";
import { VideoVisning } from "./VideoVisning";
import { axe } from "jest-axe";

describe("VideoVisning", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <VideoVisning
                value={{
                    tittel: "Heisann",
                    videoId: 123,
                    punktliste: ["Punkt en", "Punkt to"],
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Har tittel, video og punktliste", async () => {
        const tekst = "Heisann";
        render(
            <VideoVisning
                value={{
                    tittel: tekst,
                    videoId: 123,
                    punktliste: ["Punkt en", "Punkt to"],
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
            tekst
        );
        const videoIframe = screen.getByTitle(tekst);
        expect(videoIframe).toHaveClass("video__iframe");
        expect(videoIframe.attributes.getNamedItem("src")).toHaveTextContent(
            "https://player.vimeo.com/video/123"
        );
        const punktliste = screen.getByRole("list");
        expect(punktliste).toBeInTheDocument();
        const { getAllByRole } = within(punktliste);
        const items = getAllByRole("listitem");
        expect(items[0]).toHaveTextContent("Punkt en");
        expect(items[1]).toHaveTextContent("Punkt to");
    });

    it("Har ikke punktliste dersom det bare er ett punkt", async () => {
        const tekst = "Heisann";
        render(
            <VideoVisning
                value={{
                    tittel: tekst,
                    videoId: 123,
                    punktliste: ["Ikke punkttekst"],
                }}
                index={1}
                isInline={false}
                renderNode={() => <></>}
            />
        );
        expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
            tekst
        );
        const videoIframe = screen.getByTitle(tekst);
        expect(videoIframe).toHaveClass("video__iframe");
        expect(videoIframe.attributes.getNamedItem("src")).toHaveTextContent(
            "https://player.vimeo.com/video/123"
        );
        expect(screen.queryByRole("list")).toBeFalsy();
        expect(screen.getByText("Ikke punkttekst")).toBeInTheDocument();
    });
});
