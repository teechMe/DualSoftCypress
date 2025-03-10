const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    specPattern: "**/*.cy.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      apiBaseUrl: "https://restful-booker.herokuapp.com",
      logIn: "/auth",
      booking: "/booking"
    }
  },
});
