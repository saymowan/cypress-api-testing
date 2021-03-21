## 🚀 Cypress 4 test automation api 🚀

![Cypress 4 test automation api](https://github.com/saymowan/cypress-api-core/workflows/API%20Rest%20tests/badge.svg)
[![Code Quality](https://www.code-inspector.com/project/20271/score/svg)](https://frontend.code-inspector.com/project/20271/dashboard)
[![Badge ServeRest](https://img.shields.io/badge/API-ServeRest-green)](https://github.com/PauloGoncalvesBH/ServeRest/)
[![Cypress.io](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)](https://www.cypress.io/)

Projeto para estudo e definição de uma arquitetura base para testes automatizados de API Rest com [Cypress](https://www.cypress.io/).

### ✨ Instalação e uso da arquitetura
-----------------------
- Instale o [Node.js](https://nodejs.org/en/download/);
- Baixe este repositório ou faça um git clone;
- Abra o diretório do projeto e execute o comando:
    - `npm install`
- Para abrir a interface de execução do Cypress, execute no diretório do projeto:
    - `npx cypress open`
- Próximo passo é configurar/instalar a API ServeRest na sua máquina;


### ✨  Instalação API ServeRest
-----------------------
- A nossa API alvo deste projeto é a ServeRest localmente, para utiliza-la execute a aplicação [via npm](https://www.npmjs.com/package/serverest) ou [via Docker](https://hub.docker.com/r/paulogoncalvesbh/serverest/). 
- Para mais detalhes visite o [repositório oficial do ServeRest](https://github.com/ServeRest/ServeRest).

### ⚙️ Arquitetura do projeto
-----------------------


```
cypress4testautomationapi/
  ├─  cypress/
  │        │
  │        ├── fixtures/
  │        │   ├── *.json
  │        │   ├── *.csv       
  │        │   └── *.png
  │        │
  │        ├── integration/
  │        │   ├── <categoria>/
  │        │   │   └── <categoria>Tests.spec.js
  │        │   └── <categoria2>/
  │        │       └── <categoria2>Tests.spec.js
  │        │
  │        ├── plugins/
  │        │   └── index.js
  │        │
  │        ├── reports/
  │        │   └── mocha/
  │        │         └── mochafiles (*.json, *html)
  │        │
  │        ├── support/
  │        │   ├── databaseCommands.js
  │        │   ├── apiGeneralCommands.js
  │        │   ├── api<Categoria>Commands.js
  │        │   ├── api<Categoria2>Commands.js
  │        │   └── index.js
  │        │  
  │        └── videos/
  │ 
  ├── environmentsConfig/
  ├── node_modules/
  ├── cypress.json
  ├── package-lock.json
  ├── package.json
  └── README.md
```
---------------------------------------
## 🔍 Camadas da arquitetura

 - **fixtures:** arquivos para massa de dados estática para os testes (csv, png, xlsx, txt);
 - **integration:** arquivos de testes separados em categorias/módulos da API para facilitar a organização. Extensão *.spec.js;
 - **plugins:** plugins que são utilizados na solução ficam dentro do arquivo "plugins/index.js";
 -  **reports:** diretório com o relatório de execução dos testes usando Mocha Awesome;
 - **support:** camada com comandos Cypress customizados e sobrescritas globais:
    - Mapeamento das requisições (headers, requestservice, parametros [body, path, queryString]) para reuso em diferentes testes.
    - Arquivo para comandos de select/insert em banco de dados.
    - Arquivo index.js responsável de receber as importações dos comandos Cypress;
 - **videos:** geração opcional de videos das execução dos testes;
 - **environmentsConfig:** diretório com os arquivos de configuração por ambiente;
 - **node_modules:** arquivos ou diretórios que podem ser carregados pelo Node.js;
 - **cypress.json:** arquivo de configuração do Cypress;
 - **package-lock.json:** gerado automaticamente com as instalações e atualizações de pacotes;


### 💡 Features
-----------------------
<details><summary><i>Requests como commands</i></summary>
Cada endpoint é mapeado com a sua estrutura (headers, parâmetros, método, endpoint, cookies) no Cypress commands para focarmos em reuso. Os arquivos de mapeamento de requisições podem ser feitos por módulo/categoria.
Exemplo:

![Exemplo requisição](https://i.imgur.com/ctY5Zkv.png)

No exemplo vemos o mapeamento do endpoint Produtos para ser usado por todos os testes de API que desejam utiliza-lo.
Para criar um teste com esta requisição basta utilizar o command referente e passar o(s) parametro(s):

```js
    it('Produtos - Buscar Produto Inexistente', ()=>{
        cy.getProdutos('nome=9dj9128dh12h89')
            .then(response =>{
            expect(response.status).to.equal(200)
            expect(response.body.quantidade).to.equal(0)
        })
    })
```

</details>

<details><summary><i>Testes isolados e e2e</i></summary>
Testes de requisição de maneira isolada para validar parâmetros válidos, inválidos, status code estão presentes nesta arquitetura:

```js
    it('Produtos - Excluir Produto Inexistente',()=>{

        cy.deleteProdutos("xxx", true)
            .then(response =>{
                expect(response.status).to.equal(200)
                expect(response.body.message).to.eq("Nenhum registro excluído")
            })            
    })
```

Testes de múltiplas requisições (e2e) podem ser feitos com esta arquitetura, veja exemplo de um teste para Deletar um Produto (produto é criado durante o teste):

```js
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
```
</details>

<details><summary><i>Testes de exceção de status code (4xx e 5xx)</i></summary>

Para testes de exceção de status code (client side [4xx] or server side [5xx]) precisamos incluir um parâmetro [failOnStatusCode](https://docs.cypress.io/api/commands/request.html#Arguments) na requisição com valor false.

Vide exemplo de mapeamento de requisição:


Vide exemplo de teste "forçando" um erro para validar o statuscode e response body:

```js
    it('Produtos - Excluir Produto token expirado',()=>{
        localStorage.setItem('token', "token erradinho")

        cy.deleteProdutos("xxx", false)
            .then(response =>{
                expect(response.status).to.equal(401)
                expect(response.body.message).to.eq("Token de acesso ausente, inválido, expirado ou usuário do token não existe mais")
            })            
    })
```

</details>

<details><summary><i>Data Driven Testing</i></summary>

A arte de reaproveitar o mesmo teste com o mesmo fluxo e asserção variando somente a massa de teste proveniente de dados estáticos ou arquivos (*.csv, *.json, *.xlsx), chamamos de Data Driven Testing (leia mais sobre), na arquitetura temos o uso de um arquivo json (JArray) para a massa de testes:

```json
[
    {
        "nome": "Mouse Gamer Adamantiun Shinigami Usb",
        "preco": 98,
        "descricao": "Mouses para Jogos",
        "quantidade": 12
    },
    {
        "nome": "Monitor Gamer AOC Agon 32'' Curvo 165Hz",
        "preco": 269,
        "descricao": "Monitores Gamer",
        "quantidade": 45
    },
    {
        "nome": "Kit 3 Roteadores Gigabit Wifi TP-Link Rede Mesh AC1200",
        "preco": 189,
        "descricao": "Dispositivos de Conexão em Rede",
        "quantidade": 78
    }
]
```

O mesmo teste é criado N vezes através do arquivo json:

```js
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

        cy.postProdutos(produtoTestData)
            .then(response =>{
            expect(response.status).to.equal(expectedStatusCode)
            expect(response.body.message).to.equal(expectedSuccessMessage)            
            })
    })
})
```


</details>


- Mocha report customizado
- Chai: asserção status code e response body
- Orquestração
- Arquivo de configuração
- Variáveis globais por ambiente
- Mock de dados
- Geração e uso de token
- Parametros via Json, QueryString e Path
- Pipeline de teste via Github Actions

### 🆕 Novas features 
---------------------------
Para novas features [crie uma issue](https://github.com/saymowan/cypress-api-core/issues/new) ou verifique o [board do projeto](https://github.com/saymowan/cypress-api-core/projects/1).

### 🌟 Contribuições
--------------------------
Para novas contribuições, faça um fork do projeto, realize as alterações e submeta um Pull Request ou [crie uma issue](https://github.com/saymowan/cypress-api-core/issues/new) para ser avaliada;
