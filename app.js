const express = require('express');
const mysql = require('mysql2');
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Configurando o body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// Conexão com a database principal
const dbConsultas = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: '1421',
    database: 'meu_banco_de_dados'
});

// Conectar ao banco de dados principal
dbConsultas.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados principal:', err);
    return;
  }
  console.log('Conectado ao banco de dados principal MySQL');
});

// Conexão com a database de usuários
const dbUsers = mysql.createConnection({
    host: 'localhost',
    user: 'phpmyadmin',
    password: '1421',
    database: 'users'
});

// Conectar ao banco de dados de usuários
dbUsers.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados de usuários:', err);
    return;
  }
  console.log('Conectado ao banco de dados de usuários MySQL');
});

// Configurando o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

// Configurando o diretório das views
app.set('views', path.join(__dirname, 'Consultas/views'));

// Servindo arquivos estáticos da pasta 'Consultas/public'
app.use(express.static('Consultas/public'));

// Exportando o app e as conexões com os bancos de dados
module.exports = { app, dbConsultas, dbUsers, moment };
