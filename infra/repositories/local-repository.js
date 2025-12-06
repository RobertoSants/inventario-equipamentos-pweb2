// [ALTERADO] infra/repositories/local-repository.js
class LocalRepository {
    constructor(model) {
        this.model = model;
    }

    async create(dados) {
        return await this.model.create(dados);
    }

    async findAll() {
        return await this.model.findAll({ order: [['nome', 'ASC']] });
    }

    // [NOVO] Busca por ID
    async findById(id) {
        return await this.model.findByPk(id);
    }

    // [NOVO] Atualiza
    async update(id, dados) {
        await this.model.update(dados, { where: { id: id } });
        return await this.findById(id);
    }

    // [NOVO] Remove
    async delete(id) {
        return await this.model.destroy({ where: { id: id } });
    }
}

module.exports = LocalRepository;