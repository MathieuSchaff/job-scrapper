const { chromium } = require("playwright");

const website =
  "https://www.welcometothejungle.com/en/companies/alltricks/jobs/lead-frontend-javascript-react-h-f_saint-quentin-en-yvelines";
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
  // wait for the page to load
  const pageTitle = await page.title();
  console.log(`The title of the page is: ${pageTitle}`);
  await page.waitForSelector("main section");

  const sections = await page.$$eval("main section", (sections) => {
    return sections.map((section) => section.textContent);
  });

  console.log(sections);
  await browser.close();
})();
