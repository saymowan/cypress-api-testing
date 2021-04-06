/// <reference types="Cypress" />

Cypress.Commands.add('getProducts', queryString =>{
    cy.api({
        method: 'GET',
        url: '/produtos?'+ queryString})
})

Cypress.Commands.add('getAllProducts', () =>{
    cy.api({
        method: 'GET',
        url: '/produtos'})
})

Cypress.Commands.add('postProduct', jsonBody =>{
    cy.api({
        method: 'POST',
        url: '/produtos',
        body: jsonBody,
        headers: {  Authorization : localStorage.getItem('token') }})
})

Cypress.Commands.add('deleteProduct', (productId, failStatusCode) =>{
    cy.api({
        method: 'DELETE',
        url: '/produtos/'+productId,
        headers: {  Authorization : localStorage.getItem('token') },
        failOnStatusCode: failStatusCode
    })
})