// [NOVO] application/services/equipamento-service.js
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
            // Se já existe, lança um erro que o Controller vai pegar e mostrar na tela
            throw new Error('Já existe um equipamento cadastrado com este patrimônio.');
        }

        return await this.repository.create(dados);
    }

    // [NOVO] Listar equipamentos
    async listar() {
        return await this.repository.findAll();
    }
}

module.exports = EquipamentoService;