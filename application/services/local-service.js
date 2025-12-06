// Essa classe controla as Regras de Negócio dos Locais.
// Ela não sabe que banco de dados estamos usando, ela só chama o repositório.

class LocalService {
    // Recebe o repositório no construtor
    constructor(repository) {
        this.repository = repository;
    }

    // Regra para criar um local
    async criar(dados) {
        // [REGRA DE NEGÓCIO] Aqui poderíamos validar se o bloco existe, etc.
        // Por enquanto, apenas repassamos para o repositório salvar.
        return await this.repository.create(dados);
    }

    // [ALTERADO] Regra para listar locais
    // [NOVO] Agora repassa os filtros recebidos do controller para o repositório
    async listar(filtros) {
        return await this.repository.findAll(filtros);
    }

    // [NOVO] Buscar por ID (Adicionado na etapa de CRUD completo)
    async buscarPorId(id) {
        const local = await this.repository.findById(id);
        if (!local) throw new Error('Local não encontrado.');
        return local;
    }

    // [NOVO] Atualizar (Adicionado na etapa de CRUD completo)
    async atualizar(id, dados) {
        // Verifica se existe antes de atualizar
        await this.buscarPorId(id);
        return await this.repository.update(id, dados);
    }

    // [NOVO] Excluir (Adicionado na etapa de CRUD completo)
    async excluir(id) {
        // Verifica se existe antes de excluir
        await this.buscarPorId(id);
        return await this.repository.delete(id);
    }
}

module.exports = LocalService;