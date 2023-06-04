# Job Search

This script allows you to automate job searches based on various criteria. This guide provides details on how to use `.env` variables to specify your search parameters.

## Environment Variables

| Variable Name               | Description                                                                                             | Example                              | Mandatory |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------- |
| `WTTJGL_EMAIL`              | Your email address used for logging into the website                                                    | `WTTJGL_EMAIL=toto@gmail.com`        | No        |
| `WTTJGL_PASSWD`             | Your password used for logging into the website                                                         | `WTTJGL_PASSWD=toto`                 | No        |
| `WTTJGL_NUMPAGES`           | The number of pages to be scraped from the job listings                                                 | `WTTJGL_NUMPAGES=1`                  | No        |
| `WTTJGL_SEARCH`             | The keyword(s) used in the job search                                                                   | `WTTJGL_SEARCH=Développeur frontend` | Yes       |
| `WTTJGL_LOCATION`           | The location used in the job search                                                                     | `WTTJGL_LOCATION=France`             | Yes       |
| `WTTJGL_CONTRACT_TYPE`      | The contract type used in the job search, can be a string or a number                                   | `WTTJGL_CONTRACT_TYPE=all`           | No        |
| `WTTJGL_REMOTE_WORK_OPTION` | The remote work option used in the job search, can be 'no', 'punctual', 'partial', 'fulltime', or 'all' | `WTTJGL_REMOTE_WORK_OPTION=all`      | No        |

### Important Note

Ensure all mandatory environment variables are correctly set for the script to work as expected. Missing or invalid values may cause the script to fail or behave unexpectedly.

Place these environment variables in a `.env` file at the root of your project. Use the `dotenv` package to load them into your script. Don't forget to include `.env` in your `.gitignore` file to avoid committing sensitive information to your Git repository.

## Using the .env File to Specify a Contract Type

You can specify a contract type in the .env file to search for jobs of a particular type. To do this, set the `CONTRACT_TYPE` variable in the .env file to either the name or the number of the desired contract type.

Here is the list of contract types you can choose from:

1. Permanent contract
2. Work-study
3. Internship
4. Fixed-term / Temporary
5. Other
6. Freelance
7. Part-time
8. International Corporate Volunteer Program
9. Graduate program
10. Volunteer work
11. IDV

If you want to search by contract type, you can set `CONTRACT_TYPE` to either the name of the contract type (as a string)
or its number in the list above (as a number).
For example: CONTRACT_TYPE="Internship" // is the same as :WTTJGL_CONTRACT_TYPE=3

If you don't specify a contract type, the script will search for all types of jobs.
You can also specify WTTJGL_CONTRACT_TYPE=all but it is not necessary

This is achieved using the `getContractTypeId` function in the script. This function takes the contract type specified in the .env file,
looks up the corresponding id in the `contractTypes` array, and returns the id.
If the specified contract type is a number, the function treats it as an index into the `contractTypes` array.
If the contract type is a string, the function finds the object in the `contractTypes` array with a matching `name` property.

Note: If you specify a contract type that isn't in the list above, or a number that's outside the range of the list,
the `getContractTypeId` function will return `null`, and the script will search for all types of jobs.

## Remote Work Option

This script also allows you to choose a remote work option when searching for jobs. The available options are:

    no - Unknown
    punctual - Occasional remote
    partial - Partial remote
    fulltime - Open to full remote

You can set the remote work option in the .env file with the key REMOTE_WORK_OPTION.

Example:
WTTJGL_REMOTE_WORK_OPTION=partial

WTTJGL_REMOTE_WORK_OPTION=all

If set to all, it will search for all.
It undefined or null, will search for all contract type remote or not remote friendly etc
