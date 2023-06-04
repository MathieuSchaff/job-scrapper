const { chromium } = require("playwright");

const dotenv = require("dotenv");
const getRandomInt = require("./../utils/randomInt");
const convertTimeString = require("./../utils/timeConverter");
dotenv.config();
// // const email = process.env.WTTJGL_EMAIL;
// // const mdpWttjgl = process.env.WTTJGL_PASSWD;
// const website = process.env.WTTJGL_WEBSITE;
const jobSearch = process.env.WTTJGL_SEARCH;
const numOfPages = process.env.WTTJGL_NUMPAGES;
const locationSearch = process.env.WTTJGL_LOCATION;
// const email = process.env.WTTJGL_EMAIL;
// const mdpWttjgl = process.env.WTTJGL_PASSWD;
const website =
  "https://www.welcometothejungle.com/en/jobs?refinementList%5Boffices.country_code%5D%5B%5D=FR&query=frontend%20developer&page=1";

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
  // time out to wait for the page to load
  await page.mainFrame().waitForSelector("header");

  // // LOGIN BLOCK
  // const loginButtons = page.locator('[data-testid="header-user-button-login"]');
  //
  // if ((await loginButtons.count()) > 0) {
  //   console.log("entered login button is here");
  //   const firstLoginButton = loginButtons.nth(0); // If you want the second, use nth(1)
  //
  //   // Wait for the button to be attached to the DOM
  //   await firstLoginButton.waitFor({ state: "attached" });
  //
  //   // Click on the button
  //   await firstLoginButton.click();
  //
  //   // Wait for the email input field to be rendered
  //   const emailInput = await page.locator('[data-testid="login-field-email"]');
  //   await emailInput.waitFor({ state: "visible" });
  //
  //   // Type into the email input field with a delay between key presses
  //   await emailInput.type(email, { delay: getRandomInt(50, 150) });
  //
  //   // Wait for the password input field to be rendered
  //   const passwordInput = await page.locator(
  //     '[data-testid="login-field-password"]'
  //   );
  //   await passwordInput.waitFor({ state: "visible" });
  //
  //   // Type into the password input field with a delay between key presses
  //   await passwordInput.type(mdpWttjgl, { delay: getRandomInt(50, 150) });
  //
  //   // Random delay
  //
  //   // Wait for the submit button to be rendered
  //   const submitButton = await page.locator(
  //     '[data-testid="login-button-submit"]'
  //   );
  //   await submitButton.waitFor({ state: "visible" });
  //
  //   // Click the submit button
  //   await submitButton.click();
  // }
  // // BLOCK CONTRACT TYPE
  // //
  // // await page.waitForTimeout(getRandomInt(2000, 5000));
  // // // BLOCK FOR TYPE OF JOBS
  // // await page.waitForSelector(
  // //   '[data-testid="jobs-search-select-filter-contract"]',
  // // );
  // // const jobTypeToButtonId = {
  // //   "CDI": "id-8je6cg",
  // //   "Alternance": "id-ounvt2",
  // //   "Stage": "id-biv9tk",
  // //   "CDD / Temporaire": "id-9e195s",
  // //   "Autres": "id-biujqv",
  // //   "Freelance": "id-hjkpgj",
  // //   "Temps partiel": "id-dtf3uv",
  // //   "VIE": "id-3l98u4",
  // //   "Graduate program": "id-tk4gp3",
  // //   "Bénévolat / Service civique": "id-asbjb0",
  // //   "VDI": "id-71ta1k",
  // // };
  // // await page.click('[data-testid="jobs-search-select-filter-contract"]');
  // // await page.waitForTimeout(getRandomInt(1000, 3000));
  // //
  // // const buttonId = jobTypeToButtonId[jobType];
  // //
  // // await page.waitForSelector(`#${buttonId}`);
  // // await page.click(`#${buttonId}`);
  // // END OF BLOCK CONTRACT JOBS
  // // header + div div
  // const jobLink = page.getByRole("link", {
  //   name: "Find a job",
  //   exact: true,
  // });
  // // const jobLink = page.locator('[data-testid="menu-jobs"] a');
  // await jobLink.waitFor({ state: "attached" });
  // await jobLink.click();
  //
  // const jobSearchButton = page.locator(
  //   '[data-testid="jobs-home-search-field-query"]'
  // );
  // await jobSearchButton.waitFor({ state: "visible" });
  // await jobSearchButton.focus();
  // await jobSearchButton.type(jobSearch, { delay: getRandomInt(100, 500) });
  // await jobSearchButton.press("Enter");
  //
  // // await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  // const clearLocationButton = page.locator(
  //   '[data-testid="jobs-home-search-field-location"] + div button'
  // );
  // await clearLocationButton.click();
  //
  // // await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  // const locationSearchButton = page.locator(
  //   '[data-testid="jobs-home-search-field-location"]'
  // );
  // await locationSearchButton.focus();
  // await locationSearchButton.type(locationSearch, {
  //   delay: getRandomInt(100, 500),
  // });
  // await locationSearchButton.press("Enter");

  const jobs = [];

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
        time: jobFormatedTime,
        location: jobLocation,
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
  const pagesQueue = jobs.slice();
  const openPages = [];
  const sections = [];
  // While there are jobs to process
  while (pagesQueue.length) {
    // while there are open pages and there are jobs to process
    // and the number of open pages is less than the max number of concurrent pages
    while (openPages.length < maxConcurrentsPages && pagesQueue.length) {
      const page = await context.newPage();
      // get the first job from the queue
      const job = pagesQueue.shift();
      await page.goto(job.link);
      // add the page to the open pages array
      openPages.push(page);
      await page.waitForTimeout(getRandomInt(1000, 3000));
    }
    // Now that we've hit our concurrency limit or exhausted the queue, we can perform the scraping
    for (const page of openPages) {
      // Perform the scraping operation here
      await page.waitForSelector("main section");

      const sectionsFromJob = await page.$$eval("main section", (sections) => {
        return sections.map((section) => section.textContent);
      });
      sections.push(sectionsFromJob);
      console.log(sections);

      // Close the page when we're done with it
      await page.close();
    }
    // Clear the openPages array for the next batch
    openPages.length = 0;
  }

  // console.log(jobs);
  console.log(sections);
  // Open a new page for each job
  // const newPage = await context.newPage();
  // await newPage.goto(link);
  // const pageTitle = await page.title();
  // console.log(`The title of the page is: ${pageTitle}`);
  // await page.waitForSelector("main section");
  //
  // const sections = await page.$$eval("main section", (sections) => {
  //   return sections.map((section) => section.textContent);
  // });
  //
  // console.log(sections);
  // await newPage.close();
})();
