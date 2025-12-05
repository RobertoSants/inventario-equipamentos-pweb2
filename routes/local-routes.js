// [NOVO] routes/local-routes.js
// Define os endereços (URLs) para acessar as funções de Locais

const express = require('express');
const { body } = require('express-validator'); // Biblioteca de validação
const router = express.Router();

// Importando o container para pegar o serviço que já está pronto
const container = require('../container');
const LocalController = require('../controllers/local-controller');

// Instanciando o controller e injetando o serviço de locais nele
const controller = new LocalController(container.localService);

// --- DEFINIÇÃO DAS ROTAS ---

// 1. Rota para listar (GET /locais)
// O .bind(controller) serve para o 'this' funcionar dentro da classe
router.get('/', controller.listar.bind(controller));

// 2. Rota para abrir o formulário (GET /locais/novo)
router.get('/novo', controller.formulario.bind(controller));

// 3. Rota para salvar (POST /locais)
// [REGRA] definição das validações: campos não podem ser vazios
router.post('/', [
    body('nome').trim().notEmpty().withMessage('O nome do local é obrigatório.'),
    body('bloco').trim().notEmpty().withMessage('O bloco é obrigatório.'),
    body('sala').trim().notEmpty().withMessage('A sala é obrigatória.')
], controller.criar.bind(controller));

module.exports = router;