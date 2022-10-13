import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:4000",
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on("task", {
                log(message) {
                    console.log(message);

                    return null;
                },
            });
        },
        video: false,
        screenshotOnRunFailure: false,
        experimentalSessionAndOrigin: true,
    },
});
