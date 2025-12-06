const { DataTypes } = require('sequelize');

function defineEquipamentoModel(sequelize) {
    const Equipamento = sequelize.define('Equipamento', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        patrimonio: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true // [REGRA] Validação de duplicidade no patrimônio
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'ok',
            // [REGRA] Estado deve ser um desses três. O banco vai reclamar se for diferente.
            validate: {
                isIn: [['ok', 'manutenção', 'baixado']]
            }
        }
    }, {
        tableName: 'equipamentos',
        timestamps: true // Cria createdAt e updatedAt automaticamente
    });
    return Equipamento;
}
module.exports = { defineEquipamentoModel };