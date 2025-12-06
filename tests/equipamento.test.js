// Testes de Integração para a funcionalidade de Equipamentos.
// Usa Supertest para simular requisições HTTP e Jest para verificar os resultados.

const request = require('supertest');
const app = require('../app'); // Importa nosso servidor
const { sequelize } = require('../container'); // Importa o banco para poder limpar/fechar

describe('Testes de Equipamentos (E2E)', () => {
    
    // Antes de todos os testes, sincroniza o banco (cria as tabelas na memória)
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    // Depois de tudo, fecha a conexão para o teste acabar ok.
    afterAll(async () => {
        await sequelize.close();
    });

    // TESTE 1: Verificar se cria um equipamento válido
    test('Deve cadastrar um novo equipamento com sucesso', async () => {
        const res = await request(app)
            .post('/equipamentos')
            .type('form') // Simula um formulário HTML
            .send({
                patrimonio: 'TESTE-001',
                nome: 'Computador de Teste',
                estado: 'ok'
            });

        // O sucesso no nosso controller é um redirecionamento (Status 302) para a lista
        expect(res.statusCode).toEqual(302);
        expect(res.headers.location).toBe('/equipamentos');
    });

    // TESTE 2: Verificar a regra de Patrimônio Único
    test('NÃO deve permitir patrimônio duplicado', async () => {
        // Tenta cadastrar o MESMO patrimônio do teste anterior
        const res = await request(app)
            .post('/equipamentos')
            .type('form')
            .send({
                patrimonio: 'TESTE-001', // Repetido!
                nome: 'Computador Clonado',
                estado: 'ok'
            });

        // Nesse caso, nosso controller não redireciona (302).
        // Ele renderiza a página de novo (200) mostrando o erro.
        expect(res.statusCode).toEqual(200);
        
        // Verifico se o HTML retornado contém a mensagem de erro que definimos no Service
        expect(res.text).toContain('Já existe um equipamento cadastrado com este patrimônio');
    });

    // TESTE 3: Verificar Validação de Campos Vazios
    test('NÃO deve permitir campos vazios', async () => {
        const res = await request(app)
            .post('/equipamentos')
            .type('form')
            .send({
                patrimonio: '', // Vazio
                nome: '',
                estado: 'ok'
            });

        // Deve retornar a página com erro (200)
        expect(res.statusCode).toEqual(200);
        expect(res.text).toContain('O patrimônio é obrigatório');
    });
});