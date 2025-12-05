// Responsável por buscar e salvar equipamentos no banco de dados via Sequelize.

class EquipamentoRepository {
    // Recebe o Model via Injeção de Dependência
    constructor(model) {
        this.model = model;
    }

    // [NOVO] Salva um novo equipamento
    async create(dados) {
        return await this.model.create(dados);
    }

    // [NOVO] Busca todos os equipamentos
    async findAll() {
        return await this.model.findAll({ order: [['nome', 'ASC']] });
    }

    // [NOVO] Método específico para buscar por patrimônio
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