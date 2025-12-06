// Arquivo principal que liga o servidor
const express = require('express');
const path = require('path');

// Importando o container para garantir que o banco e os models sejam carregados
const container = require('./container');

// Importando as rotas (Locais, Equipamentos, Movimentações)
const localRoutes = require('./routes/local-routes');
const equipamentoRoutes = require('./routes/equipamento-routes');
const movimentacaoRoutes = require('./routes/movimentacao-routes');

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// [ROTA PRINCIPAL] Renderiza o dashboard
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Inventário de Equipamentos - IFAL' 
    });
});

// [NOVO] Registrando as rotas
app.use('/locais', localRoutes);
app.use('/equipamentos', equipamentoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);

// [ALTERADO] Lógica de inicialização para permitir testes
// Se este arquivo for executado diretamente (node app.js), ele liga o servidor.
// Se ele for importado por um teste, ele NÃO liga (quem liga é o teste).
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

// [NOVO] Exporto o app para que o Supertest consiga usá-lo
module.exports = app;