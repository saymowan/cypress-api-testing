/// <reference types="Cypress" />

const productsJArrayList = require('../../fixtures/Produtos/produtosList.json')
const faker = require('faker')

describe ('Products using Data Driven File', ()=>{

    beforeEach(() => {
        cy.generateTokenAsAdmin()
    })

    //JArray (produtosList.json) with each product to be created
    productsJArrayList.forEach(product => {
    it.only('Products - Should create products using Data Driven file',()=>{

        let expectedStatusCode = 201;
        let expectedSuccessMessage = "Cadastro realizado com sucesso";

        const productTestData ={
            "nome": product.nome + "-" + faker.random.number(),
            "preco": product.preco,
            "descricao": product.descricao,
            "quantidade": product.quantidade
          }

        cy.postProduct(productTestData)
            .then(response =>{
            expect(response.status).to.equal(expectedStatusCode)
            expect(response.body.message).to.equal(expectedSuccessMessage)            
            })
    })
})



})