const express = require('express');
const { app, dbConsultas, moment } = require('./app');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const nodemailer = require('nodemailer');
const port = 3002;

const cadastroRoutes = require('./cadastro');
const uploadRoutes = require('./upload');

// Usar as rotas de cadastro e upload
app.use('/', cadastroRoutes);
app.use('/', uploadRoutes);

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'gutsn6357@gmail.com',
      pass: 'oxmn qhbt yjst uomq'
  }
});

// Rota para exibir a página inicial (home.ejs)
app.get('/home', (req, res) => {
  res.render('home');  // Renderiza home.ejs
});

// Outras rotas existentes
app.get('/logout', (req, res) => {
  res.redirect('/');
});

app.get('/servicos', (req, res) => {
  const servicos = [
      { nome: 'Consulta Médica', descricao: 'Serviço de consulta médica geral' },
      { nome: 'Exames Laboratoriais', descricao: 'Serviço de exames laboratoriais completos' }
  ];
  res.render('servicos', { servicos: servicos });
});

app.get('/planos', (req, res) => {
  const planos = [
      { nome: 'Plano Básico', descricao: 'Acesso a consultas médicas básicas' },
      { nome: 'Plano Premium', descricao: 'Acesso a consultas e exames completos' }
  ];
  res.render('planos', { planos: planos });
});

app.get('/consultas', (req, res) => {
  dbConsultas.query('SELECT * FROM consultas', (err, results) => {
    if (err) {
      console.error('Erro ao executar a consulta:', err);
      return res.status(500).send('Erro interno do servidor');
    }

    const consultasFormatadas = results.map((consulta) => ({
      id: consulta.id,
      dia: moment(consulta.dia).format('YYYY-MM-DD'),
      horario: consulta.horario,
    }));

    res.render('index', { consultas: consultasFormatadas });
  });
});

app.get('/user', (req, res) => {
  res.render('user');
});

app.get('/contato', (req, res) => {
  res.render('contato');
});

// Processar o formulário de contato e enviar e-mail
app.post('/envia-contato', (req, res) => {
  const { nome, email, mensagem } = req.body;

  const mailOptions = {
      from: 'gutsn6357@gmail.com',
      to: 'rrfundation@gmail.com',
      subject: 'Novo Contato Recebido',
      text: `Nome: ${nome}\nEmail: ${email}\nMensagem: ${mensagem}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error('Erro ao enviar e-mail:', error);
          return res.status(500).send('Erro ao enviar e-mail');
      }
      console.log('E-mail enviado:', info.response);
      res.send('Contato enviado com sucesso!');
  });
});

app.get('/chat', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.post('/nova-consulta', (req, res) => {
  const { dia, horario } = req.body;
  const sql = 'INSERT INTO consultas (dia, horario) VALUES (?, ?)';
  const values = [dia, horario];

  dbConsultas.query(sql, values, (err) => {
    if (err) {
      console.error('Erro ao agendar a consulta:', err);
      return res.status(500).send('Erro interno do servidor');
    }

    res.redirect('/consultas');
  });
});

app.post('/cancelar-consulta', (req, res) => {
  const consultaId = req.body.consultaId;
  const sql = 'DELETE FROM consultas WHERE id = ?';
  const values = [consultaId];

  dbConsultas.query(sql, values, (err) => {
    if (err) {
      console.error('Erro ao cancelar a consulta:', err);
      return res.status(500).send('Erro interno do servidor');
    }

    res.redirect('/consultas');
  });
});

// Configurar Socket.IO
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
  console.log('Novo cliente conectado');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

// Servindo arquivos estáticos da aplicação Angular compilada
app.use(express.static(path.join(__dirname, 'my-angular-app/dist/my-angular-app/browser')));

// Rota para redirecionar todas as requisições de erro ao Angular
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'my-angular-app/dist/my-angular-app/browser/index.html'));
});

// Iniciando o servidor na porta especificada
server.listen(port, () => {
  console.log(`Servidor está rodando em http://localhost:${port}`);
});
