import { rest } from "msw";

export const organisasjonerHandlers = [
    rest.get(
        `${process.env.FOREBYGGINGSPLAN_API_BASEURL}/organisasjoner`,
        async (req, res, ctx) => {
            return res(
                ctx.json([
                    {
                        Name: "FLESK OG FISK AS",
                        Type: "Enterprise",
                        OrganizationNumber: "111111111",
                        ParentOrganizationNumber: "",
                        OrganizationForm: "FLI",
                        Status: "Active",
                    },
                    {
                        Name: "FLESK OG FISK OSLO",
                        Type: "Business",
                        OrganizationNumber: "910969439",
                        ParentOrganizationNumber: "111111111",
                        OrganizationForm: "BEDR",
                        Status: "Active",
                    },
                ])
            );
        }
    ),
];
