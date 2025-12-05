// Rotas para acessar o histórico e registrar movimentos.

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const container = require('../container');
const MovimentacaoController = require('../controllers/movimentacao-controller');

// [IMPORTANTE] Instancio o controller passando TUDO que ele precisa
const controller = new MovimentacaoController(
    container.movimentacaoService,
    container.equipamentoService,
    container.localService
);

// --- ROTAS ---

router.get('/', controller.listar.bind(controller));
router.get('/novo', controller.formulario.bind(controller));

// [REGRA] Validação dos campos
router.post('/', [
    body('equipamentoId').notEmpty().withMessage('Selecione um equipamento.'),
    body('localId').notEmpty().withMessage('Selecione um local.'),
    body('responsavel').trim().notEmpty().withMessage('Informe o responsável.')
], controller.criar.bind(controller));

module.exports = router;