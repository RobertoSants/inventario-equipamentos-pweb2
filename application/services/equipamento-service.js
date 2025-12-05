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
            throw new Error('Já existe um equipamento cadastrado com este patrimônio.');
        }

        return await this.repository.create(dados);
    }

    // [NOVO] Listar equipamentos
    async listar() {
        return await this.repository.findAll();
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
        // Verifica se existe antes de tentar atualizar
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }

        
        return await this.repository.update(id, dados);
    }

    // [NOVO] Excluir equipamento
    async excluir(id) {
        const equipamento = await this.repository.findById(id);
        if (!equipamento) {
            throw new Error('Equipamento não encontrado.');
        }
        
        return await this.repository.delete(id);
    }
}

module.exports = EquipamentoService;