import { render, screen } from "@testing-library/react";
import { VideoVisning } from "./VideoVisning";
import { axe } from "jest-axe";
import { PortableTextBlock } from "@portabletext/types";

describe("VideoVisning", () => {
    const innhold: PortableTextBlock[] = [
        {
            _key: "344d441ce325",
            _type: "block",
            children: [
                {
                    _key: "59755abb81a6",
                    _type: "span",
                    marks: [],
                    text: "Innholdstekst",
                },
            ],
            markDefs: [],
            style: "normal",
        },
    ];

    const videoProps = {
        value: {
            tittel: "Heisann",
            videoUrl: "https://qbrick.com/video",
            innhold: innhold,
        },
        index: 1,
        isInline: false,
        renderNode: () => <></>,
    };

    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(<VideoVisning {...videoProps} />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Har tittel, video og innhold", async () => {
        const tekst = "Heisann";
        render(<VideoVisning {...videoProps} />);
        expect(screen.getByRole("heading", { level: 4 })).toHaveTextContent(
            tekst
        );

        const videoPlayerDiv: HTMLElement = screen.getByTestId(
            "QbrickVideoPlayerDiv"
        );
        expect(videoPlayerDiv).toBeVisible();

        const innhold = screen.getByText("Innholdstekst");
        expect(innhold).toBeVisible();
    });
});
