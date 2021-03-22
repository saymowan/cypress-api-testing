/// <reference types="Cypress" />

Cypress.Commands.add('createProject', () => {
  const dbName = 'dbName'
  const query = 'query'
  cy.task('queryDatabase', { dbName, query }).as('Foo Bar')
})