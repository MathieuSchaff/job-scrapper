const { chromium } = require("playwright-extra");

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();
// const fs = require("fs");

const dotenv = require("dotenv");
chromium.use(stealth);

dotenv.config();
const getRandomInt = require("./../utils/randomInt");
// const convertTimeString = require("./../utils/timeConverter");
// const linkedinJobSearch = process.env.LKD_JOB;
// const linkedinLocation = process.env.LKD_LOC;
const linkedinEmail = process.env.LKD_EMAIL;
const linkedinPassWD = process.env.LKD_PASSWD;
const linkedinRemote = process.env.LKD_REMOTE;
const datePosted = process.env.LKD_DATE;
const experienceLevel = process.env.LKD_EXP;
const website = "https://www.linkedin.com/login";

chromium.use(stealth);
dotenv.config();
(async () => {
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
  await page.goto(website);
  console.log("Page loaded.");
  // LOGIN BLOCK
  // Focusing on the username field and typing
  await page.locator("#username").type(linkedinEmail, { delay: 100 });
  await page.waitForTimeout(getRandomInt(2000, 5000));

  // Focusing on the password field and typing
  await page.locator("#password").type(linkedinPassWD, { delay: 100 });

  // Clicking on the login button
  await page.locator('[data-litms-control-urn="login-submit"]').click();

  // Waiting for navigation and then waiting for a random time between 2-5 seconds
  // await page.waitForTimeout(getRandomInt(2000, 5000));
  // END OF LOGIN BLOCK
  /// Clicking on the job search link
  await page.locator('a[href="https://www.linkedin.com/jobs/?"]').click();
  await page.waitForTimeout(getRandomInt(2000, 5000));

  // Entering the job search keyword
  await page
    .locator(".jobs-search-box__input--keyword input")
    .type(linkedinJobSearch, { delay: 100 });

  // Entering the job search location
  await page
    .locator(".jobs-search-box__input--location input")
    .type(linkedinLocation, { delay: 100 })
    .press("Enter");
  // Will click on the all filters button if one of the filters is set
  if (linkedinRemote || datePosted || experienceLevel) {
    await page.getByText("All filters").click();
    await page.waitForTimeout(getRandomInt(2000, 5000));
    let dateFilterChoices = [
      null, // this is a placeholder, so the numbers map directly to the index
      "Past 24 hours",
      "Past week",
      "Past month",
    ];
    if (datePosted) {
      let userChoiceDate = dateFilterChoices[parseInt(datePosted)];
      console.log(chosenFilter); // for debugging purposes
      await page.getByText(userChoiceDate).click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));
    let experienceLevelChoices = [
      null, // placeholder, so the numbers map directly to the index
      "Internship",
      "Entry level",
      "Associate",
      "Mid-Senior level",
      "Director",
      "Executive",
    ];
    if (experienceLevel) {
      let chosenExperienceLevel =
        experienceLevelChoices[parseInt(experienceLevel)];
      await page.getByText(chosenExperienceLevel).click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));
    let workplaceChoices = [
      null, // placeholder, so the numbers map directly to the index
      "On-site",
      "Remote",
      "Hybrid",
    ];
    if (linkedinRemote) {
      let chosenWorkplace = workplaceChoices[parseInt(linkedinRemote)];

      await page.getByText(chosenWorkplace).click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));
    await page.getByText("Show results").click();
  }
})();
