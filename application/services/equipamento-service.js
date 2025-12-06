// Regras de negócio para Equipamentos.

class EquipamentoService {
    constructor(repository) {
        this.repository = repository;
    }

    // [NOVO] Regra para criar equipamento
    async criar(dados) {
        // [REGRA DE NEGÓCIO] Validar duplicidade de patrimônio
        const existe = await this.repository.findByPatrimonio(dados.patrimonio);
        
        if (existe) {
            // Se já existe, lanço um erro que o Controller vai pegar e mostrar na tela
            throw new Error('Já existe um equipamento cadastrado com este patrimônio.');
        }

        return await this.repository.create(dados);
    }

    // [ALTERADO] Listar equipamentos
    // Agora repassa os filtros (busca/status) para o repositório
    async listar(filtros) {
        return await this.repository.findAll(filtros);
    }

    // [NOVO] Buscar um único equipamento (usado para preencher o formulário de edição)
    async buscarPorId(id) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }
        return equipamento;
    }

    // [NOVO] Atualizar equipamento
    async atualizar(id, dados) {
        // Verifico se existe antes de tentar atualizar
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }

        // Aqui poderíamos validar se o novo patrimônio já existe em OUTRO equipamento,
        // mas vamos deixar o banco cuidar disso por enquanto para simplificar.
        
        return await this.repository.update(id, dados);
    }

    // [NOVO] Excluir equipamento
    async excluir(id) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }

        // [NOVO] Regra de negócio pedida
        // Não permitir excluir se estiver em manutenção
        if (equipamento.estado === 'manutenção') {
            throw new Error('Não é possível excluir um equipamento que está em manutenção.');
        }
        
        return await this.repository.delete(id);
    }
}

module.exports = EquipamentoService;