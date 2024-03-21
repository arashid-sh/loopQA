# PLAYWRIGHT Framework

This project is the main repository for functional UI tests for the Hearst store

## Dependencies

- vscode or any other IDE of your choice
- NodeJS
- Yarn
- Playwright

## How To Run Locally

#### Setup For Local Web Testing

Assumptions: Mac with VSCode installed. We also use YARN in this repo.

- [Install NodeJS](https://nodejs.org/en/download) or type `brew install node` in terminal if you have homebrew installed
  - To check if node and npm is installed run `node -v` and
    `npm -v` in your terminal
- Clone this repo to your local machine and navigate to the root of the folder
- Type `npx playwright install` to install playwright browsers
- Type `yarn` to install dependencies
- Rename the `.env.template`, in the root of this project, to `.env`
