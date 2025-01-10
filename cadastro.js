const express = require('express');
const router = express.Router();
const dbUsers = require('./app').dbUsers;
const bodyParser = require('body-parser');

// Configurar body-parser para processar os dados do formulário
router.use(bodyParser.urlencoded({ extended: true }));

// Rota para exibir a página de cadastro
router.get('/', (req, res) => {
  res.render('cadastro'); // Certifique-se de que existe um arquivo cadastro.ejs na pasta 'Consultas/views'
});

router.get('/log-in', (req, res) => {
    res.render('login');
});

// Rota para processar o cadastro
router.post('/cadastrar', (req, res) => {
  const { name, email, cpf, senha } = req.body;
  const sql = 'INSERT INTO users (name, email, cpf, senha) VALUES (?, ?, ?, ?)';
  const values = [name, email, cpf, senha];

  dbUsers.query(sql, values, (err) => {
    if (err) {
      console.error('Erro ao cadastrar o usuário:', err);
      return res.status(500).send('Erro interno do servidor');
    }

    res.redirect('/home'); // Redirecionar para a página home após o cadastro
  });
});

router.post('/log-in', (req, res) => { 
    const { email, senha } = req.body; 
    const sql = 'SELECT * FROM users WHERE email = ? AND senha = ?'; 
    const values = [email, senha]; 
    dbUsers.query(sql, values, (err, results) => { 
      if (err) { 
        console.error('Erro ao fazer login:', err); 
        return res.status(500).send('Erro interno do servidor'); 
      } 
      if (results.length > 0) { 
        res.redirect('/user'); // Redirecionar para a página do usuário após login bem-sucedido 
      } else { 
        res.status(401).send('Credenciais inválidas'); // Exibir mensagem de erro para credenciais inválidas 
      } 
    }); 
  }); 
  module.exports = router;
  