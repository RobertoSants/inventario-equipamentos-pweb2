// Arquivo principal que liga o servidor
const express = require('express');
const path = require('path');

// [NOVO] Importando o container para garantir que o banco e os models sejam carregados
// Isso faz o código do container/index.js rodar e criar as tabelas no banco
const container = require('./container');

// [NOVO] Importando as rotas (Locais, Equipamentos, Movimentações)
const localRoutes = require('./routes/local-routes');
const equipamentoRoutes = require('./routes/equipamento-routes');
const movimentacaoRoutes = require('./routes/movimentacao-routes'); // [NOVO]

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

// [ROTA TEMPORÁRIA] Só pra testar se o servidor subiu
// [ALTERADO] Menu completo de navegação
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; padding: 20px;">
            <h1>Inventário de Equipamentos - IFAL</h1>
            <p>Sistema online.</p>
            <ul>
                <li><a href="/locais">Gerenciar Locais</a></li>
                <li><a href="/equipamentos">Gerenciar Equipamentos</a></li>
                <li><a href="/movimentacoes">Movimentações (Histórico)</a></li>
            </ul>
        </div>
    `);
});

// [NOVO] Registrando as rotas
app.use('/locais', localRoutes);
app.use('/equipamentos', equipamentoRoutes);
app.use('/movimentacoes', movimentacaoRoutes); // [NOVO]

// Fazendo o servidor rodar
app.listen(port, () => {
    console.log(`Show! Servidor rodando em http://localhost:${port}`);
});