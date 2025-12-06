const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const container = require('../container');
const LocalController = require('../controllers/local-controller');

const controller = new LocalController(container.localService);

// Validações (reutilizáveis)
const validacoes = [
    body('nome').trim().notEmpty().withMessage('O nome do local é obrigatório.'),
    body('bloco').trim().notEmpty().withMessage('O bloco é obrigatório.'),
    body('sala').trim().notEmpty().withMessage('A sala é obrigatória.')
];

router.get('/', controller.listar.bind(controller));
router.get('/novo', controller.formulario.bind(controller));
router.post('/', validacoes, controller.criar.bind(controller));

// [NOVO] Rotas de Editar e Excluir
router.get('/:id/editar', controller.editarForm.bind(controller));
router.post('/:id/editar', validacoes, controller.atualizar.bind(controller));
router.post('/:id/excluir', controller.excluir.bind(controller));

module.exports = router;