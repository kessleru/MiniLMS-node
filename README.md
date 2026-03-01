# MiniLMS-node

Um mini LMS (Learning Management System) em Node.js com banco SQLite embutido, voltado para estudos e testes de API. O projeto expõe endpoints simples para criação e consulta de cursos e aulas.

## Visão geral

- API HTTP sem frameworks externos
- Persistência em SQLite (`lms.sqlite`)
- Seed inicial com cursos e aulas realistas

## Recursos

- Criar curso
- Criar aula
- Listar cursos
- Buscar curso por `slug`
- Listar aulas por curso
- Buscar aula por `slug` dentro de um curso

## Requisitos

- Node.js versão 24 para cima para obter suporte ao `node:sqlite`

## Como executar

1. Instale dependências (opcional, só há tipos do Node):
   npm install

2. Inicie o servidor:
   node --no-warnings --watch src/server.mjs

3. Inicie o banco de dados:
   node --no-warnings --watch src/database.mjs

4. (Opcional) Execute o client de exemplo:
   node --no-warnings --watch src/client.mjs

## Endpoints

Base URL: `http://localhost:3000`

### Cursos

- **POST** `/curso`
  - Body JSON:
    - `slug` (string)
    - `nome` (string)
    - `descricao` (string)

- **GET** `/cursos`
  - Retorna todos os cursos.

- **GET** `/curso?slug={slug}`
  - Retorna um curso específico.

### Aulas

- **POST** `/aula`
  - Body JSON:
    - `cursoSlug` (string)
    - `slug` (string)
    - `nome` (string)

- **GET** `/aulas?curso={cursoSlug}`
  - Retorna todas as aulas de um curso.

- **GET** `/aula?curso={cursoSlug}&slug={aulaSlug}`
  - Retorna uma aula específica de um curso.

## Exemplos rápidos

Criar um curso:
curl -X POST http://localhost:3000/curso \
 -H "Content-Type: application/json" \
 -d "{\"slug\":\"react-basico\",\"nome\":\"React Básico\",\"descricao\":\"Curso de React\"}"

Criar uma aula:
curl -X POST http://localhost:3000/aula \
 -H "Content-Type: application/json" \
 -d "{\"cursoSlug\":\"react-basico\",\"slug\":\"hooks-iniciais\",\"nome\":\"Hooks Iniciais\"}"

Listar aulas de um curso:
curl "http://localhost:3000/aulas?curso=react-basico"

## Estrutura de arquivos

- `src/server.mjs`: servidor HTTP e rotas
- `src/database.mjs`: schema, seed e operações no SQLite
- `src/client.mjs`: client de exemplo para testes

## Observações

- O banco é criado automaticamente em `lms.sqlite`.
- Já existem cursos e aulas predefinidos no seed inicial para facilitar testes.
