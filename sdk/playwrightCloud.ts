import { chromium, Browser, Page } from "playwright";
import { expect } from "@playwright/test";
// import * as smartuiSnapshot from "@lambdatest/playwright-driver";
const smartuiSnapshot = require("@lambdatest/playwright-driver");

// Username: Found in the automation dashboard
const USERNAME: string = process.env.LT_USERNAME || "<USERNAME>";

// AccessKey: Found in the automation dashboard or profile section
const KEY: string = process.env.LT_ACCESS_KEY || "<ACCESS_KEY>";

(async () => {
  const capabilities = {
    browserName: "Chrome",
    browserVersion: "latest",
    "LT:Options": {
      platform: "Windows 10",
      build: "Playwright SmartUI Build Belal",
      name: "Playwright SmartUI Test new",
      user: USERNAME,
      accessKey: KEY,
      network: true,
      video: true,
      console: true,
    },
  };

  const githubURL: string | undefined = process.env.GITHUB_URL;
  if (githubURL) {
    (capabilities["LT:Options"] as any).github = {
      url: githubURL,
    };
  }

  const browser: Browser = await chromium.connect({
    wsEndpoint: `wss://cdp.lambdatest.com/playwright?capabilities=${encodeURIComponent(
      JSON.stringify(capabilities)
    )}`,
  });

  const page: Page = await browser.newPage();

  // Navigate to the Kayak About page
  await page.goto("https://www.kayak.co.in/about");

  // Wait for the page to load
  await new Promise((r) => setTimeout(r, 6000));

  // Scroll to the bottom of the page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });

  // Take a SmartUI screenshot with the Options configuration
  let Options = {
    loadDomContent: true,
  };

  await smartuiSnapshot.smartuiSnapshot(page, "Issue About Page");

  await smartuiSnapshot.smartuiSnapshot(page, "About Page", Options);

  await browser.close();
})();
