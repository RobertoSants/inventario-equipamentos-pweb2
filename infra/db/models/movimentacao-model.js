const { DataTypes } = require('sequelize');

function defineMovimentacaoModel(sequelize) {
    const Movimentacao = sequelize.define('Movimentacao', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        responsavel: {
            type: DataTypes.STRING,
            allowNull: false
        },
        data: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW // [NOTA] Pega a data/hora atual se eu não passar nada
        },
        // [RELACIONAMENTO] Chaves estrangeiras manuais para garantir a estrutura
        equipamentoId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        localId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: 'movimentacoes',
        timestamps: true
    });
    return Movimentacao;
}
module.exports = { defineMovimentacaoModel };