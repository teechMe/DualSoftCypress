const xml2js = require('xml2js')
const parser = new xml2js.Parser({ explicitArray: false})

/**
 * 
 * @summary This method is validating LogIn response
 * @param {string} response - Response after request
 * @returns {Cypress.Chainable<any>} Authentication token
 * @author Nemanja Mitic
 */
export async function assertLoginResponse(response) {
    expect(response.status).eq(200)
    expect(response.body).to.have.property('token')
    expect(response.body.token).not.eq(null)

    return cy.wrap(response.body.token);
}

/**
 * 
 * @summary This method is validating negative LogIn response
 * @param {string} response - Response after request
 * @returns {Cypress.Chainable<any>} Authentication token
 * @author Nemanja Mitic
 */
export function assertLoginResponseNegative(response) {
    expect(response.status).eq(200)
    expect(response.body).to.have.property('reason')
    expect(response.body.reason).to.eq("Bad credentials")
}

/**
 * 
 * @summary This method is validating Get all bookings response
 * @param {string} response - Response after request
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export function assertGetAllBookingsResponse(response) {
    expect(response.status).eq(200)
    expect(response.body).to.be.an('array')
    expect(response.body.length).to.be.above(0)
    expect(response.body[0]).to.be.an('object')
    expect(response.body[0].bookingid).to.be.above(0)

    return response.body;
}

/**
 * 
 * @summary This method is validating details of specific bookings response
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertGetSpecificBookingResponseJSON(response, statusCode) {
    expect(response.status).eq(statusCode)
    expect(response.body).to.have.property("firstname")
    expect(response.body.firstname).to.be.a("string")
    expect(response.body.firstname.length).to.be.above(0)
    expect(response.body).to.have.property("lastname")
    expect(response.body.lastname.length).to.be.above(0)
    expect(response.body.lastname).to.be.a("string")
    expect(response.body).to.have.property("totalprice")
    expect(response.body.totalprice).to.be.above(0)
    expect(response.body).to.have.property("depositpaid")
    expect(response.body.depositpaid).to.be.oneOf([true, false])
    expect(response.body.depositpaid).to.be.a("boolean")
    expect(response.body).to.have.property("bookingdates")
    expect(response.body.bookingdates).to.be.an('object')
    expect(response.body.bookingdates).to.have.property("checkin")
    expect(response.body.bookingdates.checkin).not.to.eq(null)
    expect(response.body.bookingdates.checkin).to.be.a("string")
    expect(response.body.bookingdates).to.have.property("checkout")
    expect(response.body.bookingdates.checkout).not.to.eq(null)
    expect(response.body.bookingdates.checkout).to.be.a("string")
    expect(response.body).to.have.property("additionalneeds")
    expect(response.body.additionalneeds).not.to.eq(null)

    return cy.wrap(response.body)
}

/**
 * 
 * @summary This method is validating details of specific bookings response in negative case scenario
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertGetSpecificBookingResponseNegative(response, statusCode) {
    expect(response.status).eq(statusCode)
    expect(response.body).to.eq('Not Found')
}

/**
 * 
 * @summary This method is validating specific booking response and performs comparison with created booking in JSON format
 * @param {string} response - Response after request
 * @param {string} bookingDetails - Request body for comparison
 * @param {number} statusCode - Status code of response
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertGetSpecificBookingResponseJSONcomparison(response, bookingDetails, statusCode) {
    expect(response.status).eq(statusCode)
    expect(response.body).to.have.property("firstname")
    expect(response.body.firstname).to.eq(bookingDetails.firstname)
    expect(response.body).to.have.property("lastname")
    expect(response.body.lastname).to.eq(bookingDetails.lastname)
    expect(response.body).to.have.property("totalprice")
    expect(response.body.totalprice).to.eq(bookingDetails.totalprice)
    expect(response.body).to.have.property("depositpaid")
    expect(response.body.depositpaid).to.eq(bookingDetails.depositpaid)
    expect(response.body).to.have.property("bookingdates")
    expect(response.body.bookingdates).to.have.property("checkin")
    expect(response.body.bookingdates.checkin).to.eq(bookingDetails.bookingdates.checkin)
    expect(response.body.bookingdates).to.have.property("checkout")
    expect(response.body.bookingdates.checkout).to.eq(bookingDetails.bookingdates.checkout)
    expect(response.body).to.have.property("additionalneeds")
    expect(response.body.additionalneeds).to.eq(bookingDetails.additionalneeds)
    
    return response.body
}

/**
 * 
 * @summary This method is validating specific booking response in XML format
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertGetSpecificBookingResponseXML(response, statusCode) {
    expect(response.status).eq(statusCode)
    parser.parseString(response.body, (err, result)=>{

        if (err) throw err;
        expect(result.booking).to.have.property('firstname')
        expect(result.booking.firstname).to.be.a("string")
        expect(result.booking.firstname.length).to.be.above(0)
        expect(result.booking).to.have.property('lastname')
        expect(result.booking.lastname).to.be.a("string")
        expect(result.booking.lastname.length).to.be.above(0)
        expect(result.booking).to.have.property('totalprice')
        expect(parseInt(result.booking.totalprice)).to.be.above(0)
        expect(result.booking).to.have.property('depositpaid')
        expect(Boolean(result.booking.depositpaid)).to.be.a("boolean")
        expect(Boolean(result.booking.depositpaid)).to.be.oneOf([true, false])
        expect(result.booking).to.have.property("bookingdates")
        expect(result.booking.bookingdates).to.be.an('object')
        expect(result.booking.bookingdates).to.have.property("checkin")
        expect(result.booking.bookingdates.checkin).not.to.eq(null)
        expect(result.booking.bookingdates.checkin).to.be.a("string")
        expect(result.booking.bookingdates).to.have.property("checkout")
        expect(result.booking.bookingdates.checkout).not.to.eq(null)
        expect(result.booking.bookingdates.checkout).to.be.a("string")
        expect(result.booking).to.have.property("additionalneeds")
        expect(result.booking.additionalneeds).not.to.eq(null)
    })

    return response.body
}

/**
 * 
 * @summary This method is validating specific booking details in URL encoded format
 * @param {string} response - Response after request
 * @param {string} requestBody - Request body for comparison
 * @param {number} statusCode - Status code of response
 * @author Nemanja Mitic
 */
export function assertGetSpecificBookingURL(response, requestBody, statusCode) {
    expect(response.status).eq(statusCode)
    expect(response.body).to.contain(requestBody)
}

/**
 * 
 * @summary This method is validating new booking creation response in JSON format
 * @param {string} response - Response after request
 * @param {string} bookingDetails - Request body for comparison
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertNewBookingResponseJSON(response, bookingDetails){
    expect(response.status).eq(200)
    expect(response.body).to.have.property("bookingid")
    expect(response.body.bookingid).to.be.a("number")
    expect(response.body.bookingid).to.be.above(0)
    expect(response.body).to.have.property("booking")
    expect(response.body.booking).to.be.an("object")
    expect(response.body.booking.firstname).eq(bookingDetails.firstname)
    expect(response.body.booking.lastname).eq(bookingDetails.lastname)
    expect(response.body.booking.totalprice).eq(bookingDetails.totalprice)
    expect(response.body.booking.depositpaid).eq(bookingDetails.depositpaid)
    expect(response.body.booking.bookingdates.checkin).to.eq(bookingDetails.bookingdates.checkin)
    expect(response.body.booking.bookingdates.checkout).to.eq(bookingDetails.bookingdates.checkout)
    expect(response.body.booking.bookingdates.additionalneeds).to.eq(bookingDetails.bookingdates.additionalneeds)

    return response.body
}

/**
 * 
 * @summary This method is validating new booking creation response in JSON format, in negative case scenario
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertNewBookingResponseJSONNegative(response, statusCode){
    expect(response.status).eq(statusCode)
    expect(response.body).to.eq('Internal Server Error')
}

/**
 * 
 * @summary This method is validating new booking creation response in XML format
 * @param {string} response - Response after request
 * @param {string} bookingDetails - Request body for comparison
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertNewBookingResponseXML(response, bookingDetails){
    expect(response.status).eq(200)

    // Parse the response body:
    parser.parseString(response.body, (err, result)=>{
        if (err) throw err;

        // Parse the expected bookingDetails XML string
        parser.parseString(bookingDetails, (err2, expected) => {
            if(err2) throw err2;

            expect(result["created-booking"]).to.have.property('bookingid')
            expect(parseInt(result["created-booking"].bookingid)).to.be.above(0)
            expect(result["created-booking"]).to.have.property('booking')
            expect(result["created-booking"].booking).to.have.property('firstname')
            expect(result["created-booking"].booking.firstname).to.eq(expected.booking.firstname)
            expect(result["created-booking"].booking).to.have.property('lastname')
            expect(result["created-booking"].booking.lastname).to.eq(expected.booking.lastname)
            expect(result["created-booking"].booking).to.have.property('totalprice')
            expect(result["created-booking"].booking.totalprice).to.eq(expected.booking.totalprice)
            expect(result["created-booking"].booking).to.have.property('depositpaid')
            expect(result["created-booking"].booking.depositpaid).to.eq(expected.booking.depositpaid)
            expect(result["created-booking"].booking.bookingdates).to.have.property('checkin')
            expect(result["created-booking"].booking.bookingdates.checkin).to.eq(expected.booking.bookingdates.checkin)
            expect(result["created-booking"].booking.bookingdates).to.have.property('checkout')
            expect(result["created-booking"].booking.bookingdates.checkout).to.eq(expected.booking.bookingdates.checkout)
            expect(result["created-booking"].booking).to.have.property('additionalneeds')
            expect(result["created-booking"].booking.additionalneeds).to.eq(expected.booking.additionalneeds)
        })       
    })
    return response
}

/**
 * 
 * @summary This method is validating new booking creation response in URL encoded format
 * @param {string} response - Response after request
 * @param {string} bookingDetails - Request body for comparison
 * @returns {Cypress.Chainable<any>} Response body
 * @author Nemanja Mitic
 */
export async function assertNewBookingResponseURL(response, bookingDetails) {
    expect(response.status).eq(200)
    expect(response.body).to.contain(bookingDetails)
    
    return response.body
}

/**
 * 
 * @summary This method is validating booking update response in JSON format, in negative case scenario
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @author Nemanja Mitic
 */
export async function assertUpdateBookingResponseJSONNegative(response, statusCode){
    expect(response.status).eq(statusCode)
    expect(response.body).to.eq('Method Not Allowed')
}

/**
 * 
 * @summary This method is validating partial booking update (PATCH) response in JSON format
 * @param {string} response - Response after request
 * @param {string} reqBody - Request body for comparison
 * @author Nemanja Mitic
 */
export async function assertPartialUpdateJSONcomparison(response, reqBody) {
    expect(response.status).eq(200)
    expect(response.body.firstname).to.eq(reqBody.firstname)
    expect(response.body.lastname).to.eq(reqBody.lastname)
}

/**
 * 
 * @summary This method is validating booking deletion response
 * @param {string} response - Response after request
 * @param {number} statusCode - Status code of response
 * @author Nemanja Mitic
 */
export function assertBookingDeletion(response, statusCode) {
    let responseBody;
    if (statusCode === 405) {
        responseBody = "Method Not Allowed"
    } else {
        responseBody = "Created"
    }
    expect(response.status).eq(statusCode)
    expect(response.body).eq(responseBody)
}