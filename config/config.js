const email = "my-email-here@gmail.com";
const jobSearch = "Développeur frontend";
const location = "France";
const numOfPages = 1;
/**
 * This is the config file for the app.
 * @module config
 * @type {object}
 * @property {object} common - Common config for all scrapers
 * @property {string} common.jobSearch - The job search keyword
 * @property {string} common.location - The job search location
 * @property {number} common.numOfPages - The number of pages to scrape
 * @property {object} linkedin - Linkedin config
 * @property {string} linkedin.email - The linkedin email
 * @property {string} linkedin.password - The linkedin password
 * @property {number} linkedin.remote - The remote work option
 * @property {number} linkedin.datePosted - The date posted filter
 * @property {number} linkedin.experienceLevel - The experience level filter
 * @property {object} welcometothejungle - Welcometothejungle config
 * @property {string} welcometothejungle.email - The welcometothejungle email
 * @property {string} welcometothejungle.password - The welcometothejungle password
 * @property {string} welcometothejungle.contractType - The contract type filter
 * @property {string} welcometothejungle.remote- The remote work option filter
 *
 */
const config = {
  common: {
    jobSearch,
    location,
    numOfPages,
  },
  linkedin: {
    email,
    password: "mySecretPassword",
    remote: 1,
    datePosted: 1,
    experienceLevel: 4,
  },
  welcomeToTheJungle: {
    // email: "myEmail@email.com",
    // password: "mySecretPassword",
    contractType: "all",
    remote: "all",
  },
  indeed: {
    contractType: 1,
    remote: 1,
    datePosted: 1,
  },
};

module.exports = config;
