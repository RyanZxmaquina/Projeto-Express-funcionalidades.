// upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configuração do Multer para salvar os arquivos no diretório 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // O diretório onde os arquivos serão salvos
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Nome do arquivo no formato: timestamp.extensao
  },
});

const upload = multer({ storage });

// Rota para exibir a página de upload
router.get('/upload-page', (req, res) => {
  res.render('upload'); // Certifique-se de que existe um arquivo upload.ejs na pasta 'Consultas/views'
});

// Rota para lidar com o envio do arquivo
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Nenhum arquivo foi enviado.');
  }

  res.send('Arquivo enviado com sucesso.');
});

module.exports = router;
