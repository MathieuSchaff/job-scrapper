// const { chromium } = require("playwright");
// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
const { chromium } = require("playwright-extra");

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();
const fs = require("fs");

const dotenv = require("dotenv");
const getRandomInt = require("./../utils/randomInt");
const convertTimeString = require("./../utils/timeConverter");

// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth);
dotenv.config();

const email = process.env.WTTJGL_EMAIL;
const mdpWttjgl = process.env.WTTJGL_PASSWD;
const website = "https://www.welcometothejungle.com/en";
const jobSearch = process.env.WTTJGL_SEARCH;
const numOfPages = process.env.WTTJGL_NUMPAGES;
const locationSearch = process.env.WTTJGL_LOCATION;
const myContractType = process.env.WTTJGL_CONTRACT_TYPE;
const remoteOrNot = process.env.WTTJGL_REMOTE_WORK_OPTION;

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
  // LOGIN BLOCK
  if (email && mdpWttjgl) {
    const loginButtons = page.locator(
      '[data-testid="header-user-button-login"]'
    );
    if ((await loginButtons.count()) > 0) {
      console.log("entered login button is here");
      const firstLoginButton = loginButtons.nth(0); // If you want the second, use nth(1)

      // Wait for the button to be attached to the DOM
      await firstLoginButton.waitFor({ state: "attached" });

      // Click on the button
      await firstLoginButton.click();

      // Wait for the email input field to be rendered
      const emailInput = page.locator('[data-testid="login-field-email"]');
      await emailInput.waitFor({ state: "visible" });

      // Type into the email input field with a delay between key presses
      await emailInput.type(email, { delay: getRandomInt(50, 150) });

      // Wait for the password input field to be rendered
      const passwordInput = page.locator(
        '[data-testid="login-field-password"]'
      );
      await passwordInput.waitFor({ state: "visible" });

      // Type into the password input field with a delay between key presses
      await passwordInput.type(mdpWttjgl, { delay: getRandomInt(50, 150) });

      // Random delay

      // Wait for the submit button to be rendered
      const submitButton = page.locator('[data-testid="login-button-submit"]');
      await submitButton.waitFor({ state: "visible" });

      // Click the submit button
      await submitButton.click();
    }
  }
  // END OF LOGIN BLOCK
  //
  // Go to the job page
  const jobLink = page.getByRole("link", {
    name: "Find a job",
    exact: true,
  });
  // const jobLink = page.locator('[data-testid="menu-jobs"] a');
  await jobLink.waitFor({ state: "attached" });
  await jobLink.click();

  const jobSearchButton = page.locator(
    '[data-testid="jobs-home-search-field-query"]'
  );
  await jobSearchButton.waitFor({ state: "visible" });
  await jobSearchButton.focus();
  await jobSearchButton.type(jobSearch, { delay: getRandomInt(100, 500) });
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
  await locationSearchButton.type(locationSearch, {
    delay: getRandomInt(100, 500),
  });
  await locationSearchButton.press("Enter");
  // CONTRACT BLOCK
  if (
    myContractType !== undefined &&
    myContractType !== null &&
    myContractType !== "all"
  ) {
    console.log("entered contract block");
    await page
      .locator('[data-testid="jobs-search-select-filter-contract"]')
      .click({ delay: getRandomInt(100, 500) });
    const contractTypes = [
      {
        name: "Permanent contract",
        id: "jobs-search-filter-contract-FULL_TIME",
      },
      { name: "Work-study", id: "jobs-search-filter-contract-APPRENTICESHIP" },
      { name: "Internship", id: "jobs-search-filter-contract-INTERNSHIP" },
      {
        name: "Fixed-term / Temporary",
        id: "jobs-search-filter-contract-TEMPORARY",
      },
      { name: "Other", id: "jobs-search-filter-contract-OTHER" },
      { name: "Freelance", id: "jobs-search-filter-contract-FREELANCE" },
      { name: "Part-time", id: "jobs-search-filter-contract-PART_TIME" },
      {
        name: "International Corporate Volunteer Program",
        id: "jobs-search-filter-contract-VIE",
      },
      {
        name: "Graduate program",
        id: "jobs-search-filter-contract-GRADUATE_PROGRAM",
      },
      { name: "Volunteer work", id: "jobs-search-filter-contract-VOLUNTEER" },
      { name: "IDV", id: "jobs-search-filter-contract-IDV" },
    ];

    function getContractTypeId(contractType) {
      if (!contractType) return null;

      if (Number.isInteger(parseInt(contractType))) {
        // If contractType is a number, get the corresponding id by index
        const index = parseInt(contractType) - 1; // adjusting for zero-based indexing
        return contractTypes[index]?.id || null;
      } else {
        // If contractType is a string, find the corresponding id
        const contract = contractTypes.find((ct) => ct.name === contractType);
        return contract?.id || null;
      }
    }
    const buttonId = getContractTypeId(myContractType);
    await page.locator(`#${buttonId}`).click({ delay: getRandomInt(100, 500) });
    await page
      .locator('[data-testid="jobs-search-select-filter-contract"]')
      .click({ delay: getRandomInt(100, 500) });
  }
  if (
    remoteOrNot !== undefined &&
    remoteOrNot !== null &&
    remoteOrNot !== "all"
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

    // Let's say the user's input is stored in a variable called userInput

    await page
      .locator(remoteWorkOptions[userInput])
      .click({ delay: getRandomInt(100, 500) });
    await page
      .locator("#jobs-search-modal-search-button")
      .click({ delay: getRandomInt(100, 500) });
  }
  // END OF BLOCK CONTRACT JOBS

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
  // Stringify the jobs array with indentation for readability
  const jobsJSON = JSON.stringify(jobsWithSections, null, 2);

  // Write to a file called jobs.json
  fs.writeFileSync("jobs.json", jobsJSON);
})();
