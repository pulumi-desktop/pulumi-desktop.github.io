import { test, expect } from "@playwright/test";

const platforms = ["linux_x64", "darwin_x64", "windows_x64"];

test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:1234/");
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
});

test("download buttons are enabled", async ({ page }) => {
    for (let i = 0; i < platforms.length; i++) {
        const p = platforms[i];
        const btn = page.locator(`[data-test=${p}]`);
        await expect(btn).toContainText("Download for");
        await expect(btn).toBeEnabled();
        const link = await btn.getAttribute("href");
        expect(link).toMatch(
            /(https:\/\/github\.com\/pulumi-desktop\/app\/releases\/download\/)(v[0-9]+\.[0-9]+\.[0-9]+\/)(.*)(\.snap|dmg|exe)/g
        );
    }
});
