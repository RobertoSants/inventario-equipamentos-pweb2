// Esse arquivo recebe as requisições do usuário (cliques, formulários) e decide o que fazer.

const { validationResult } = require('express-validator');

class LocalController {
    // Recebe o serviço de locais via construtor (Injeção de Dependência)
    constructor(service) {
        this.service = service;
    }

    // [ALTERADO] Método para exibir a lista de locais (GET /locais)
    // [NOVO] Agora trata os filtros específicos de bloco e sala
    async listar(req, res) {
        try {
            // [NOVO] Captura os filtros da URL
            const filtros = {
                termo: req.query.termo || '', // Busca geral (Nome)
                bloco: req.query.bloco || '', // Busca específica de Bloco
                sala: req.query.sala || ''    // [NOVO] Busca específica de Sala
            };

            // Chama o service para buscar os dados no banco (passando os filtros)
            const locais = await this.service.listar(filtros);
            
            // Renderiza a view 'locais/lista.ejs' passando os dados encontrados
            res.render('locais/lista', { 
                titulo: 'Gerenciar Locais',
                locais: locais,
                filtros: filtros // [NOVO] Devolve o filtro para a view manter o input preenchido
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar locais.');
        }
    }

    // Método para exibir o formulário de criação (GET /locais/novo)
    async formulario(req, res) {
        // Renderiza a tela do formulário vazio
        res.render('locais/form', { 
            titulo: 'Novo Local',
            erros: {}, // Sem erros inicialmente
            dados: {}  // Sem dados para preencher
        });
    }

    // Método para processar o cadastro (POST /locais)
    async criar(req, res) {
        // Verifica se houve erros na validação (express-validator)
        const erros = validationResult(req);

        // Se tiver erro, volta para o formulário mostrando os erros
        if (!erros.isEmpty()) {
            return res.render('locais/form', { 
                titulo: 'Novo Local',
                erros: erros.mapped(), // Manda os erros mapeados por campo
                dados: req.body // Manda de volta o que o usuário digitou pra ele não perder
            });
        }

        try {
            // Se validou, chama o service para salvar
            await this.service.criar(req.body);
            
            // Redireciona para a listagem para ver o novo item
            res.redirect('/locais');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao criar local.');
        }
    }

    // [NOVO] Exibe o formulário de edição (GET /locais/:id/editar)
    async editarForm(req, res) {
        try {
            const id = req.params.id;
            const local = await this.service.buscarPorId(id);
            res.render('locais/editar', {
                titulo: 'Editar Local',
                erros: {},
                dados: local
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao buscar local.');
        }
    }

    // [NOVO] Processa a atualização (POST /locais/:id/editar)
    async atualizar(req, res) {
        const id = req.params.id;
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render('locais/editar', {
                titulo: 'Editar Local',
                erros: erros.mapped(),
                dados: { id: id, ...req.body }
            });
        }
        try {
            await this.service.atualizar(id, req.body);
            res.redirect('/locais');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao atualizar local.');
        }
    }

    // [NOVO] Processa a exclusão (POST /locais/:id/excluir)
    async excluir(req, res) {
        try {
            await this.service.excluir(req.params.id);
            res.redirect('/locais');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao excluir local.');
        }
    }
}

module.exports = LocalController;