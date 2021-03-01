/// <reference types="Cypress" />

const produtos = require('../../fixtures/Produtos/produtosList.json')
const faker = require('faker')

const produtosListJArray = 
describe ('POST_Criar_Produtos_DDT', ()=>{

    beforeEach(() => {
        cy.POST_generateTokenAdministrator()
    })

    //JArray (produtoList.json) com cada objeto a ser cadastrado
    produtos.forEach(produto => {
    it('Produtos - Cadastrar Produto DDT',()=>{

        let expectedStatusCode = 201;
        let expectedSuccessMessage = "Cadastro realizado com sucesso";

        const produtoTestData ={
            "nome": produto.nome + "-" + faker.random.number(),
            "preco": produto.preco,
            "descricao": produto.descricao,
            "quantidade": produto.quantidade
          }

        cy.POST_CadastrarProduto(produtoTestData)
            .then(response =>{
            expect(response.status).to.equal(expectedStatusCode)
            expect(response.body.message).to.equal(expectedSuccessMessage)            
            })
    })
})



})