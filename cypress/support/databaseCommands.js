/// <reference types="Cypress" />

Cypress.Commands.add('createProject', () => {
  const dbName = 'bugtracker'
  const query = 'INSERT INTO mantis_project_table (NAME,STATUS,ENABLED,view_state,access_min,description,category_id,inherit_global) VALUES ("Base10",30,1,10,10,"teste2",1,1)'
  cy.task('queryDatabase', { dbName, query }).as('Create Project')
})