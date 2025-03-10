import { credentials } from "../../config";

/** 
* This describe is collection of negative tests agains login and booking apis
*/

describe('Negative', ()=>{

    //Import of fixture files:
    beforeEach(function() {
        cy.fixture('bookingJSON').as('bookingJSON');
    });

    it('LogIn - Wrong credentials', ()=>{
        let body = JSON.parse(JSON.stringify(credentials));
        body.password = "test123."
        cy.logInReq(body, true)
    })

    it('Get specific booking - Non Existant booking ID', () => {
        cy.logInReq(credentials, false)
          .then((authToken) => {
              let resType = 'json';
              let bookingId = 22222222224246;
              cy.getSpecificBooking(authToken, bookingId, resType, null, false, 404);
          });
    });
    
    it('Create new booking - Without name param', function(){
        cy.logInReq(credentials, false)
        .then((authToken) => {
            let reqType = 'json'
            let resType = 'json'
            let body = this.bookingJSON
            delete body['firstname']
            cy.createNewBooking(authToken, body, reqType, resType, 500)
        });
    })

    it('Update non existing booking', function () {
        cy.logInReq(credentials, false)
        .then((authToken) => {
            let reqType = 'json'
            let resType = 'json'
            let body = this.bookingJSON
            let bookingId = 123456789
            cy.updateBooking(bookingId, reqType, resType, body, 405)
        })
    })

    it('Delete non existing booking', function () {
        cy.logInReq(credentials, false)
        .then((authToken) => {
            let bookingId = 124236567658778
            cy.deleteBooking(bookingId, 405)
        })
    })
})