// Arquivo principal que liga o servidor
const express = require('express');
const path = require('path');

// [NOVO] Importando o container para garantir que o banco e os models sejam carregados
// Isso faz o código do container/index.js rodar e criar as tabelas no banco
const container = require('./container');

// [NOVO] Importando as rotas (Locais, Equipamentos, Movimentações)
const localRoutes = require('./routes/local-routes');
const equipamentoRoutes = require('./routes/equipamento-routes');
const movimentacaoRoutes = require('./routes/movimentacao-routes');

// Inicializando o app express
const app = express();

// Porta do servidor (3000 ou a que o sistema mandar)
const port = process.env.PORT || 3000;

// [CONFIGURAÇÃO] Configurando o EJS como motor de visualização (View)
// O professor pediu para usar EJS para renderizar as páginas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// [CONFIGURAÇÃO] Pasta pública para arquivos estáticos (CSS, imagens, etc)
app.use(express.static(path.join(__dirname, 'public')));

// [MIDDLEWARE] Configuração para pegar dados de formulários (POST)
// Sem isso o req.body vem vazio
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// [ROTA PRINCIPAL] 
// [ALTERADO] Agora renderizamos a view 'index.ejs' em vez de mandar HTML cru
// Isso segue melhor o padrão MVC (View separada da lógica)
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Inventário de Equipamentos - IFAL' 
    });
});

// [NOVO] Registrando as rotas
app.use('/locais', localRoutes);
app.use('/equipamentos', equipamentoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

// Fazendo o servidor rodar
app.listen(port, () => {
    console.log(`Show! Servidor rodando em http://localhost:${port}`);
});