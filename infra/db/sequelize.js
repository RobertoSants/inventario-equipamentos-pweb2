// [NOVO] infra/db/sequelize.js
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Função para criar a instância do banco (Factory Pattern)
function createSequelizeInstance() {
    // [CONFIGURAÇÃO] Define onde vai ficar o arquivo do banco
    // Estou colocando na pasta 'data' na raiz do projeto para ficar organizado
    const dataDir = path.join(process.cwd(), 'data');
    
    // Se a pasta 'data' não existir, eu crio ela aqui pra não dar erro
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    const dbPath = path.join(dataDir, 'inventario.db');

    // Inicializando o Sequelize com SQLite
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false // [NOTA] Deixei false pra não poluir o terminal, mas posso mudar pra true pra ver o SQL
    });

    return sequelize;
}

module.exports = { createSequelizeInstance };