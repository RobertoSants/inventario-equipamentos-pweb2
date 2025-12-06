// Responsável por salvar o histórico de movimentações.

class MovimentacaoRepository {
    constructor(model) {
        this.model = model;
    }

    // [NOVO] Registra uma nova movimentação
    async create(dados) {
        return await this.model.create(dados);
    }

    // [ALTERADO] Busca todas as movimentações
    // O 'include' é como um JOIN no SQL, para não mostrar só IDs (ex: id: 1), mas sim o nome (ex: Computador)
    // [NOVO] Agora aceita filtros opcionais (ex: por equipamento)
    async findAll(filtros = {}) {
        const where = {};

        // [NOVO] Filtro por equipamento específico (Requisito: Consultável por equipamento)
        if (filtros.equipamentoId) {
            where.equipamentoId = filtros.equipamentoId;
        }

        return await this.model.findAll({
            where: where, // Aplica o filtro se existir
            include: ['Equipamento', 'Local'], // Traz os dados das tabelas relacionadas
            order: [['data', 'DESC']] // As mais recentes aparecem primeiro
        });
    }

    // [NOVO] Busca movimentações de um equipamento específico (Histórico)
    // Esse método foi criado na etapa inicial, mas o findAll acima com filtro já cobre essa função também.
    // Vou manter para não quebrar compatibilidade caso algo use.
    async findByEquipamentoId(equipamentoId) {
        return await this.model.findAll({
            where: { equipamentoId: equipamentoId },
            include: ['Local'], // Aqui só preciso saber pra onde ele foi
            order: [['data', 'DESC']]
        });
    }
}

module.exports = MovimentacaoRepository;