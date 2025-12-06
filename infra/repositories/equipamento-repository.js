// Responsável por buscar e salvar equipamentos no banco de dados via Sequelize.

const { Op } = require('sequelize'); // [NOVO] Importando operadores do Sequelize (LIKE, OR) para fazer a busca

class EquipamentoRepository {
    // Recebe o Model via Injeção de Dependência
    constructor(model) {
        this.model = model;
    }

    // [NOVO] Salva um novo equipamento
    async create(dados) {
        return await this.model.create(dados);
    }

    // [ALTERADO] Busca todos os equipamentos
    // Agora aceita um objeto 'filtros' opcional para pesquisar por nome ou status
    async findAll(filtros = {}) {
        const where = {};

        // 1. Se tiver termo de busca (pesquisa), procura no Nome OU no Patrimônio
        if (filtros.termo) {
            where[Op.or] = [
                { nome: { [Op.like]: `%${filtros.termo}%` } }, // %termo% significa "contém" em SQL
                { patrimonio: { [Op.like]: `%${filtros.termo}%` } }
            ];
        }

        // 2. Se tiver status selecionado, filtra pelo status exato
        if (filtros.estado) {
            where.estado = filtros.estado;
        }

        return await this.model.findAll({ 
            where: where, // Aplica os filtros criados acima (se houver)
            order: [['nome', 'ASC']] 
        });
    }

    // [NOVO] Método específico para buscar por patrimônio
    // Usaremos isso no Service para verificar duplicidade antes de salvar
    async findByPatrimonio(patrimonio) {
        return await this.model.findOne({ where: { patrimonio: patrimonio } });
    }

    // [NOVO] Busca por ID (Já tínhamos criado antes, mas mantendo aqui)
    async findById(id) {
        return await this.model.findByPk(id);
    }

    // [NOVO] Atualiza um equipamento existente
    async update(id, dados) {
        // O update do Sequelize retorna um array [numeroDeLinhasAfetadas]
        await this.model.update(dados, {
            where: { id: id }
        });
        // Retorno o item atualizado para garantir
        return await this.findById(id);
    }

    // [NOVO] Remove um equipamento pelo ID
    async delete(id) {
        return await this.model.destroy({
            where: { id: id }
        });
    }
}

module.exports = EquipamentoRepository;