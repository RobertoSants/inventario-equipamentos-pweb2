# Inventário de Equipamentos - Laboratório IFAL

Sistema web para controle e gerenciamento de inventário de equipamentos de laboratório, incluindo cadastro de locais e histórico de movimentações.

Desenvolvido como atividade da disciplina de **Programação Web 2** (Prof. Leo Fernandes).

---

## Tecnologias Utilizadas

O projeto foi construído utilizando a stack Node.js com foco em padrões de projeto e organização de código.

* **Backend:** Node.js + Express
* **Frontend (SSR):** EJS (Embedded JavaScript) + CSS Personalizado
* **Banco de Dados:** SQLite (Arquivo local `inventario.db`)
* **ORM:** Sequelize
* **Validação:** Express-validator
* **Testes:** Jest + Supertest

---

## Arquitetura do Projeto

Este projeto segue o padrão **MVC (Model-View-Controller)**, expandido com camadas de **Service** e **Repository** para desacoplamento de regras de negócio e persistência de dados (inspirado na Arquitetura Hexagonal / Ports & Adapters).

### Estrutura de Pastas:

* `application/services/`: Contém as **Regras de Negócio** (ex: validação de patrimônio único, bloqueio de movimentação de itens baixados).
* `controllers/`: Recebe as requisições HTTP, chama os serviços e renderiza as Views.
* `infra/`: Camada de Infraestrutura.
    * `db/models/`: Definição das tabelas do banco (Sequelize).
    * `repositories/`: Camada de acesso direto ao banco (isola o ORM do resto do sistema).
* `routes/`: Definição das rotas (URLs) e validações de entrada.
* `views/`: Telas do sistema (arquivos .ejs).
* `container/`: Arquivo responsável pela **Injeção de Dependência** (instancia e conecta Repositórios e Serviços).
* `tests/`: Testes automatizados de integração (E2E).

---

## Funcionalidades

### 1. 🏢 Gerenciamento de Locais (CRUD)
* Cadastro de salas e laboratórios.
* Listagem com filtros específicos por **Nome**, **Bloco** ou **Sala**.
* Edição e Exclusão de locais.

### 2. 💻 Gerenciamento de Equipamentos (CRUD)
* Cadastro com validação de **Patrimônio Único**.
* Status controlados: `ok`, `manutenção`, `baixado`.
* Regra de segurança: **Não permite excluir** equipamentos que estejam em status de "manutenção".
* Listagem com busca por texto (Nome/Patrimônio) e filtro por Status.

### 3. 🔄 Controle de Movimentações
* Registro de movimentação de equipamentos entre locais.
* Regra de negócio: **Bloqueia movimentação** de equipamentos com status "baixado".
* Histórico consultável com filtro por equipamento específico.

---

## Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado na máquina.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/RobertoSants/inventario-equipamentos-pweb2.git
    cd inventario-equipamentos
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Execute o projeto:**
    ```bash
    npm start
    ```

4.  **Acesse no navegador:**
    Abra `http://localhost:3000`

---

## Rodando os Testes

O projeto conta com testes automatizados de integração (E2E) utilizando **Jest** e um banco de dados em memória (SQLite Memory) para não afetar os dados reais.

Para rodar os testes:

```bash
npm test