import { rest } from "msw";

export const organisasjonerHandlers = [
    rest.get(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        async (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        Name: "Forelder",
                        Type: "Enterprise",
                        OrganizationNumber: "811076112",
                        ParentOrganizationNumber: "",
                        OrganizationForm: "FLI",
                        Status: "Active",
                    },
                    {
                        Name: "BALLSTAD OG HAMARØY",
                        Type: "Business",
                        OrganizationNumber: "811076732",
                        ParentOrganizationNumber: "811076112",
                        OrganizationForm: "BEDR",
                        Status: "Active",
                    },
                ])
            );
        }
    ),
];
