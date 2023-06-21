// playwright-extra is a drop-in replacement for playwright,
// it augments the installed playwright with plugin functionality
const { chromium } = require("playwright-extra");

// Load the stealth plugin and use defaults (all tricks to hide playwright usage)
// Note: playwright-extra is compatible with most puppeteer-extra plugins
const stealth = require("puppeteer-extra-plugin-stealth")();
const fs = require("fs");

const dotenv = require("dotenv");
const getRandomInt = require("./../utils/randomInt");
const { log } = require("console");

// Add the plugin to playwright (any number of plugins can be added)
chromium.use(stealth);
dotenv.config();

// const website =
//   "https://fr.indeed.com/jobs?q=alternance+d%C3%A9veloppeur+web&l=T%C3%A9l%C3%A9travail&from=subwaywebapp&hl=fr_FR&vjk=4a73331af6f65444";
const website = "https://fr.indeed.com/";
(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 50,
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  });
  const page = await context.newPage();
  await page.goto(website);
  const inputWhat = page.locator("#text-input-what");
  await page.waitForTimeout(getRandomInt(2000, 5000));
  await inputWhat.type("alternance développeur web", { delay: 100 });
  const inputWhere = page.locator("#text-input-where");
  await inputWhere.type("france", { delay: 100 });
  await page.locator("button[type=submit]").click();
  await page.waitForTimeout(getRandomInt(2000, 4000));
  const list = page.locator("#mosaic-jobResults > div > ul > li");
  const jobs = [];
  const descriptions = [];
  const count = await list.count();
  for (let i = 0; i < count; i++) {
    if (i !== 5 && i !== 11 && i !== 17) {
      await page.waitForTimeout(getRandomInt(500, 1500));
      await list.nth(i).click();
      let article = list.nth(i);
      let innerText = await article.innerText();
      let offre = innerText.split("\n").join(" ");
      jobs.push({ offre });
      await page.waitForTimeout(getRandomInt(1000, 2500));
      const descDiv = page.locator("#jobDescriptionText");
      let innerDesc = await descDiv.innerText();
      let desc = innerDesc.split("\n").join(" ");
      console.log(desc);
      descriptions.push({ description: desc });
    } else {
      console.log("empty <li>");
    }
  }
  const descJSON = JSON.stringify(descriptions);
  fs.writeFileSync("descs.json", descJSON);
  const jobsJSON = JSON.stringify(jobs);
  fs.writeFileSync("jobs.json", jobsJSON);
})();

// wait for the page to load
// const pageTitle = await page.title();
// console.log(`The title of the page is: ${pageTitle}`);
// await page.waitForSelector("main section");
// const sections = await page.$$eval("main section", (sections) => {
//   return sections.map((section) => section.textContent);
// });
// console.log(sections);
// await browser.close();
