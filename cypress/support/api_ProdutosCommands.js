/// <reference types="Cypress" />

Cypress.Commands.add('GET_BuscarProdutos', queryString =>{
    cy.request({
        method: 'GET',
        url: '/produtos?'+ queryString})
})

Cypress.Commands.add('GET_BuscarTodosProdutos', () =>{
    cy.request({
        method: 'GET',
        url: '/produtos'})
})

Cypress.Commands.add('POST_CadastrarProduto', bodyJson =>{
    cy.request({
        method: 'POST',
        url: '/produtos',
        body: bodyJson,
        headers: {  Authorization : localStorage.getItem('token') }})
})

Cypress.Commands.add('DELETE_DeletarProduto', (productId, failStatusCode) =>{
    cy.request({
        method: 'DELETE',
        url: '/produtos/'+productId,
        headers: {  Authorization : localStorage.getItem('token') },
        failOnStatusCode: failStatusCode
    })
})