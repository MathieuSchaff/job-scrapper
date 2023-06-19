const { chromium } = require("playwright-extra");
const fs = require("fs");
const getUniqueFilename = require("./../utils/uniqueFileName");
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth");
// const fs = require("fs");

const dotenv = require("dotenv");
chromium.use(stealth);

dotenv.config();
const getRandomInt = require("./../utils/randomInt");
const linkedinJobSearch = process.env.LKD_JOB;
const linkedinLocation = process.env.LKD_LOC;
const linkedinEmail = process.env.LKD_EMAIL;
const linkedinPassWD = process.env.LKD_PASSWD;
const lkdNumPages = process.env.LKD_NUMPAGES;
const linkedinRemote = process.env.LKD_REMOTE;
const datePosted = process.env.LKD_DATE;
const experienceLevel = process.env.LKD_EXP;

chromium.use(stealth);
dotenv.config();
async function linkedinScrapper() {
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
  await page.goto("https://www.linkedin.com/login");
  console.log("Page loaded.");
  // LOGIN BLOCK
  await page.waitForTimeout(getRandomInt(2000, 5000));
  // Focusing on the username field and typing
  await page.locator("#username").type(linkedinEmail, { delay: 100 });
  await page.waitForTimeout(getRandomInt(2000, 5000));

  // Focusing on the password field and typing
  await page.locator("#password").type(linkedinPassWD, { delay: 100 });

  // Clicking on the login button
  await page.locator('[data-litms-control-urn="login-submit"]').click();
  // END OF LOGIN BLOCK

  // Waiting for navigation and then waiting for a random time between 2-5 seconds
  await page.waitForTimeout(getRandomInt(2000, 5000));
  // END OF LOGIN BLOCK
  // Clicking on the job search link
  await page.locator('a[href="https://www.linkedin.com/jobs/?"]').click();
  await page.waitForTimeout(getRandomInt(2000, 5000));
  // SEARCH JOB TYPE BLOCK
  // Entering the job search keyword
  await page
    .getByRole("combobox", { name: "Search by title, skill, or company" })
    .type(linkedinJobSearch, { delay: 100 });

  await page.waitForTimeout(getRandomInt(2000, 5000));
  // Entering the job search location
  await page
    .getByRole("combobox", { name: "City, state, or zip code" })
    .type(linkedinLocation, { delay: 100 });
  await page.keyboard.press("Enter");
  // END OF SEARCH JOB TYPE BLOCK

  // FILTERS BLOCK
  // Will click on the all filters button if one of the filters is set
  if (linkedinRemote || datePosted || experienceLevel) {
    const filterDiv = page.locator("#search-reusables__filters-bar");
    const allFilterButton = filterDiv.getByText("All filters");
    await allFilterButton.click();
    await page.waitForTimeout(getRandomInt(2000, 5000));

    const modal = page.locator("#artdeco-modal-outlet");
    const ul = modal.locator("ul");

    if (datePosted) {
      // select the li element that contains the date posted filter
      const liNumber = datePosted + 1;
      const datePostedLists = ul.locator("li:nth-child(3)");
      const ulList = datePostedLists.locator("ul");
      const li = ulList.locator(`li:nth-child(${liNumber})`);
      const label = li.locator("label");
      await label.click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));
    if (experienceLevel) {
      // select the li element that contains the date posted filter
      const experienceList = ul.locator("li:nth-child(4)");
      const ulList = experienceList.locator("ul");
      // click on the li depending on the date posted filter
      const li = ulList.locator(`li:nth-child(${experienceLevel})`);
      const label = li.locator("label");
      await label.click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));

    if (linkedinRemote) {
      const remoteList = ul.locator("li:nth-child(6)");
      const ulList = remoteList.locator("ul");
      const li = ulList.locator(`li:nth-child(${linkedinRemote})`);
      const label = li.locator("label");
      await label.click();
    }
    await page.waitForTimeout(getRandomInt(2000, 5000));
    await modal.getByText("Show results").click();
  }
  // END OF FILTERS BLOCK

  let numPages = 2;
  let hasPassedNine = false;
  await page.waitForTimeout(getRandomInt(3000, 5000));
  const jobs = [];
  // BEGINNING OF LOOP through pages and getting the jobs
  for (let index = 0; index < lkdNumPages; index++) {
    console.log("enter loop page navigation"); //
    await page.waitForTimeout(getRandomInt(2000, 5000));
    const articles = page.locator(".jobs-search-results-list > ul > li");
    for (let j = 0; j < (await articles.count()); j++) {
      let article = articles.nth(j);

      await article.scrollIntoViewIfNeeded();
      const linkLocator = article.locator("a");
      const link = await linkLocator.getAttribute("href");
      await linkLocator.click();
      // We wait for the page to appear
      // await page.waitForTimeout(getRandomInt(1000, 22000));
      const detailsLocator = page.locator("#job-details");
      const details = await detailsLocator.innerText();
      let jobInnerText = await article.innerText();
      const lines = jobInnerText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line !== "");
      jobs.push(lines);
      let workplace;
      if (
        lines[3] !== "Remote" &&
        lines[3] !== "On-site" &&
        lines[3] !== "Hybrid"
      ) {
        workplace = null;
      } else {
        workplace = lines[3];
      }
      let job = {
        company: lines[1] ?? null,
        title: lines[0] ?? null,
        link: link ?? null,
        location: lines[2] ?? null,
        tags: workplace ? [workplace] : null,
        details: details ?? null,
      };
      jobs.push(job);
    }

    await page.waitForTimeout(getRandomInt(2000, 4000));
    let paginationUl = page.locator(".artdeco-pagination__pages--number");
    await paginationUl.scrollIntoViewIfNeeded();
    // get the text content of the last li elementQ
    if (numPages > 9 || hasPassedNine) {
      numPages = 7;
      hasPassedNine = true;
    }
    await paginationUl.locator(`li:nth-child(${numPages})`).click();
    numPages++;
  }
  console.log(jobs);
  // Resolve the paths
  const projectRoot = path.resolve(__dirname, "..", "..");
  const dataDir = path.join(projectRoot, "data");
  const filename = "linkedinJobs";
  const extension = ".json";
  const uniqueFilename = getUniqueFilename(dataDir, filename, extension);
  // Write to a file called jobs.json
  fs.writeFileSync(`${basePath}/${uniqueFilename}`, jobsJSON);
}
// export the function
module.exports = { linkedinScrapper };
