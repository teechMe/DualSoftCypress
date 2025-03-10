## API Testing framework with Cypress and Chai

## Getting started
Make sure you have proper version (v20.18.2) of NodeJS environment set up.
- Clone the project to your machine
- Install Cypress with `npm install cypress --save-dev`

## Tests Execution
There are 2 ways to run tests:
1. `npx cypress open` which will open Cypress runner where you can choose between spec files to run
2. `npx cypress run --spec cypress\e2e\booking\*.cy.js` which will run all tests in command line

## What's where?
- e2e/booking - location of all spec files
- fixtures - test data for booking creation
- helpers/assertions - all assertions are located here
- helpers/utils - utility methods storage
- support/commands - API requests handling
- config - user credentials and authentications
- cypress.config - list of API endpoints
