import { act, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import Banner from "./Banner";
Element.prototype.scrollTo = () => {};

const pushMock = jest.fn();
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/",
            pathname: "",
            query: {
                bedrift: "123456789",
            },
            asPath: "",
            push: pushMock,
        };
    },
}));
describe("Banner", () => {
    it("Har ingen uu-feil fra axe", async () => {
        const { container } = render(
            <Banner organisasjoner={dummyOrganisasjoner} />,
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it("Har NotifikasjonWidget", async () => {
        render(<Banner organisasjoner={dummyOrganisasjoner} />);
        expect(await screen.findByText("Varsler")).toBeInTheDocument();
    });

    it("Notifikasjoner åpner og lukker", async () => {
        render(<Banner organisasjoner={dummyOrganisasjoner} />);
        const button = await screen.findByRole("button", {
            name: /Dine varsler/i,
        });
        expect(button).toBeInTheDocument();

        act(() => {
            button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        const item = await screen.findByText("dette er en notifikasjon");
        expect(item).toBeInTheDocument();

        act(() => {
            button.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });
        expect(item).not.toBeInTheDocument();
    });
});

const dummyOrganisasjoner = [
    {
        Name: "Forelder",
        Type: "Enterprise",
        ParentOrganizationNumber: "",
        OrganizationNumber: "811076112",
        OrganizationForm: "FLI",
        Status: "Active",
    },
    {
        Name: "BALLSTAD OG HAMARØY",
        Type: "Business",
        ParentOrganizationNumber: "811076112",
        OrganizationNumber: "811076732",
        OrganizationForm: "BEDR",
        Status: "Active",
    },
    {
        Name: "Tvedestrand",
        Type: "Business",
        ParentOrganizationNumber: "811076112",
        OrganizationNumber: "811076733",
        OrganizationForm: "BEDR",
        Status: "Active",
    },
    {
        Name: "Fiktivia",
        Type: "Business",
        ParentOrganizationNumber: "811076112",
        OrganizationNumber: "999999999",
        OrganizationForm: "BEDR",
        Status: "Active",
    },
];
