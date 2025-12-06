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

// [REGRA] Validações (é reutilizado para criar e atualizar)
const validacoes = [
    body('patrimonio').trim().notEmpty().withMessage('O patrimônio é obrigatório.'),
    body('nome').trim().notEmpty().withMessage('O nome do equipamento é obrigatório.'),
    body('estado').isIn(['ok', 'manutenção', 'baixado']).withMessage('Estado inválido.')
];

router.post('/', validacoes, controller.criar.bind(controller));

// [NOVO] Rotas de Edição e Exclusão
// :id indica que é um parametro variavel (ex: 1, 2, 50)

// GET para abrir o formulário de edição
router.get('/:id/editar', controller.editarForm.bind(controller));

// POST para salvar a edição (Atualizar)
router.post('/:id/editar', validacoes, controller.atualizar.bind(controller));

// POST para excluir (POST foi usado pois o HTML puro não suporta DELETE)
router.post('/:id/excluir', controller.excluir.bind(controller));

module.exports = router;