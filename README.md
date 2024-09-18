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
- To run all tests type `npm run test`
- To run specific tests see the section `Helpful tool/plugins` below.

## UI Mode

UI Mode lets you explore, run and debug tests with a time travel experience complete with watch mode. All test files are loaded into the testing sidebar where you can expand each file and describe block to individually run, view, watch and debug each test. Filter tests by text or @tag or by passed, failed and skipped tests as well as by projects as set in your playwright.config file. See a full trace of your tests and hover back and forward over each action to see what was happening during each step and pop out the DOM snapshot to a separate window for a better debugging experience.

To open UI mode, run the following command in your terminal: `npx playwright test --ui`

## Project Breakdown

All of the code is under the `src` folder. This framework uses the [page object model](https://playwright.dev/docs/pom) as a design pattern for storing selectors and performing tasks that require more than one action for a step. The main tests are in the `tests` folder and the page classes are in the `pages` folder. We also use creational design patterns with playwright [fixtures](https://zoopla.blog/posts/2023/test-framework-migration/)
to make using the page classes more cleaner and easier.

## Viewing Trace

Playwright Trace Viewer is a GUI tool that helps you explore recorded Playwright traces after the script has run. Traces are a great way for debugging your tests when they fail on CI. You can open traces locally (`npx playwright show-trace path/to/trace.zip`) or in your browser on trace.playwright.dev.

## Helpful tools/plugins

1. [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). Take a look at this [video](https://www.youtube.com/watch?v=ECkMUATC1aA) to get a quick intro on how to use this tool to troubleshoot, record, run, select selectors, and debug your tests from within VSCode.
