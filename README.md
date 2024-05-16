# PLAYWRIGHT Framework

This project is the main repository for functional UI tests for the Hearst store

## Dependencies

- vscode or any other IDE of your choice
- NodeJS
- Playwright

## How To Run Locally

#### Setup For Local Web Testing

Assumptions: Mac with VSCode installed. We also use YARN in this repo.

- [Install NodeJS](https://nodejs.org/en/download) or type `brew install node` in terminal if you have homebrew installed
  - To check if node and npm is installed run `node -v` and
    `npm -v` in your terminal
- Clone this repo to your local machine and navigate to the root of the folder
- Type `npx playwright install` to install playwright browsers
- Type `npm i` to install dependencies

## Project Breakdown

All of the code is under the `src` folder. This framework uses the [page object model](https://playwright.dev/docs/pom) as a design pattern for storing selectors and performing tasks that require more than one action for a step. The main tests are in the `test` folder and the page classes are in the `pages` folder. We also use creational design patterns with playwright [fixtures](https://zoopla.blog/posts/2023/test-framework-migration/) to make using the page classes more cleaner and easier.

## Helpful tools/plugins

1. [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Take a look at this [video](https://www.youtube.com/watch?v=ECkMUATC1aA) to get a quick intro on how to use this tool to troubleshoot, record, run, select selectors, and debug your tests from within VSCode.
