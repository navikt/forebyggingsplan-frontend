import { createAuthStore, defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemas/schema";
import { visionTool } from "@sanity/vision";
import { deskStruktur } from "./deskStruktur";

export default defineConfig({
    title: "forebyggingsplan-pia",
    projectId: "2u7e6oll",
    dataset: process.env.SANITY_STUDIO_DATASET,
    plugins: [
        deskTool({
            structure: deskStruktur,
        }),
        visionTool(),
    ],
    schema: {
        types: schemaTypes,
    },
    tools: (prev) => {
        // 👇 Uses environment variables set by Vite in development mode
        if (process.env.DEV) {
            return prev;
        }
        return prev.filter((tool) => tool.name !== "vision");
    },
    auth: createAuthStore({
        projectId: "2u7e6oll",
        dataset: process.env.SANITY_STUDIO_DATASET,
        mode: "append",
        redirectOnSingle: false,
        providers: [
            {
                name: "saml",
                title: "NAV SSO",
                url: "https://api.sanity.io/v2021-10-01/auth/saml/login/f3270b37",
            },
        ],
        loginMethod: "dual",
    }),
});
