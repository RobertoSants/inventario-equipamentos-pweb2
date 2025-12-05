// [NOVO] app.js - Arquivo principal que liga o servidor
const express = require('express');
const path = require('path');

// [NOVO] Importando o container para garantir que o banco e os models sejam carregados
// Isso faz o código do container/index.js rodar e criar as tabelas no banco
const container = require('./container');

// [NOVO] Importando as rotas de Locais que acabamos de criar
const localRoutes = require('./routes/local-routes');

// Inicializando o app express
const app = express();

// Porta do servidor (3000 ou a que o sistema mandar)
const port = process.env.PORT || 3000;

// [CONFIGURAÇÃO] Configurando o EJS como motor de visualização (View)
// EJS para renderizar as páginas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// [CONFIGURAÇÃO] Pasta pública para arquivos estáticos (CSS, imagens, etc)
app.use(express.static(path.join(__dirname, 'public')));

// [MIDDLEWARE] Configuração para pegar dados de formulários (POST)
// Sem isso o req.body vem vazio
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// [ROTA TEMPORÁRIA] Só pra testar se o servidor subiu
// [ALTERADO] Adicionei um link direto para facilitar a navegação nos testes
app.get('/', (req, res) => {
    res.send('<h1>Inventário de Equipamentos - IFAL</h1><p>O servidor está on!</p><p><a href="/locais">Gerenciar Locais</a></p>');
});

// [NOVO] Registrando a rota de locais
// Tudo que vier na URL começando com /locais vai ser tratado pelo localRoutes
app.use('/locais', localRoutes);

// Fazendo o servidor rodar
app.listen(port, () => {
    console.log(`Show! Servidor rodando em http://localhost:${port}`);
});