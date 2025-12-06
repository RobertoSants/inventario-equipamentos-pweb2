// Regras de negócio para Equipamentos.

class EquipamentoService {
    constructor(repository) {
        this.repository = repository;
    }

    async criar(dados) {
        const existe = await this.repository.findByPatrimonio(dados.patrimonio);
        if (existe) {
            throw new Error('Já existe um equipamento cadastrado com este patrimônio.');
        }
        return await this.repository.create(dados);
    }

    async listar() {
        return await this.repository.findAll();
    }

    async buscarPorId(id) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }
        return equipamento;
    }

    async atualizar(id, dados) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }
        return await this.repository.update(id, dados);
    }

    // [ALTERADO] Regra para não excluir se estiver em manutenção
    async excluir(id) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }

        // [NOVO] Regra de negócio pedida
        if (equipamento.estado === 'manutenção') {
            throw new Error('Não é possível excluir um equipamento que está em manutenção.');
        }
        
        return await this.repository.delete(id);
    }
}

module.exports = EquipamentoService;