/// <reference types="cypress" />

 const mysql = require('mysql')
 // Dados da conexão
 const connections = {
   bugtracker: {
     host: 'localhost',
     user: 'root',
     password: 'root',
     database: 'bugtracker'
   }
 }
 function queryDB (connectionInfo, query) {
   const connection = mysql.createConnection(connectionInfo)
 
   connection.connect()
 
   return new Promise((resolve, reject) => {
     connection.query(query, (error, results) => {
       if (error) {
         return reject(error)
       }
 
       connection.end()
 
       return resolve(results)
     })
   })
 }
 module.exports = (on, config) => {
   on('task', {
     // destructure the argument into the individual fields
     queryDatabase ({ dbName, query }) {
       const connectionInfo = connections[dbName]
 
       if (!connectionInfo) {
         throw new Error(`Do not have DB connection under name ${dbName}`)
       }
       return queryDB(connectionInfo, query)
 
     },
   })
   //Environments config
   const fs = require('fs-extra')
   const path = require('path')
   function getConfigurationByFile (file) {
     // caminho da pasta onde estão presentes os arquivos JSON dos ambientes
     const pathToConfigFile = path.resolve('environmentsConfig', `${file}.json`)
   
     return fs.readJson(pathToConfigFile)
   }
   const file = config.env.configFile || 'ExampleQa'
   return getConfigurationByFile(file)
 }