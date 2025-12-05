// Esse arquivo controla o fluxo: Rota -> Controller -> Service -> View
// Segue o padrão MVC explicado no guia.

const { validationResult } = require('express-validator');

class LocalController {
    // Recebe o serviço de locais via construtor (Injeção de Dependência)
    constructor(service) {
        this.service = service;
    }

    // [NOVO] Método para exibir a lista de locais (GET /locais)
    async listar(req, res) {
        try {
            // Chama o service para buscar os dados no banco
            const locais = await this.service.listar();
            
            // Renderiza a view 'locais/lista.ejs' passando os dados encontrados
            res.render('locais/lista', { 
                titulo: 'Gerenciar Locais',
                locais: locais 
            });
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao listar locais.');
        }
    }

    // [NOVO] Método para exibir o formulário de cadastro (GET /locais/novo)
    async formulario(req, res) {
        // Renderiza a tela do formulário vazio
        // Passo 'erros' e 'dados' vazios para o EJS não quebrar
        res.render('locais/form', { 
            titulo: 'Novo Local',
            erros: {}, 
            dados: {} 
        });
    }

    // [NOVO] Método para salvar o local (POST /locais)
    async criar(req, res) {
        // Verifica se o express-validator encontrou algum erro nos campos
        const erros = validationResult(req);

        // Se tiver erro, devolve o usuário para o formulário
        if (!erros.isEmpty()) {
            return res.render('locais/form', { 
                titulo: 'Novo Local',
                erros: erros.mapped(), // Manda os erros organizados por campo
                dados: req.body // Manda de volta o que ele digitou (pra não ter que digitar tudo de novo)
            });
        }

        try {
            // Se passou na validação, chama o service para salvar no banco
            await this.service.criar(req.body);
            
            // Redireciona para a lista para ele ver que funcionou
            res.redirect('/locais');
        } catch (erro) {
            console.log(erro);
            res.send('Erro ao criar local.');
        }
    }
}

module.exports = LocalController;