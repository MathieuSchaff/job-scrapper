const { chromium } = require("playwright");

const dotenv = require("dotenv");
const getRandomInt = require("./../utils/randomInt");
const convertTimeString = require("./../utils/timeConverter");
dotenv.config();
// // const email = process.env.WTTJGL_EMAIL;
// // const mdpWttjgl = process.env.WTTJGL_PASSWD;
const website = process.env.WTTJGL_WEBSITE;
const jobSearch = process.env.WTTJGL_SEARCH;
const numOfPages = process.env.WTTJGL_NUMPAGES;
const locationSearch = process.env.WTTJGL_LOCATION;
const email = process.env.WTTJGL_EMAIL;
const mdpWttjgl = process.env.WTTJGL_PASSWD;

// async function getWttJglJobOffers(page) {
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
  const loginButtons = page.locator('[data-testid="header-user-button-login"]');

  if ((await loginButtons.count()) > 0) {
    console.log("entered login button is here");
    const firstLoginButton = loginButtons.nth(0); // If you want the second, use nth(1)

    // Wait for the button to be attached to the DOM
    await firstLoginButton.waitFor({ state: "attached" });

    // Click on the button
    await firstLoginButton.click();

    // Wait for the email input field to be rendered
    const emailInput = await page.locator('[data-testid="login-field-email"]');
    await emailInput.waitFor({ state: "visible" });

    // Type into the email input field with a delay between key presses
    await emailInput.type(email, { delay: getRandomInt(50, 150) });

    // Wait for the password input field to be rendered
    const passwordInput = await page.locator(
      '[data-testid="login-field-password"]'
    );
    await passwordInput.waitFor({ state: "visible" });

    // Type into the password input field with a delay between key presses
    await passwordInput.type(mdpWttjgl, { delay: getRandomInt(50, 150) });

    // Random delay

    // Wait for the submit button to be rendered
    const submitButton = await page.locator(
      '[data-testid="login-button-submit"]'
    );
    await submitButton.waitFor({ state: "visible" });

    // Click the submit button
    await submitButton.click();
  }
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
  const jobLink = page.getByRole("link", { name: "Find a job", exact: true });
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

  // await page.waitForTimeout(getRandomInt(2000, 5000));

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

  const jobs = [];

  for (let i = 0; i < numOfPages; i++) {
    await page.waitForSelector(".ais-Hits-list-item");

    const articles = page.locator(".ais-Hits-list-item");

    for (let j = 0; j < (await articles.count()); j++) {
      const article = articles.nth(j);

      const companyName = await article.textContent("div > div > div");
      const title = await article.textContent("h4");
      const link = await article.getAttribute("a", "href");
      const location = await article.textContent(
        "div > div > div:nth-child(2) div p"
      );
      const time = await article.textContent("p time span");
      const formatedTime = convertTimeString(time);
      const tagsLocators = article.locator(
        "div > div > div:nth-child(2) div:nth-child(3) span"
      );
      const tags = [];
      for (let i = 0; i < (await tagsLocators.count()); i++) {
        const tag = await tagsLocators.nth(i).textContent();
        tags.push(tag);
      }
      // const newTab = await browser.newPage();
      // await newTab.waitForTimeout(getRandomInt(2000, 5000));
      // await newTab.goto(link);
      // await newTab.waitForTimeout(getRandomInt(2000, 5000));
      // const mainDiv = await newTab.locator(
      //   "main > div:nth-child(2) > div > div"
      // );

      jobs.push({
        title,
        link,
        formatedTime,
        location,
        tags,
        company: companyName,
      });
    }

    // const nextButton = page.locator(
    //   'nav[aria-label="Pagination"] ul.sc-1qf12yi-1 li:last-child a'
    // );
    //
    // if (await nextButton.count()) {
    //   await nextButton.click();
    // }

    // await page.waitForTimeout(getRandomInt(2000, 5000));
  }
  console.log(jobs);
})();
// getWttJglJobOffers();
