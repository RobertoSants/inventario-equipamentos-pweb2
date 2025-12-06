class LocalService {
    constructor(repository) {
        this.repository = repository;
    }

    async criar(dados) {
        return await this.repository.create(dados);
    }

    async listar() {
        return await this.repository.findAll();
    }

    // Buscar por ID
    async buscarPorId(id) {
        const local = await this.repository.findById(id);
        if (!local) throw new Error('Local não encontrado.');
        return local;
    }

    // Atualizar
    async atualizar(id, dados) {
        // Verifica se existe
        await this.buscarPorId(id);
        return await this.repository.update(id, dados);
    }

    // Excluir
    async excluir(id) {
        // Verifica se existe
        await this.buscarPorId(id);
        return await this.repository.delete(id);
    }
}

module.exports = LocalService;