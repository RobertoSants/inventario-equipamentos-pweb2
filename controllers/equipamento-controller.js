// Responsável por gerenciar as requisições de Equipamentos.
const { validationResult } = require('express-validator');

class EquipamentoController {
    // Recebe o serviço via Injeção de Dependência
    constructor(service) {
        this.service = service;
    }

    // Listar equipamentos (Agora com suporte a filtros)
    async listar(req, res) {
        try {
            // [NOVO] Captura os filtros da URL (req.query)
            // Exemplo: se a URL for /equipamentos?termo=teste&estado=ok
            const filtros = {
                termo: req.query.termo || '', // Se não tiver nada, fica vazio
                estado: req.query.estado || ''
            };

            // Passa os filtros para o service buscar no banco
            const equipamentos = await this.service.listar(filtros);
            
            res.render('equipamentos/lista', {
                titulo: 'Gerenciar Equipamentos',
                equipamentos: equipamentos,
                filtros: filtros // [NOVO] Manda os filtros de volta para a view (para manter o input preenchido)
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar equipamentos.');
        }
    }

    // [NOVO] Abrir formulário vazio (Cadastro)
    async formulario(req, res) {
        res.render('equipamentos/form', {
            titulo: 'Novo Equipamento',
            erros: {},
            dados: {}
        });
    }

    // [NOVO] Processar o cadastro
    async criar(req, res) {
        const errosValidacao = validationResult(req);

        if (!errosValidacao.isEmpty()) {
            return res.render('equipamentos/form', {
                titulo: 'Novo Equipamento',
                erros: errosValidacao.mapped(),
                dados: req.body
            });
        }

        try {
            await this.service.criar(req.body);
            res.redirect('/equipamentos');

        } catch (erro) {
            console.log('Erro de negócio:', erro.message);
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

    // [NOVO] Exibe o formulário de edição preenchido com os dados atuais
    async editarForm(req, res) {
        try {
            const id = req.params.id;
            const equipamento = await this.service.buscarPorId(id);

            res.render('equipamentos/editar', {
                titulo: 'Editar Equipamento',
                erros: {},
                dados: equipamento // Mando os dados do banco para preencher os campos
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao buscar equipamento para edição.');
        }
    }

    // [NOVO] Processa a atualização dos dados
    async atualizar(req, res) {
        const id = req.params.id;
        const errosValidacao = validationResult(req);

        // Se tiver erro de validação, volta para o form de edição
        if (!errosValidacao.isEmpty()) {
            return res.render('equipamentos/editar', {
                titulo: 'Editar Equipamento',
                erros: errosValidacao.mapped(),
                dados: { id: id, ...req.body } // Mantém os dados digitados e o ID
            });
        }

        try {
            await this.service.atualizar(id, req.body);
            res.redirect('/equipamentos');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao atualizar equipamento.');
        }
    }

    // [ALTERADO] Processa a exclusão com tratamento de erro
    // Alterei aqui para capturar o erro de "manutenção" e mostrar na tela
    async excluir(req, res) {
        try {
            const id = req.params.id;
            await this.service.excluir(id);
            res.redirect('/equipamentos');
        } catch (erro) {
            console.log(erro);
            
            // Se der erro (ex: está em manutenção), é preciso listar novamente
            // para mostrar a mensagem na própria tela de listagem.
            try {
                // [NOVO] Precisa passar os filtros vazios aqui pra não quebrar a view que espera 'filtros'
                const equipamentos = await this.service.listar({});
                res.render('equipamentos/lista', {
                    titulo: 'Gerenciar Equipamentos',
                    equipamentos: equipamentos,
                    filtros: { termo: '', estado: '' }, // [NOVO] Filtros padrão
                    erro: erro.message // [NOVO] Manda o erro para a view exibir o alerta vermelho
                });
            } catch (erroListagem) {
                // Caso extremo onde até listar falha
                res.send('Erro fatal ao tentar excluir e listar: ' + erro.message);
            }
        }
    }
}

module.exports = EquipamentoController;