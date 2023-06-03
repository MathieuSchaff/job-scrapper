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
  // THIS COMMENTED BLOCK IS IF YOU WANT TO LOGIN TO WTTJGL
  //
  // const loginButton = await page.$('[data-testid="header-user-links-toggle"]');
  // if (!loginButton) {
  //   console.log("entered login button is not here");
  //   // Wait for the button to be rendered
  //   await page.waitForSelector('[data-testid="header-user-button-login"]');
  //
  //   // Click on the button
  //   await page.click('[data-testid="header-user-button-login"]');
  //   // Random delay
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  //   // Wait for the email input field to be rendered
  //   await page.waitForSelector('[data-testid="login-field-email"]');
  //
  //   // Type into the email input field with a delay between key presses
  //   await page.type(
  //     '[data-testid="login-field-email"]',
  //     email,
  //     { delay: getRandomInt(50, 150) },
  //   );
  //
  //   // Random delay
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  //   // Wait for the password input field to be rendered
  //   await page.waitForSelector('[data-testid="login-field-password"]'); // Update this selector
  //
  //   // Type into the password input field with a delay between key presses
  //   await page.type('[data-testid="login-field-password"]', mdpWttjgl, {
  //     delay: getRandomInt(50, 150),
  //   }); // Update this selector
  //
  //   // Random delay
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  //   // Wait for the submit button to be rendered
  //   await page.waitForSelector('[data-testid="login-button-submit"]');
  //
  //   // Click the submit button
  //   await page.click('[data-testid="login-button-submit"]');
  // }
  //
  // END OF LOGIN BLOCK
  //
  // BLOCK FOR JOB SEARCH
  // !!!!!!!!!!!!!!!!!!!!!!!
  // await page.waitForTimeout(getRandomInt(2000, 5000));
  // // Wait for the "Find a job" link to be rendered
  // // await page.waitForSelector('[data-testid="menu-jobs"] a');
  // await page.waitForSelector('[data-testid="menu-jobs"] a', { state: 'attached' });
  // // Click the "Find a job" link
  // await page.click('[data-testid="menu-jobs"] a');
  // // await page.waitForTimeout(getRandomInt(2000, 5000));
  //
  // // Wait for the input field to be rendered
  // // await page.waitForSelector('[data-testid="jobs-home-search-field-query"]');
  // await page.waitForSelector('[data-testid="jobs-home-search-field-query"]', { state: 'visible' });
  // const buttonJob = await page.locator(
  //   '[data-testid="jobs-home-search-field-query"]'
  // );
  // // Focus on the input field
  // // await page.focus('[data-testid="jobs-home-search-field-query"]');
  // await buttonJob.focus();
  // // Type in the input field with delay
  // await buttonJob.type(jobSearch, {
  //   delay: getRandomInt(100, 500),
  // });
  // // // Press Enter
  // await buttonJob.press("Enter");
  // await page.waitForTimeout(getRandomInt(2000, 5000));
  // //
  // // // // BLOCK FOR LOCATION
  // //
  // await page.waitForSelector(
  //   '[data-testid="jobs-home-search-field-location"] + div button'
  // );
  // const clearButton = await page.$(
  //   '[data-testid="jobs-home-search-field-location"] + div button'
  // );
  // // await page.click('button[title="Clear"]');
  // await clearButton.click();
  // //
  // await page.waitForTimeout(getRandomInt(2000, 5000));
  // // Wait for the location input field
  // await page.waitForSelector('[data-testid="jobs-home-search-field-location"]');
  // //
  // const buttonLocation = await page.$(
  //   '[data-testid="jobs-home-search-field-location"]'
  // );
  // // // Focus on the location input field
  // await buttonLocation.focus('[data-testid="jobs-home-search-field-location"]');
  // //
  // // // Type in the location input field with delay
  // await buttonLocation.type(locationSearch, {
  //   delay: getRandomInt(100, 500),
  // });
  // //
  // // // Press Enter
  // await buttonLocation.press("Enter");
  // await page.waitForTimeout(getRandomInt(2000, 5000));
  // //
  // // // END OF LOCATION BLOCK
  // //
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
  // const jobs = [];
  // for (let i = 0; i < numOfPages; i++) {
  //   let list = await page.$('[data-testid="search-results"]');
  //   await page.waitForSelector(".ais-Hits-list-item");
  //   let articles = await list.$$(".ais-Hits-list-item");
  //   // const articles = await page.$$(".ais-Hits-list-item");
  //   for (const article of articles) {
  //     // const title = await page.evaluate(job => el.querySelector(""))
  //     const companyName = await article.$eval(
  //       "div > div > div",
  //       (el) => el.innerText
  //     );
  //     const title = await article.$eval("h4", (el) => el.innerText.trim());
  //     const link = await article.$eval(
  //       "a", // replace with actual selector for the link
  //       (el) => el.href
  //     );
  //     const secondPartOfJobItem = await article.$(
  //       "div > div > div:nth-child(2)"
  //     );
  //     const location = await secondPartOfJobItem.$eval(
  //       "div p",
  //       (el) => el.innerText
  //     );
  //     const time = await article.$eval("p time span", (el) => el.textContent);
  //     const formatedTime = convertTimeString(time);
  //     // will create a array with tags inside of type toString
  //     const tagsContainer = await secondPartOfJobItem.$("div:nth-child(3)");
  //     const tags = await tagsContainer.$$eval("span", (elements) =>
  //       elements.map((el) => el.textContent)
  //     );
  //     const newTab = await browser.newPage();
  //     await newTab.waitForTimeout(getRandomInt(2000, 5000));
  //     await newTab.goto(link);
  //     await newTab.waitForTimeout(getRandomInt(2000, 5000));
  //     const mainDiv = await newTab.$("main > div:nth-child(2) > div > div");
  //
  //     jobs.push({
  //       title,
  //       link,
  //       formatedTime,
  //       location,
  //       tags,
  //       company: companyName,
  //     });
  //     // jobs.push({ title, link, time company: companyName });
  //   }
  //   const nextButton = await page.$(
  //     'nav[aria-label="Pagination"] ul.sc-1qf12yi-1 li:last-child a'
  //   );
  //   // If Next button exists, then click it
  //   if (nextButton) {
  //     // Click on the Next button
  //     await nextButton.click();
  //   }
  //   await page.waitForTimeout(getRandomInt(2000, 5000));
  // }
  // !!!!!!!!!!!!!!!!!!!
  //
  // await page.waitForTimeout(getRandomInt(2000, 5000));
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

  // await page.waitForTimeout(getRandomInt(2000, 5000));

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
