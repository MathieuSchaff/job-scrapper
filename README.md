# Clicking Contract Types

This project uses Playwright to interact with a webpage. One of the actions we support is clicking on a contract type button. Each type of contract has a corresponding button, identified by a unique id.

There are several contract types available:

    Permanent contract
    Work-study
    Internship
    Fixed-term / Temporary
    Other
    Freelance
    Part-time
    International Corporate Volunteer Program
    Graduate program
    Volunteer work
    IDV

Each of these contract types corresponds to a number from 1 to 11. You can click on a contract type either by its name or by its number.

To click on a contract type, call the function clickContractType and pass in either the name of the contract type as a string or its number.

For example:

javascript

await clickContractType(2); // by index
// or
await clickContractType("Internship"); // by name

This will click on the corresponding contract type button on the webpage.
Using .env Variables

The clickContractType function uses a variable that is loaded from a .env file. This project uses the dotenv library to load these environment variables.

Make sure you have a .env file in the root of your project with the contract type you want to select. It should look something like this:

bash

CONTRACT_TYPE=2

### or

CONTRACT_TYPE="Internship"

Then, you can call clickContractType with the CONTRACT_TYPE environment variable. This allows you to easily change the contract type to select without changing the code.

javascript

require('dotenv').config();
const contractType = process.env.CONTRACT_TYPE;
await clickContractType(contractType);

Note that the .env file should not be committed to your version control system. It is usually added to the .gitignore file to prevent it from being committed.
