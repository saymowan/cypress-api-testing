/// <reference types="Cypress" />


Cypress.Commands.add('POST_generateTokenAdministrator', () =>{
    cy.api({
        method: 'POST',
        url: '/login',
        body: {
            "email": "fulano@qa.com",
            "password": "teste"
          }
    })
    .then(response =>{
        expect(response.status).to.eql(200)
        localStorage.setItem('token', response.body.authorization)
        expect(localStorage.getItem('token')).not.null
        cy.log(localStorage.getItem('token'))
    })      
})