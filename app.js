// [NOVO] app.js - Arquivo principal que liga o servidor
const express = require('express');
const path = require('path');
// [ALTERADO] Importando o container para garantir que o banco seja criado ao iniciar
const container = require('./container');

// Inicializando o app express
const app = express();

// Porta do servidor (3000 ou a que o sistema mandar)
const port = process.env.PORT || 3000;

// [CONFIGURAÇÃO] Configurando o EJS como motor de visualização (View)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// [CONFIGURAÇÃO] Pasta pública para arquivos estáticos (CSS, imagens, etc)
app.use(express.static(path.join(__dirname, 'public')));

// [MIDDLEWARE] Configuração para pegar dados de formulários (POST)
// Sem isso o req.body vem vazio
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// [ROTA TEMPORÁRIA] Só pra testar se o servidor subiu
app.get('/', (req, res) => {
    res.send('<h1>Inventário de Equipamentos - IFAL</h1><p>O servidor está on!</p>');
});

// Fazendo o servidor rodar
app.listen(port, () => {
    console.log(`Show! Servidor rodando em http://localhost:${port}`);
});