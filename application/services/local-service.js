// Aqui ficam as Regras de Negócio dos Locais.
// O Controller chama esse arquivo, e esse arquivo chama o Repository.

class LocalService {
    // Recebe o repositório no construtor (não sabe se é SQL, Oracle, etc, só sabe que é um repositório)
    constructor(repository) {
        this.repository = repository;
    }

    // [NOVO] Regra para criar um local
    async criar(dados) {
        // Futuramente posso colocar validação aqui (ex: checar se o bloco existe)
        return await this.repository.create(dados);
    }

    // [NOVO] Regra para listar locais
    async listar() {
        return await this.repository.findAll();
    }
}

module.exports = LocalService;