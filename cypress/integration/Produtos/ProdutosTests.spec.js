/// <reference types="Cypress" />

const faker = require('faker')


describe ('GET_Buscar_Produtos', ()=>{

    it('Produtos - Buscar todos os Produtos', ()=>{
        cy.GET_BuscarTodosProdutos()
            .then(response =>{
            expect(response.status).to.equal(200)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Produtos - Buscar Produto Inexistente', ()=>{
        cy.GET_BuscarProdutos('nome=9dj9128dh12h89')
            .then(response =>{
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
            //expect(response.body.produtos).to.equal(empty)
            cy.log(JSON.stringify(response.body))
        })
    })

    it('Produtos - Buscar Produto Existente', ()=>{
        let nomeProduto = 'Logitech MX Vertical'
        cy.fixture('Produtos/produtoExistente').then((expectedBody) => {
            cy.GET_BuscarProdutos('nome='+nomeProduto)
                .then(response =>{
                cy.log(JSON.stringify(response.body))
                expect(response.status).to.equal(200)
                expect(response.body.produtos[0].nome).to.equal(nomeProduto)
                expect(response.body).to.deep.eq(expectedBody)

            })
        })
})


})


describe ('POST_Criar_Produtos', ()=>{

    beforeEach(() => {
        cy.POST_generateTokenAdministrator()
    })


    it('Produtos - Cadastrar Produto',()=>{

        const produto ={
            "nome": faker.random.uuid(),
            "preco": faker.random.number(),
            "descricao": "Mouse bom",
            "quantidade": "5"
          }

        cy.POST_CadastrarProduto(produto)
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

        cy.POST_CadastrarProduto(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.GET_BuscarProdutos('_id='+_id)
                    .then(response =>{
                        expect(response.status).to.equal(200)
                        expect(response.body.produtos[0].nome).to.eq(produto.nome)
                    })              
        })
    })
})


describe ('DELETE_Deletar_Produtos', ()=>{

    beforeEach(() => {
        cy.POST_generateTokenAdministrator()
    })
    
    it('Produtos - Excluir Produto Existente',()=>{

        const produto ={
            nome: faker.random.uuid(),
            preco: faker.random.number(),
            descricao: "Mouse bom",
            quantidade: "5"
            }

        cy.POST_CadastrarProduto(produto)
            .then(response =>{
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal("Cadastro realizado com sucesso")
            let _id = response.body._id

                cy.DELETE_DeletarProduto(_id, true)
                    .then(response =>{
                        expect(response.status).to.equal(200)
                        expect(response.body.message).to.eq("Registro excluído com sucesso")
                    })   

                    cy.GET_BuscarProdutos('_id='+_id)
                    .then(response =>{
                        expect(response.status).to.equal(200)
                        expect(response.body.quantidade).to.equal(0)
                    })              
                })
        })



    it('Produtos - Excluir Produto Inexistente',()=>{

        cy.DELETE_DeletarProduto("xxx", true)
            .then(response =>{
                expect(response.status).to.equal(200)
                expect(response.body.message).to.eq("Nenhum registro excluído")
            })            
    })


    it('Produtos - Excluir Produto token expirado',()=>{
        localStorage.setItem('token', "token erradinho")

        cy.DELETE_DeletarProduto("xxx", false)
            .then(response =>{
                expect(response.status).to.equal(401)
                expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
            })            
    })

    it.skip('Produtos - Excluir Produto Usuário Sem Permissão',()=>{
       //Preparar a massa de teste (usuário adm e usuário sem adm)         
    })


}) //describe 
            



 

