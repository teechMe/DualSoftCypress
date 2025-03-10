import { authorization } from "../config";
import { getRandomInt, addDate } from "../helpers/utils.cy.js";

import * as assertions from "../helpers/assertions";
const xml2js = require('xml2js')

const apiBaseUrl = Cypress.env("apiBaseUrl");
const logInApi = Cypress.env("logIn");
const bookingApi = Cypress.env("booking");

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

let bookingId;

/**
 * 
 * @summary This command is loging in specified user and returns authToken
 * @param {object} credentials - The username and password combination
 * @param {boolean} negativeTests - Flag which indicated that the test is negative. Can be true/false
 * @returns {Cypress.Chainable<any>} Authentication token
 * @author Nemanja Mitic
 */
Cypress.Commands.add("logInReq", (credentials, negativeTests)=>{
    cy.request({
        method: "POST",
        url: `${apiBaseUrl}${logInApi}`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: credentials
    }).then((response) => {
        if (negativeTests){
            assertions.assertLoginResponseNegative(response)
        } else {
            return assertions.assertLoginResponse(response)
        }
    })
})

/**
 * 
 * @summary This command is getting all Booking IDs
 * @param {string} authToken - The authorization token
 * @param {string} queryParams - Query parameters used for filtering the response for specific booking dates or names/lastnames
 * @returns {Cypress.Chainable<any>} The chainable containing the response.
 * @author Nemanja Mitic
 */
Cypress.Commands.add("getAllBookingIds", (authToken, queryParams)=>{
      cy.request({
            method: "GET",
            url: `${apiBaseUrl}${bookingApi}`,
            headers: {
                Authorization: `Bearer ${authToken}`
            },
            qs: queryParams
        }).then((response) => {
            return assertions.assertGetAllBookingsResponse(response)
     })
})

/**
 *
 * @summary This command is getting details of the specific Booking ID
 * @param {string} authToken - The authorization token.
 * @param {number} bookingId - The booking ID.
 * @param {string} resType - The response type ('json' or 'xml').
 * @param {string} bookingDetails - Optional booking details for comparison.
 * @param {boolean} createdBooking - Flag indicating if the booking was created by current administrator.
 * @param {number} statusCode - Status code of response, for validation.
 * @returns {Cypress.Chainable<any>} The chainable containing the response.
 * @author Nemanja Mitic
 */
Cypress.Commands.add("getSpecificBooking", (authToken, bookingId, resType, bookingDetails, createdBooking, statusCode) => {
        cy.request({
            method: "GET",
            url: `${apiBaseUrl}${bookingApi}/${bookingId}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: `application/${resType}`
            },
            failOnStatusCode: false,
        }).then((response) => {
            if (statusCode === 404) {
                assertions.assertGetSpecificBookingResponseNegative(response, statusCode)
            } else {
            if (resType === "json"){
                if (createdBooking){
                    return assertions.assertGetSpecificBookingResponseJSONcomparison(response, bookingDetails, statusCode)
                } else {
                    return assertions.assertGetSpecificBookingResponseJSON(response, statusCode)
                }
            } else {
                assertions.assertGetSpecificBookingResponseXML(response, statusCode)
            }
        }
        })
})

/**
 *
 * @summary This command is creating new booking
 * @param {string} authToken - The authorization token.
 * @param {string} bookingDetails - Optional booking details for comparison.
 * @param {string} reqType - The request type ('json' or 'xml').
 * @param {string} resType - The response type ('json' or 'xml').
 * @param {number} statusCode - Status code of response, for validation.
 * @returns {Cypress.Chainable<any>} The chainable containing the response.
 * @author Nemanja Mitic
 */
Cypress.Commands.add("createNewBooking", (authToken, bookingDetails, reqType, resType, statusCode) =>{
    let contentType, fail;
    if (statusCode === 500 && reqType === 'json'){
        fail = false
    } else if (statusCode !== 500 && reqType === 'json'){
        fail = true;
        contentType = 'application/json'
        
        //Set the details of new booking:
        bookingDetails.firstname = "Nemanja"
        bookingDetails.lastname = "Karađorđević"
        bookingDetails.totalprice = getRandomInt(1, 200)
        bookingDetails.depositpaid = false
        const today = new Date().toISOString().substring(0, 10);
        bookingDetails.bookingdates.checkin = today
        bookingDetails.bookingdates.checkout = addDate(today, 5)

    } else if (reqType === 'xml'){
        fail = true;
        contentType = 'text/xml'

        //Set the details of new booking:
        xml2js.parseString(bookingDetails, (err, result) => {
            if(err) throw err;
            result.booking.totalprice[0] = getRandomInt(1, 200)
            result.booking.depositpaid[0] = false
            const today = new Date().toISOString().substring(0, 10);
            result.booking.bookingdates[0].checkin = today
            result.booking.bookingdates[0].checkout = addDate(today, 5)
            
            const builder = new xml2js.Builder();
            const updatedXml = builder.buildObject(result);
            bookingDetails = updatedXml
        })
    } else {
        fail = true;
        contentType = 'application/x-www-form-urlencoded'
    }

    cy.request({
            method: "POST",
            url: `${apiBaseUrl}${bookingApi}`,
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': contentType,
                Accept: `application/${resType}`
            },
            body: bookingDetails,
            failOnStatusCode: fail
        }).then((response) => {
            if (resType === 'json'){
                if (statusCode  === 500){
                    assertions.assertNewBookingResponseJSONNegative(response, statusCode)
                } else {
                bookingId = response.body.bookingid;
                return assertions.assertNewBookingResponseJSON(response, bookingDetails)
                }
            } else if (resType === 'xml') {
                return assertions.assertNewBookingResponseXML(response, bookingDetails)
            } else {
                return assertions.assertNewBookingResponseURL(response, bookingDetails)
            }
     })
})

/**
 *
 * @summary This command is updating a booking
 * @param {number} bookingId - The booking ID.
 * @param {string} reqType - The request type ('json' or 'xml').
 * @param {string} resType - The response type ('json' or 'xml').
 * @param {string} body - Request body
 * @param {number} statusCode - Status code of response, for validation.
 * @author Nemanja Mitic
 */
Cypress.Commands.add("updateBooking", (bookingId, reqType, resType, body, statusCode) => {
    let contentType, fail;
    if (reqType === 'json'){
        contentType = "application/json"
    } else if (reqType === 'text/xml'){
        contentType = "text/xml"
    } else {
        contentType = 'application/x-www-form-urlencoded'
    }

    if (statusCode === 405){
        fail = false;
    } else {
        fail = true;
    }

    cy.request({
        method: "PUT",
        url: `${apiBaseUrl}${bookingApi}/${bookingId}`,
        headers: {
            "Content-Type": contentType,
            Accept: `application/${resType}`,
            Authorization: authorization
        },
        body: body,
        failOnStatusCode: fail
    }).then((response)=> {
        if (reqType === 'json'){
            if (fail === false) {
                assertions.assertUpdateBookingResponseJSONNegative(response, statusCode)
            } else {
            assertions.assertGetSpecificBookingResponseJSONcomparison(response, body, statusCode)
            }
        } else if (reqType === 'text/xml') {
            assertions.assertGetSpecificBookingResponseXML(response, statusCode)
        } else {
            assertions.assertGetSpecificBookingURL(response, body, statusCode)
        }
    })
})


/**
 *
 * @summary This command is patching a booking
 * @param {number} bookingId - The booking ID.
 * @param {string} reqType - The request type ('json' or 'xml').
 * @param {string} resType - The response type ('json' or 'xml').
 * @param {string} reqBody - Request body
 * @author Nemanja Mitic
 */
Cypress.Commands.add("partialUpdateBooking", (bookingId, reqType, resType, reqBody) => {
    let contentType;
    if (reqType === 'json'){
        contentType = "application/json"
    } else if (reqType === 'text/xml'){
        contentType = "text/xml"
    } else {
        contentType = 'application/x-www-form-urlencoded'
    }

    cy.request({
        method: "PATCH",
        url: `${apiBaseUrl}${bookingApi}/${bookingId}`,
        headers: {
            "Content-Type": contentType,
            Accept: `application/${resType}`,
            Authorization: authorization
        },
        body: reqBody
    }).then((response)=> {
        if (reqType === 'json'){
            assertions.assertPartialUpdateJSONcomparison(response, reqBody)
        } else if (reqType === 'text/xml') {
            assertions.assertGetSpecificBookingResponseXML(response, 200)
        } else {
            assertions.assertGetSpecificBookingURL(response, reqBody)
        }
    })
})

/**
 *
 * @summary This command is deleting a booking
 * @param {number} bookingId - The booking ID.
 * @param {number} statusCode - Expected response status code, for validation.
 * @author Nemanja Mitic
 */
Cypress.Commands.add("deleteBooking", (bookingId, statusCode) =>{
    let fail;
    if (statusCode === 405){
        fail = false
    } else {
        fail = true
    }
    cy.request({
        method: "DELETE",
        url: `${apiBaseUrl}${bookingApi}/${bookingId}`,
        headers: {
            "Content-Type": "application/json",
            Authorization: authorization
        },
        failOnStatusCode: fail
    }).then((response) => {
        assertions.assertBookingDeletion(response, statusCode)
    })
})