// Responsável por salvar o histórico de movimentações.

class MovimentacaoRepository {
    constructor(model) {
        this.model = model;
    }

    // [NOVO] Registra uma nova movimentação
    async create(dados) {
        return await this.model.create(dados);
    }

    // [NOVO] Busca todas as movimentações, trazendo junto os dados do Equipamento e do Local
    // O 'include' é como um JOIN no SQL, para não mostrar só IDs (ex: id: 1), mas sim o nome (ex: Computador)
    async findAll() {
        return await this.model.findAll({
            include: ['Equipamento', 'Local'], // Traz os dados das tabelas relacionadas
            order: [['data', 'DESC']] // As mais recentes aparecem primeiro
        });
    }

    // [NOVO] Busca movimentações de um equipamento específico (Histórico)
    async findByEquipamentoId(equipamentoId) {
        return await this.model.findAll({
            where: { equipamentoId: equipamentoId },
            include: ['Local'], // Aqui só preciso saber pra onde ele foi
            order: [['data', 'DESC']]
        });
    }
}

module.exports = MovimentacaoRepository;