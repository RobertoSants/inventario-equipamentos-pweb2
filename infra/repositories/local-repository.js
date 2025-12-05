// Classe responsável por fazer o meio de campo com o banco de dados (Sequelize).
// Eu isolei isso aqui para seguir o padrão Repository do guia.

class LocalRepository {
    // Recebe o Model do Sequelize no construtor (Injeção de Dependência)
    constructor(model) {
        this.model = model;
    }

    // [NOVO] Salva um local no banco
    async create(dados) {
        return await this.model.create(dados);
    }

    // [NOVO] Busca todos os locais ordenados por nome
    async findAll() {
        return await this.model.findAll({ 
            order: [['nome', 'ASC']] // Deixa em ordem alfabética pra ficar organizado na lista
        });
    }
}

module.exports = LocalRepository;