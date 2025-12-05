// Controla as telas de movimentação.

const { validationResult } = require('express-validator');

class MovimentacaoController {
    // [IMPORTANTE] Recebo os 3 serviços aqui.
    // MovimentacaoService: pra salvar o movimento.
    // EquipamentoService: pra listar os equipamentos no <select>.
    // LocalService: pra listar os locais no <select>.
    constructor(movimentacaoService, equipamentoService, localService) {
        this.movimentacaoService = movimentacaoService;
        this.equipamentoService = equipamentoService;
        this.localService = localService;
    }

    // [NOVO] Listar movimentações (Histórico Geral)
    async listar(req, res) {
        try {
            const movimentacoes = await this.movimentacaoService.listar();
            res.render('movimentacoes/lista', {
                titulo: 'Histórico de Movimentações',
                movimentacoes: movimentacoes
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar movimentações.');
        }
    }

    // [NOVO] Formulário de nova movimentação
    async formulario(req, res) {
        try {
            // Busco as listas para preencher os <select> da tela
            const equipamentos = await this.equipamentoService.listar();
            const locais = await this.localService.listar();

            res.render('movimentacoes/form', {
                titulo: 'Registrar Movimentação',
                erros: {},
                dados: {},
                // Mando as listas para a view
                equipamentos: equipamentos,
                locais: locais
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao carregar formulário.');
        }
    }

    // [NOVO] Salvar a movimentação
    async criar(req, res) {
        const erros = validationResult(req);

        // Se tiver erro de validação (campos vazios), preciso recarregar as listas
        // senão os <select> somem da tela e dá erro.
        if (!erros.isEmpty()) {
            const equipamentos = await this.equipamentoService.listar();
            const locais = await this.localService.listar();

            return res.render('movimentacoes/form', {
                titulo: 'Registrar Movimentação',
                erros: erros.mapped(),
                dados: req.body,
                equipamentos: equipamentos,
                locais: locais
            });
        }

        try {
            await this.movimentacaoService.criar(req.body);
            res.redirect('/movimentacoes');

        } catch (erro) {
            // [TRATAMENTO DE ERRO DE NEGÓCIO]
            // Aqui pegamos o erro "Equipamento BAIXADO" que criamos no Service
            console.log('Erro de negócio:', erro.message);

            // Recarrego as listas para voltar pro formulário
            const equipamentos = await this.equipamentoService.listar();
            const locais = await this.localService.listar();

            // Crio um objeto de erro para mostrar uma mensagem geral
            const erroNegocio = {
                geral: { msg: erro.message }
            };

            return res.render('movimentacoes/form', {
                titulo: 'Registrar Movimentação',
                erros: erroNegocio,
                dados: req.body,
                equipamentos: equipamentos,
                locais: locais
            });
        }
    }
}

module.exports = MovimentacaoController;