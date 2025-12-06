// Regras de negócio para Movimentações.

class MovimentacaoService {
    // Preciso do repositorio de movimentação (pra salvar) 
    // E do repositorio de equipamento (pra validar o status antes)
    constructor(movimentacaoRepository, equipamentoRepository) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.equipamentoRepository = equipamentoRepository;
    }

    // [NOVO] Regra para movimentar
    async criar(dados) {
        // 1. Busco o equipamento pelo ID que veio do formulário
        const equipamento = await this.equipamentoRepository.findById(dados.equipamentoId);
        
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }

        // 2. [REGRA DE NEGÓCIO] Não permitir movimentar equipamento baixado
        if (equipamento.estado === 'baixado') {
            throw new Error('Não é possível movimentar um equipamento que está BAIXADO.');
        }

        // 3. Se estiver tudo ok, salva a movimentação
        return await this.movimentacaoRepository.create(dados);
    }

    // [ALTERADO] Listar todas (para relatórios gerais)
    // [NOVO] Agora aceita filtros para repassar ao repositório
    async listar(filtros) {
        return await this.movimentacaoRepository.findAll(filtros);
    }

    // [NOVO] Histórico de um equipamento
    async listarPorEquipamento(equipamentoId) {
        return await this.movimentacaoRepository.findByEquipamentoId(equipamentoId);
    }
}

module.exports = MovimentacaoService;