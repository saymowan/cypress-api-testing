/// <reference types="Cypress" />

const faker = require('faker')


describe ('Buscar Produtos', ()=>{

    it('Produtos - Buscar todos os Produtos', ()=>{
        cy.getTodosOsProdutos()
            .then(response =>{
            expect(response.status).to.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Produtos - Buscar Produto Inexistente', ()=>{
        cy.getProdutos('nome=9dj9128dh12h89')
            .then(response =>{
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
        })
    })

    it('Produtos - Buscar Produto Existente', ()=>{
        let nomeProduto = 'Logitech MX Vertical'
        cy.fixture('Produtos/produtoExistente').then((expectedBody) => {
            cy.getProdutos('nome='+nomeProduto)
                .then(response =>{
                cy.log(JSON.stringify(response.body))
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0].nome).to.equal(nomeProduto)
                expect(response.body).to.deep.eq(expectedBody)

            })
        })
    })


})


describe ('Criar Produtos', ()=>{

    beforeEach(() => {
        cy.generateTokenAsAdmin()
    })


    it('Produtos - Cadastrar Produto',()=>{

        const produto ={
            "nome": faker.random.uuid(),
            "preco": faker.random.number(),
            "descricao": "Mouse bom",
            "quantidade": "5"
          }

        cy.postProdutos(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")            
        })
    })

    it('Produtos - Cadastrar e Listar Produto',()=>{

        const produto ={
            "nome": faker.random.uuid(),
            "preco": faker.random.number(),
            "descricao": "Mouse bom",
            "quantidade": "5"
          }

        cy.postProdutos(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.getProdutos('_id='+_id)
                    .then(response =>{
                        expect(response.status).to.equal(200)
                        expect(response.body.produtos[0].nome).to.eq(produto.nome)
                    })              
        })
    })
})


describe ('Deletar Produtos', ()=>{

    beforeEach(() => {
        cy.generateTokenAsAdmin()
    })
    
    it('Produtos - Excluir Produto Existente',()=>{

        const produto ={
            nome: faker.random.uuid(),
            preco: faker.random.number(),
            descricao: "Mouse bom",
            quantidade: "5"
            }

        cy.postProdutos(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.deleteProdutos(_id, true)
                    .then(respDelete =>{
                        expect(respDelete.status).to.equal(200)
                        expect(respDelete.body.message).to.eq("Registro excluído com sucesso")
                    })   

                    cy.getProdutos('_id='+_id)
                    .then(respGet =>{
                        expect(respGet.status).to.equal(200)
                        expect(respGet.body.quantidade).to.equal(0)
                    })              
                })
        })



    it('Produtos - Excluir Produto Inexistente',()=>{

        cy.deleteProdutos("xxx", true)
            .then(response =>{
                expect(response.status).to.equal(200)
                expect(response.body.message).to.eq("Nenhum registro excluído")
            })            
    })


    it('Produtos - Excluir Produto token expirado',()=>{
        localStorage.setItem('token', "token erradinho")

        cy.deleteProdutos("xxx", false)
            .then(response =>{
                expect(response.status).to.equal(401)
                expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
            })            
    })

    it.skip('Produtos - Excluir Produto Usuário Sem Permissão',()=>{
       //Preparar a massa de teste (usuário adm e usuário sem adm)         
    })


}) //describe 
            



 

