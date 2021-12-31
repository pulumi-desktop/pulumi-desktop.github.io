// https://playwright.dev/docs/test-advanced#configuration-object
import { PlaywrightTestConfig } from "@playwright/test";
const config: PlaywrightTestConfig = {
    testDir: "test",
    // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
    webServer: {
        command: "npm start",
        port: 1234,
        timeout: 30 * 1000,
        reuseExistingServer: true,
    },
};
export default config;
