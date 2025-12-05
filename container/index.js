// [ALTERADO] container/index.js
// Arquivo de Injeção de Dependências (Service Locator).
// Aqui eu instancio o banco, os models e agora os services/repositories.

const { createSequelizeInstance } = require('../infra/db/sequelize');

// Importando os Models (com nomes em minúsculo - boas práticas)
const { defineEquipamentoModel } = require('../infra/db/models/equipamento-model');
const { defineLocalModel } = require('../infra/db/models/local-model');
const { defineMovimentacaoModel } = require('../infra/db/models/movimentacao-model');

// [NOVO] Importando o Repositório e Service de Locais que acabei de criar
const LocalRepository = require('../infra/repositories/local-repository');
const LocalService = require('../application/services/local-service');

// 1. Cria a conexão com o banco SQLite
const sequelize = createSequelizeInstance();

// 2. Define os modelos (cria a estrutura na memória)
const Equipamento = defineEquipamentoModel(sequelize);
const Local = defineLocalModel(sequelize);
const Movimentacao = defineMovimentacaoModel(sequelize);

// 3. Define as Associações (Foreign Keys)
Equipamento.hasMany(Movimentacao, { foreignKey: 'equipamentoId' });
Movimentacao.belongsTo(Equipamento, { foreignKey: 'equipamentoId' });

Local.hasMany(Movimentacao, { foreignKey: 'localId' });
Movimentacao.belongsTo(Local, { foreignKey: 'localId' });

// 4. Sincroniza com o banco (cria tabelas se não existirem)
sequelize.sync()
    .then(() => console.log('[BANCO] Sincronizado com sucesso!'))
    .catch((error) => console.error('[ERRO] Falha no banco:', error));

// [NOVO] Instanciando as camadas de Local (Injeção de Dependência)
// Primeiro crio o repositório passando o Model
const localRepository = new LocalRepository(Local);
// Depois crio o service passando o Repositório
const localService = new LocalService(localRepository);

// Exporta tudo para o resto do sistema usar
module.exports = {
    sequelize,
    Equipamento,
    Local,
    Movimentacao,
    localService // [NOVO] Exportando o serviço para usar no Controller depois
};