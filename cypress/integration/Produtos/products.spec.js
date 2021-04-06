/// <reference types="Cypress" />

const faker = require('faker')


describe ('Get Products', ()=>{

    it('Products - Should get all products', ()=>{
        cy.getAllProducts()
            .then(response =>{
            expect(response.status).to.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Products - Should doesnt return product', ()=>{
        cy.getProducts('nome=9dj9128dh12h89')
            .then(response =>{
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
        })
    })

    it('Products - Should return product info', ()=>{
        let nomeProduto = 'Logitech MX Vertical'
        cy.fixture('Produtos/produtoExistente').then((expectedBody) => {
            cy.getProducts('nome='+nomeProduto)
                .then(response =>{
                cy.log(JSON.stringify(response.body))
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0].nome).to.equal(nomeProduto)
                expect(response.body).to.deep.eq(expectedBody)

            })
        })
    })


})


describe ('Create Products', ()=>{

    beforeEach(() => {
        cy.generateTokenAsAdmin()
    })


    it('Products - Should create a new product',()=>{

        const produto ={
            "nome": faker.random.uuid(),
            "preco": faker.random.number(),
            "descricao": "Mouse bom",
            "quantidade": "5"
          }

        cy.postProduct(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")            
        })
    })

    it('Products - Should create and get a new product',()=>{

        const produto ={
            "nome": faker.random.uuid(),
            "preco": faker.random.number(),
            "descricao": "Mouse bom",
            "quantidade": "5"
          }

        cy.postProduct(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.getProducts('_id='+_id)
                    .then(response =>{
                        expect(response.status).to.equal(200)
                        expect(response.body.produtos[0].nome).to.eq(produto.nome)
                    })              
        })
    })
})


describe ('Delete Products', ()=>{

    beforeEach(() => {
        cy.generateTokenAsAdmin()
    })
    
    it('Products - Should delete a new product',()=>{

        const produto ={
            nome: faker.random.uuid(),
            preco: faker.random.number(),
            descricao: "Mouse bom",
            quantidade: "5"
            }

        cy.postProduct(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.deleteProduct(_id, true)
                    .then(respDelete =>{
                        expect(respDelete.status).to.equal(200)
                        expect(respDelete.body.message).to.eq("Registro excluído com sucesso")
                    })   

                    cy.getProducts('_id='+_id)
                    .then(respGet =>{
                        expect(respGet.status).to.equal(200)
                        expect(respGet.body.quantidade).to.equal(0)
                    })              
                })
        })



    it('Products - Should delete invalid product',()=>{

        cy.deleteProduct("xxx", true)
            .then(response =>{
                expect(response.status).to.equal(200)
                expect(response.body.message).to.eq("Nenhum registro excluído")
            })            
    })


    it('Products - Should delete product with expired token',()=>{
        localStorage.setItem('token', "token erradinho")

        cy.deleteProduct("xxx", false)
            .then(response =>{
                expect(response.status).to.equal(401)
                expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
            })            
    })

    it.skip('Produtos - Excluir Produto Usuário Sem Permissão',()=>{
       //Preparar a massa de teste (usuário adm e usuário sem adm)         
    })


}) //describe 
            



 

