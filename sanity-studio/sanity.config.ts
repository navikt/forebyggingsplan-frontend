import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { schemaTypes } from "./schemas/schema";
import { visionTool } from "@sanity/vision";

export default defineConfig({
    title: "forebyggingsplan-pia",
    projectId: "2u7e6oll",
    dataset: "development",
    plugins: [deskTool(), visionTool()],
    schema: {
        types: schemaTypes,
    },
    tools: (prev) => {
        // 👇 Uses environment variables set by Vite in development mode
        if (import.meta.env.DEV) {
            return prev;
        }
        return prev.filter((tool) => tool.name !== "vision");
    },
});
