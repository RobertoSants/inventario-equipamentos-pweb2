// [NOVO] infra/repositories/equipamento-repository.js
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
    // Usamos isso no Service para verificar duplicidade antes de salvar
    async findByPatrimonio(patrimonio) {
        return await this.model.findOne({ where: { patrimonio: patrimonio } });
    }
}

module.exports = EquipamentoRepository;