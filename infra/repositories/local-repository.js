// Esse arquivo é responsável por fazer as chamadas diretas ao Banco de Dados usando o Sequelize.
// Ele isola o banco do resto da aplicação.

const { Op } = require('sequelize'); // Importando operadores do Sequelize (LIKE, OR) para busca

class LocalRepository {
    // Recebe o Model do Sequelize no construtor (Injeção de Dependência)
    constructor(model) {
        this.model = model;
    }

    // Método para salvar um novo local no banco
    async create(dados) {
        return await this.model.create(dados);
    }

    // Método para buscar todos os locais
    // [NOVO] Agora aceita filtros combinados (termo, bloco E sala)
    async findAll(filtros = {}) {
        const where = {};

        // [NOVO] 1. Busca Genérica (Apenas Nome)
        // [ALTERADO] Retirei 'sala' daqui também, agora 'termo' busca apenas no Nome do local
        if (filtros.termo) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${filtros.termo}%` } } // %termo% busca texto que contenha o valor
            ];
        }

        // [NOVO] 2. Filtro Específico por Bloco
        // Se o usuário digitou algo no campo de bloco, filtramos exatamente por ele
        if (filtros.bloco) {
            where.bloco = { [Op.like]: `%${filtros.bloco}%` };
        }

        // [NOVO] 3. Filtro Específico por Sala
        // Adicionado para permitir buscar especificamente pelo número da sala
        if (filtros.sala) {
            where.sala = { [Op.like]: `%${filtros.sala}%` };
        }

        // Ordena pelo nome para ficar padronizado na lista
        return await this.model.findAll({ 
            where: where, // [NOVO] Aplica os filtros (Eles funcionam como AND: termo E bloco E sala)
            order: [['nome', 'ASC']] 
        });
    }

    // [NOVO] Busca por ID (Adicionado na etapa de CRUD completo)
    async findById(id) {
        return await this.model.findByPk(id);
    }

    // [NOVO] Atualiza um registro existente
    async update(id, dados) {
        await this.model.update(dados, { where: { id: id } });
        return await this.findById(id);
    }

    // [NOVO] Remove um registro pelo ID
    async delete(id) {
        return await this.model.destroy({ where: { id: id } });
    }
}

module.exports = LocalRepository;