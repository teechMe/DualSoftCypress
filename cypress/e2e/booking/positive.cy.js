import { credentials } from "../../config";
import { getRandomElement } from "../../helpers/utils.cy.js";
const xml2js = require('xml2js')
const parser = new xml2js.Parser({ explicitArray: false})

/** 
*
* This describe is going through complete administrator's jurney of logging in to app, 
* getting all bookings, getting specific booking, creation of new booking, updating it and patching. Lastly,
* newly created booking is deleted. All types of request from documentation are covered: JSON, XML and URL.
*
*/

describe("Booking", () => {

    let authToken, bookings, bookingId, bookingDetails, createdBookingId;

    //Import of fixture files:
    beforeEach(function() {
        cy.fixture('bookingXML').as('bookingXML');
        cy.fixture('bookingURL').as('bookingURL');
        cy.fixture('bookingJSON').as('bookingJSON');
      });

    before("LogIn", () => {
        cy.logInReq(credentials, false).then((login) => {
            authToken = login.token
            cy.log(authToken)
        })
    })

    it("Get all bookings - No filter", () => {
        cy.getAllBookingIds(authToken, null)
    })

    it("Get all bookings - Filter by name", () => {
        let queryParams = {
            name: "Jane",
            lastname: "Doe"
        }
        cy.getAllBookingIds(authToken, queryParams)
    })

    it("Get all bookings - Filter by check in/check out dates", () => {
        let queryParams = {
            checkin:'2015-03-13',
            checkout: '2019-05-21'
        }
        cy.getAllBookingIds(authToken, queryParams).then((response) => {
            bookings = response
            bookingId = Object.values(getRandomElement(bookings))[0];
        })
    })

    it("Get specific booking details - In JSON format", () => {
        let resType = 'json'
        cy.getSpecificBooking(authToken, bookingId, resType, null, false, 200).then((response) => {
            bookingDetails = response
        })      
    })

    it("Get specific booking details - In XML format", () => {
        let resType = 'xml'
        cy.getSpecificBooking(authToken, bookingId, resType, false, false, 200)    
    })

    it("Create new booking for a specific user - In JSON format", () => {
        let reqType = 'json'
        let resType = 'json'
        cy.createNewBooking(authToken, bookingDetails, reqType, resType, false).then((response) => {
            createdBookingId = Object.values(response)[0]
        })
    })

    it("Get specific booking details - for Created booking", () => {
        let resType = 'json'
        cy.getSpecificBooking(authToken, createdBookingId, resType, bookingDetails, true, 200).then((response) => {
            bookingDetails = response
        })      
    })

    it("Create new booking for a specific user - In XML format", function() {
        let reqType = 'xml'
        let resType = 'xml'
        bookingDetails = this.bookingXML

        cy.createNewBooking(authToken, bookingDetails, reqType, resType).then((response) => {
            parser.parseString(response.body, (err, result) => {
                if (err) throw err;
                // Extract the bookingid;
                createdBookingId = result['created-booking'].bookingid;
              });
        })
    })

    it("Create new booking for a specific user - In URL encoded format", function() {
        let reqType = 'url'
        let resType = 'x-www-form-urlencoded'

        bookingDetails = this.bookingURL

        cy.createNewBooking(authToken, bookingDetails, reqType, resType).then((response) => {
            createdBookingId = parseInt(response.split('&')[0].split("=")[1])
        })
    })

    it('Update newly created booking - JSON', function() {
        let reqType = 'json'
        let resType = 'json'
        let body = this.bookingJSON
        cy.updateBooking(createdBookingId, reqType, resType, body, 200)
    })

    it("Get specific booking details - for updated booking", function() {
        let resType = 'json'
        let body = this.bookingJSON
        cy.getSpecificBooking(authToken, createdBookingId, resType, body, true, 200).then((response) => {
            bookingDetails = response
        })      
    })

    it('Update newly created booking - XML', function() {
        let reqType = 'text/xml'
        let resType = 'xml'
        let body = this.bookingXML
        cy.updateBooking(createdBookingId, reqType, resType, body, 200)
    })

    it('Update newly created booking - URL', function() {
        let reqType = 'url'
        let resType = 'x-www-form-urlencoded'
        let body = this.bookingURL
        cy.updateBooking(createdBookingId, reqType, resType, body, 200)
    })

    it('Patch newly created booking - JSON', function() {
        let reqType = 'json'
        let resType = 'json'
        let body = {
            firstname: 'Jurij',
            lastname: 'Gagarin'
        }
        cy.partialUpdateBooking(createdBookingId, reqType, resType, body)
    })

    it('Delete created booking', () => {
        cy.deleteBooking(createdBookingId, 201)
    })

    it("Get specific booking details - After deletion", () => {
        let resType = 'json'
        cy.getSpecificBooking(authToken, createdBookingId, resType, null, false, 404)
    })

})