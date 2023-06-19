// NODE JS IMPORTS
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
// UTILS
import getUniqueFilename from "../utils/uniqueFileName.js";
import getContractTypeId from "./utils.js";
import getRandomInt from "../utils/randomInt.js";
import convertTimeString from "../utils/timeConverter.js";
// PLAYWRIGHT SPECIFIC IMPORTS
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth);

/**
 * @param {Object} common
 * @param {Object} welcomeToTheJungle
 *
 * @returns {Promise<void>}
 * @description This function is the main function of the wttjgl scrapper.
 * It takes two objects as parameters, one for the common parameters
 * and one for the wttjgl specific parameters.
 * It will launch a chromium browser, go to the wttjgl website,
 * login if the credentials are provided, search for jobs
 * and scrape the data.
 * It will then save the data in a json file.
 * The data will be saved in the data folder.
 *
 */
const commonDefault = {
  jobSearch: "Développeur frontend",
  location: "France",
  numOfPages: 1,
};
async function wttjglScrapper({
  common = commonDefault,
  welcomeToTheJungle = {},
}) {
  console.log("Common:", common);
  console.log("Welcome to the Jungle:", welcomeToTheJungle);
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",

    geolocation: { longitude: 2.3488, latitude: 48.8534 },
    permissions: ["geolocation"],
  });
  const page = await context.newPage();
  await page.goto("https://www.welcometothejungle.com/en");
  // time out to wait for the page to load
  await page.mainFrame().waitForSelector("header");
  // LOGIN BLOCK
  // if (welcomeToTheJungle.email && welcomeToTheJungle.password) {
  //   const loginButtons = page.locator(
  //     '[data-testid="header-user-button-login"]'
  //   );
  //   if ((await loginButtons.count()) > 0) {
  //     console.log("entered login button is here");
  //     const firstLoginButton = loginButtons.nth(0); // If you want the second, use nth(1)
  //
  //     // Wait for the button to be attached to the DOM
  //     await firstLoginButton.waitFor({ state: "attached" });
  //
  //     // Click on the button
  //     await firstLoginButton.click();
  //
  //     // Wait for the email input field to be rendered
  //     const emailInput = page.locator('[data-testid="login-field-email"]');
  //     await emailInput.waitFor({ state: "visible" });
  //
  //     // Type into the email input field with a delay between key presses
  //     await emailInput.type(welcomeToTheJungle.email, {
  //       delay: getRandomInt(50, 150),
  //     });
  //
  //     // Wait for the password input field to be rendered
  //     const passwordInput = page.locator(
  //       '[data-testid="login-field-password"]'
  //     );
  //     await passwordInput.waitFor({ state: "visible" });
  //
  //     // Type into the password input field with a delay between key presses
  //     await passwordInput.type(welcomeToTheJungle.password, {
  //       delay: getRandomInt(50, 150),
  //     });
  //
  //     // Random delay
  //
  //     // Wait for the submit button to be rendered
  //     const submitButton = page.locator('[data-testid="login-button-submit"]');
  //     await submitButton.waitFor({ state: "visible" });
  //
  //     // Click the submit button
  //     await submitButton.click();
  //   }
  // }
  // END OF LOGIN BLOCK
  //
  // Go to the job page
  const jobLink = page.getByRole("link", {
    name: "Find a job",
    exact: true,
  });
  await jobLink.waitFor({ state: "attached" });
  await jobLink.click();

  const jobSearchButton = page.locator(
    '[data-testid="jobs-home-search-field-query"]'
  );
  await jobSearchButton.waitFor({ state: "visible" });
  await jobSearchButton.focus();
  await jobSearchButton.type(common.jobSearch, {
    delay: getRandomInt(100, 500),
  });
  await jobSearchButton.press("Enter");

  await page.waitForTimeout(getRandomInt(2000, 5000));

  const clearLocationButton = page.locator(
    '[data-testid="jobs-home-search-field-location"] + div button'
  );
  await clearLocationButton.click();

  // await page.waitForTimeout(getRandomInt(2000, 5000));

  const locationSearchButton = page.locator(
    '[data-testid="jobs-home-search-field-location"]'
  );
  await locationSearchButton.focus();
  await locationSearchButton.type(common.location, {
    delay: getRandomInt(100, 500),
  });
  await locationSearchButton.press("Enter");
  // CONTRACT BLOCK
  if (
    welcomeToTheJungle.contractType !== undefined &&
    welcomeToTheJungle.contractType !== null &&
    welcomeToTheJungle.contractType !== "all"
  ) {
    console.log("entered contract block wttjgl");
    await page
      .locator('[data-testid="jobs-search-select-filter-contract"]')
      .click({ delay: getRandomInt(100, 500) });

    const buttonId = getContractTypeId(myContractType);
    if (Array.isArray(buttonId)) {
      for (const id of buttonId) {
        await page.locator(`#${id}`).click({ delay: getRandomInt(100, 500) });
      }
    } else {
      await page
        .locator(`#${buttonId}`)
        .click({ delay: getRandomInt(100, 500) });
    }
    await page
      .locator('[data-testid="jobs-search-select-filter-contract"]')
      .click({ delay: getRandomInt(100, 500) });
  }
  if (
    welcomeToTheJungle.remote !== undefined &&
    welcomeToTheJungle.remote !== null &&
    welcomeToTheJungle.remote !== "all"
  ) {
    await page.waitForSelector("#jobs-search-filter-remote");
    await page
      .locator("#jobs-search-filter-remote")
      .click({ delay: getRandomInt(100, 500) });
    const remoteWorkOptions = {
      no: "#jobs-search-filter-remote-no",
      punctual: "#jobs-search-filter-remote-punctual",
      partial: "#jobs-search-filter-remote-partial",
      fulltime: "#jobs-search-filter-remote-fulltime",
    };

    await page
      .locator(remoteWorkOptions[welcomeToTheJungle.remote])
      .click({ delay: getRandomInt(100, 500) });
    await page
      .locator("#jobs-search-modal-search-button")
      .click({ delay: getRandomInt(100, 500) });
  }
  // END OF BLOCK CONTRACT JOBS

  const jobs = [];
  const numOfPages = common.numOfPages || 1;
  for (let i = 0; i < numOfPages; i++) {
    await page.waitForSelector(".ais-Hits-list-item");

    const articles = page.locator(".ais-Hits-list-item");
    for (let j = 0; j < (await articles.count()); j++) {
      let article = articles.nth(j);
      // name of the company
      const companyNameLocator = article.locator(
        "div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
      );
      const jobCompanyName = await companyNameLocator.textContent();
      // name of the job
      const titleLocator = article.locator("h4");
      const jobTitle = await titleLocator.textContent();
      // location of the job
      const locationLocator = article.locator(
        "div:nth-child(1) > div:nth-child(2) > div:nth-child(2) > div:nth-child(2) > p"
      );
      const jobLocation = await locationLocator.textContent();
      // link to the job
      const anchorLocator = article.locator(
        "div > div:nth-child(2) > div:nth-child(2) > a"
      );
      const href = await anchorLocator.getAttribute("href");
      const jobLink = `https://www.welcometothejungle.com${href}`;
      // time when job was posted
      const timeDiv = article.locator(
        "div > div:nth-child(2) > div:nth-child(2) > div:nth-child(4)"
      );
      const jobTime = await timeDiv.textContent();
      const jobFormatedTime = convertTimeString(jobTime);
      const tagsLocators = article.locator(
        "div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div"
      );
      let tags = [];
      for (let k = 0; k < (await tagsLocators.count()); k++) {
        tags.push(await tagsLocators.nth(k).textContent());
      }
      jobs.push({
        company: jobCompanyName,
        title: jobTitle,
        link: jobLink,
        location: jobLocation,
        time: jobFormatedTime,
        tags,
      });
    }
    await page.waitForTimeout(getRandomInt(1000, 3000));
    const nextButton = page.locator(
      'nav[aria-label="Pagination"] > ul > li:last-child > a'
    );

    if (await nextButton.count()) {
      await nextButton.click({ delay: getRandomInt(100, 500) });
    }
  }
  const maxConcurrentsPages = 5;
  const pagesQueue = jobs.slice(1, 5);
  const openPages = [];
  const jobsWithSections = [];
  // While there are jobs to process
  while (pagesQueue.length) {
    // while there are open pages and there are jobs to process
    // and the number of open pages is less than the max number of concurrent pages
    while (openPages.length < maxConcurrentsPages && pagesQueue.length) {
      const page = await context.newPage();
      // get the first job from the queue
      const job = pagesQueue.shift();
      await page.goto(job.link);
      // add the page to the open pages array and
      // Store the page and the job in the same object, so they're linked
      openPages.push({ page, job });
      await page.waitForTimeout(getRandomInt(1000, 3000));
    }
    // Now that we've hit our concurrency limit or exhausted the queue, we can perform the scraping
    for (const { page, job } of openPages) {
      // Perform the scraping operation here
      await page.waitForSelector("main section");

      const sectionsFromJob = await page.$$eval("main section", (sections) => {
        return sections.map((section) => section.textContent);
      });
      jobsWithSections.push({ ...job, details: sectionsFromJob });

      // Close the page when we're done with it
      await page.close();
    }
    // Clear the openPages array for the next batch
    openPages.length = 0;
  }

  const currentModulePath = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(currentModulePath, "..", "..", "..");
  const dataDir = path.join(projectRoot, "data");

  const filename = "wttjglJobs";
  const extension = ".json";
  const uniqueFilename = getUniqueFilename(dataDir, filename, extension); // assuming getUniqueFilename is defined elsewhere

  // If jobsJSON is an object, convert it to a string.
  const dataToWrite =
    typeof jobsWithSections === "object"
      ? JSON.stringify(jobsWithSections)
      : jobsWithSections;

  // Write to the file
  fs.writeFile(path.join(dataDir, uniqueFilename), dataToWrite);
}
wttjglScrapper({ common: commonDefault, welcomeToTheJungle: {} });
// module.exports = { wttjglScrapper };
