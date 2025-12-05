// [NOVO] infra/db/models/LocalModel.js
const { DataTypes } = require('sequelize');

function defineLocalModel(sequelize) {
    const Local = sequelize.define('Local', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING, // Ex: "Laboratório 1"
            allowNull: false
        },
        bloco: {
            type: DataTypes.STRING, // Ex: "Bloco A"
            allowNull: false
        },
        sala: {
            type: DataTypes.STRING, // Ex: "101"
            allowNull: false
        }
    }, {
        tableName: 'locais',
        timestamps: true
    });

    return Local;
}

module.exports = { defineLocalModel };