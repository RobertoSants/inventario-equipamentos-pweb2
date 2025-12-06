const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

// Função para criar a instância do banco
function createSequelizeInstance() {
    // [NOVO] Verificação de ambiente
    // Se estivermos rodando testes (NODE_ENV = 'test'), usamos banco em memória.
    // Isso evita encher o banco real de lixo.
    if (process.env.NODE_ENV === 'test') {
        return new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:', // Banco volátil (apaga ao fechar)
            logging: false
        });
    }

    // [CONFIGURAÇÃO] Define onde vai ficar o arquivo do banco real
    const dataDir = path.join(process.cwd(), 'data');
    
    // Se a pasta 'data' não existir, ela é criada aqui para não dar erro
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    const dbPath = path.join(dataDir, 'inventario.db');

    // Inicializando o Sequelize com SQLite
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: dbPath,
        logging: false // [NOTA] Deixei false pra não poluir o terminal
    });

    return sequelize;
}

module.exports = { createSequelizeInstance };