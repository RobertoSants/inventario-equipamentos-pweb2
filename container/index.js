// [ALTERADO] container/index.js
// Arquivo de Injeção de Dependências. Liga Models, Repositories e Services.

const { createSequelizeInstance } = require('../infra/db/sequelize');

// Importando os Models
const { defineEquipamentoModel } = require('../infra/db/models/equipamento-model');
const { defineLocalModel } = require('../infra/db/models/local-model');
const { defineMovimentacaoModel } = require('../infra/db/models/movimentacao-model');

// Importando Repositórios e Services de LOCAIS (já existiam)
const LocalRepository = require('../infra/repositories/local-repository');
const LocalService = require('../application/services/local-service');

// [NOVO] Importando Repositórios e Services de EQUIPAMENTOS
const EquipamentoRepository = require('../infra/repositories/equipamento-repository');
const EquipamentoService = require('../application/services/equipamento-service');

// 1. Cria conexão com o banco
const sequelize = createSequelizeInstance();

// 2. Define os modelos
const Equipamento = defineEquipamentoModel(sequelize);
const Local = defineLocalModel(sequelize);
const Movimentacao = defineMovimentacaoModel(sequelize);

// 3. Define Associações
Equipamento.hasMany(Movimentacao, { foreignKey: 'equipamentoId' });
Movimentacao.belongsTo(Equipamento, { foreignKey: 'equipamentoId' });

Local.hasMany(Movimentacao, { foreignKey: 'localId' });
Movimentacao.belongsTo(Local, { foreignKey: 'localId' });

// 4. Sincroniza Banco
sequelize.sync()
    .then(() => console.log('[BANCO] Sincronizado com sucesso!'))
    .catch((error) => console.error('[ERRO] Falha no banco:', error));

// 5. Instanciando as camadas (Injeção de Dependência)

// Locais
const localRepository = new LocalRepository(Local);
const localService = new LocalService(localRepository);

// [NOVO] Equipamentos
const equipamentoRepository = new EquipamentoRepository(Equipamento);
const equipamentoService = new EquipamentoService(equipamentoRepository);

// Exporta tudo
module.exports = {
    sequelize,
    Equipamento,
    Local,
    Movimentacao,
    localService,
    equipamentoService // [NOVO] Exportando para usar no Controller
};