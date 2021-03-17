/// <reference types="Cypress" />

Cypress.Commands.add('getProdutos', queryString =>{
    cy.api({
        method: 'GET',
        url: '/produtos?'+ queryString})
})

Cypress.Commands.add('getTodosOsProdutos', () =>{
    cy.api({
        method: 'GET',
        url: '/produtos'})
})

Cypress.Commands.add('postProdutos', bodyJson =>{
    cy.api({
        method: 'POST',
        url: '/produtos',
        body: bodyJson,
        headers: {  Authorization : localStorage.getItem('token') }})
})

Cypress.Commands.add('deleteProdutos', (productId, failStatusCode) =>{
    cy.api({
        method: 'DELETE',
        url: '/produtos/'+productId,
        headers: {  Authorization : localStorage.getItem('token') },
        failOnStatusCode: failStatusCode
    })
})