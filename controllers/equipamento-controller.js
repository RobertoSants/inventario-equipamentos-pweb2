// [NOVO] controllers/equipamento-controller.js
// Responsável por gerenciar as requisições de Equipamentos.

const { validationResult } = require('express-validator');

class EquipamentoController {
    // Recebe o serviço via Injeção de Dependência
    constructor(service) {
        this.service = service;
    }

    // [NOVO] Listar equipamentos
    async listar(req, res) {
        try {
            const equipamentos = await this.service.listar();
            res.render('equipamentos/lista', {
                titulo: 'Gerenciar Equipamentos',
                equipamentos: equipamentos
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar equipamentos.');
        }
    }

    // [NOVO] Abrir formulário vazio
    async formulario(req, res) {
        res.render('equipamentos/form', {
            titulo: 'Novo Equipamento',
            erros: {},
            dados: {}
        });
    }

    // [NOVO] Processar o cadastro
    async criar(req, res) {
        // 1. Validação básica dos campos (vazio, etc)
        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            return res.render('equipamentos/form', {
                titulo: 'Novo Equipamento',
                erros: errosValidacao.mapped(),
                dados: req.body
            });
        }

        try {
            // 2. Tenta salvar usando o Service
            await this.service.criar(req.body);
            res.redirect('/equipamentos');

        } catch (erro) {
            // [REGRA DE NEGÓCIO] Aqui capturamos o erro de patrimônio duplicado lançado pelo Service
            console.log('Erro de negócio:', erro.message);
            
            // Recriamos o objeto de erro para mostrar no campo 'patrimonio' na tela
            const errosNegocio = {
                patrimonio: { msg: erro.message }
            };

            return res.render('equipamentos/form', {
                titulo: 'Novo Equipamento',
                erros: errosNegocio,
                dados: req.body
            });
        }
    }
}

module.exports = EquipamentoController;