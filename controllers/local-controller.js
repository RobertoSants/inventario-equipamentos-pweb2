const { validationResult } = require('express-validator');

class LocalController {
    constructor(service) {
        this.service = service;
    }

    async listar(req, res) {
        try {
            const locais = await this.service.listar();
            res.render('locais/lista', { 
                titulo: 'Gerenciar Locais',
                locais: locais 
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar locais.');
        }
    }

    async formulario(req, res) {
        res.render('locais/form', { 
            titulo: 'Novo Local',
            erros: {}, 
            dados: {} 
        });
    }

    async criar(req, res) {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.render('locais/form', { 
                titulo: 'Novo Local',
                erros: erros.mapped(), 
                dados: req.body 
            });
        }
        try {
            await this.service.criar(req.body);
            res.redirect('/locais');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao criar local.');
        }
    }

    // [NOVO] Formulário de Edição
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

    // [NOVO] Salvar Edição
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

    // [NOVO] Excluir
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