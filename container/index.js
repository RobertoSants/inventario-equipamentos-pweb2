// [NOVO] container/index.js
// Esse arquivo funciona como um "Service Locator" simples, conforme o guia.
// Ele inicializa o banco e os modelos uma única vez.

const { createSequelizeInstance } = require('../infra/db/sequelize');
const { defineEquipamentoModel } = require('../infra/db/models/EquipamentoModel');
const { defineLocalModel } = require('../infra/db/models/LocalModel');
const { defineMovimentacaoModel } = require('../infra/db/models/MovimentacaoModel');

// 1. Cria a conexão
const sequelize = createSequelizeInstance();

// 2. Define os modelos (cria a estrutura na memória do Sequelize)
const Equipamento = defineEquipamentoModel(sequelize);
const Local = defineLocalModel(sequelize);
const Movimentacao = defineMovimentacaoModel(sequelize);

// 3. Define os relacionamentos (Associações)
// Um equipamento tem muitas movimentações
Equipamento.hasMany(Movimentacao, { foreignKey: 'equipamentoId' });
Movimentacao.belongsTo(Equipamento, { foreignKey: 'equipamentoId' });

// Um local tem muitas movimentações
Local.hasMany(Movimentacao, { foreignKey: 'localId' });
Movimentacao.belongsTo(Local, { foreignKey: 'localId' });

// 4. Sincroniza com o banco de dados (Cria as tabelas se não existirem)
sequelize.sync()
    .then(() => {
        console.log('[BANCO] Sincronizado com sucesso! Tabelas criadas.');
    })
    .catch((error) => {
        console.error('[ERRO] Falha ao sincronizar banco:', error);
    });

// Exporta tudo para ser usado nos Controllers e Services
module.exports = {
    sequelize,
    Equipamento,
    Local,
    Movimentacao
};