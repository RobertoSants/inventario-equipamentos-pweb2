// Rotas e validações para Equipamentos

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const container = require('../container');
const EquipamentoController = require('../controllers/equipamento-controller');

// Instanciando o controller com o service correto
const controller = new EquipamentoController(container.equipamentoService);

// --- ROTAS ---

router.get('/', controller.listar.bind(controller));
router.get('/novo', controller.formulario.bind(controller));

// [REGRA] Validações
router.post('/', [
    body('patrimonio').trim().notEmpty().withMessage('O patrimônio é obrigatório.'),
    body('nome').trim().notEmpty().withMessage('O nome do equipamento é obrigatório.'),
    // Valida se o estado é um dos permitidos
    body('estado').isIn(['ok', 'manutenção', 'baixado']).withMessage('Estado inválido.')
], controller.criar.bind(controller));

module.exports = router;