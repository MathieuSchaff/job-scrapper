const { chromium } = require("playwright-extra");
const fs = require("fs");
// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();
// const fs = require("fs");

const dotenv = require("dotenv");
chromium.use(stealth);

dotenv.config();
const getRandomInt = require("./../utils/randomInt");
// const convertTimeString = require("./../utils/timeConverter");
const linkedinJobSearch = process.env.LKD_JOB;
const linkedinLocation = process.env.LKD_LOC;
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
  await page.waitForTimeout(getRandomInt(2000, 5000));
  // END OF LOGIN BLOCK
  //j/ Clicking on the job search link
  await page.locator('a[href="https://www.linkedin.com/jobs/?"]').click();
  // await page.goto("https://www.linkedin.com/jobs/?");

  // await page.goto(
  //   "https://www.linkedin.com/jobs/search?trk=guest_homepage-basic_guest_nav_menu_jobs&position=1&pageNum=0"
  // );
  await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  // Entering the job search keyword
  await page
    .getByRole("combobox", { name: "Search by title, skill, or company" })
    .type(linkedinJobSearch, { delay: 100 });

  // Entering the job search location
  await page
    .getByRole("combobox", { name: "City, state, or zip code" })
    .type(linkedinLocation, { delay: 100 });
  await page.keyboard.press("Enter");
  // Will click on the all filters button if one of the filters is set
  // if (linkedinRemote || datePosted || experienceLevel) {
  //   const filterDiv = page.locator("#search-reusables__filters-bar");
  //   const allFilterButton = filterDiv.getByText("All filters");
  //   await allFilterButton.click();
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //   let dateFilterChoices = [
  //     null, // this is a placeholder, so the numbers map directly to the index
  //     "Past 24 hours",
  //     "Past week",
  //     "Past month",
  //   ];
  //   const modal = page.locator("#artdeco-modal-outlet");
  //   const ul = modal.locator("ul");
  //
  //   if (datePosted) {
  //     // select the li element that contains the date posted filter
  //     const liNumber = datePosted + 1;
  //     const datePostedLists = ul.locator("li:nth-child(3)");
  //     const ulList = datePostedLists.locator("ul");
  //     const li = ulList.locator(`li:nth-child(${liNumber})`);
  //     const label = li.locator("label");
  //     await label.click();
  //   }
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //   let experienceLevelChoices = [
  //     null, // placeholder, so the numbers map directly to the index
  //     "Internship",
  //     "Entry level",
  //     "Associate",
  //     "Mid-Senior level",
  //     "Director",
  //     "Executive",
  //   ];
  //   if (experienceLevel) {
  //     // select the li element that contains the date posted filter
  //     const experienceList = ul.locator("li:nth-child(4)");
  //     const ulList = experienceList.locator("ul");
  //     // click on the li depending on the date posted filter
  //     const li = ulList.locator(`li:nth-child(${experienceLevel})`);
  //     const label = li.locator("label");
  //     await label.click();
  //   }
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //   let workplaceChoices = [
  //     null, // placeholder, so the numbers map directly to the index
  //     "On-site",
  //     "Remote",
  //     "Hybrid",
  //   ];
  //   if (linkedinRemote) {
  //     const remoteList = ul.locator("li:nth-child(6)");
  //     const ulList = remoteList.locator("ul");
  //     const li = ulList.locator(`li:nth-child(${linkedinRemote})`);
  //     const label = li.locator("label");
  //     await label.click();
  //   }
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //   await modal.getByText("Show results").click();
  // }

  const jobs = [];
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
      tags: workplace ?? null,
      details: details ?? null,
    };
    jobs.push(job);
  }
  console.log(jobs);
  const jobsJSON = JSON.stringify(jobs);

  // Write to a file called jobs.json
  fs.writeFileSync("jobs.json", jobsJSON);

  // const paginationUl = page.locator(".artdeco-pagination__pages--number");
  // let paginationLis = await paginationUl.locator("li").count();
  // console.log(paginationLis);
  //   await page.waitForTimeout(getRandomInt(1000, 3000));
  //   const nextButton = page.locator(
  //     'nav[aria-label="Pagination"] > ul > li:last-child > a'
  //   );
  //
  //   if (await nextButton.count()) {
  //     await nextButton.click({ delay: getRandomInt(100, 500) });
  //   }
  // }
  // const maxConcurrentsPages = 5;
  // const pagesQueue = jobs.slice(1, 5);
  // const openPages = [];
  // const jobsWithSections = [];
  // // While there are jobs to process
  // while (pagesQueue.length) {
  //   // while there are open pages and there are jobs to process
  //   // and the number of open pages is less than the max number of concurrent pages
  //   while (openPages.length < maxConcurrentsPages && pagesQueue.length) {
  //     const page = await context.newPage();
  //     // get the first job from the queue
  //     const job = pagesQueue.shift();
  //     await page.goto(job.link);
  //     // add the page to the open pages array and
  //     // Store the page and the job in the same object, so they're linked
  //     openPages.push({ page, job });
  //     await page.waitForTimeout(getRandomInt(1000, 3000));
  //   }
  //   // Now that we've hit our concurrency limit or exhausted the queue, we can perform the scraping
  //   for (const { page, job } of openPages) {
  //     // Perform the scraping operation here
  //     await page.waitForSelector("main section");
  //
  //     const sectionsFromJob = await page.$$eval("main section", (sections) => {
  //       return sections.map((section) => section.textContent);
  //     });
  //     jobsWithSections.push({ ...job, details: sectionsFromJob });
  //
  //     // Close the page when we're done with it
  //     await page.close();
  //   }
  //   // Clear the openPages array for the next batch
  //   openPages.length = 0;
  // }
  // // Stringify the jobs array with indentation for readability
  // const jobsJSON = JSON.stringify(jobsWithSections, null, 2);
  //
  // // Write to a file called jobs.json
  // fs.writeFileSync("jobs.json", jobsJSON);
  // }
})();
