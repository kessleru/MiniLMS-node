import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync("./lms.sqlite");

db.exec(/*sql*/ `
  PRAGMA foreign_keys = 1;
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;

  PRAGMA cache_size = 2000;
  PRAGMA busy_timeout = 5000;
  PRAGMA temp_store = MEMORY;
`);

db.exec(/*sql*/ `
  CREATE TABLE IF NOT EXISTS "cursos" (
    "id" INTEGER PRIMARY KEY,
    "slug" TEXT NOT NULL COLLATE NOCASE UNIQUE,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL
  ) STRICT;

  CREATE TABLE IF NOT EXISTS "aulas" (
    "id" INTEGER PRIMARY KEY,
    "curso_id" INTEGER NOT NULL,
    "slug" TEXT NOT NULL COLLATE NOCASE,
    "nome" TEXT NOT NULL,
    FOREIGN KEY("curso_id") REFERENCES "cursos" ("id"),
    UNIQUE("curso_id", "slug")
  ) STRICT;
`);

db.exec(/*sql*/ `
  INSERT OR IGNORE INTO "cursos" ("slug", "nome", "descricao") VALUES
    ('fundamentos-js', 'Fundamentos de JavaScript', 'Aprenda variáveis, tipos, funções e estruturas essenciais do JavaScript moderno.'),
    ('node-essencial', 'Node.js Essencial', 'Construa APIs e serviços com Node.js, eventos e módulo HTTP.'),
    ('sql-pratico', 'SQL Prático', 'Modelagem, consultas e otimização para bancos relacionais.'),
    ('web-frontend', 'Web Frontend', 'HTML, CSS e fundamentos de acessibilidade e responsividade.'),
    ('engenharia-software', 'Engenharia de Software', 'Versionamento, testes, arquitetura e boas práticas de desenvolvimento.');
`);

db.exec(/*sql*/ `
  INSERT OR IGNORE INTO "aulas" ("curso_id", "slug", "nome") VALUES
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'fundamentos-js'), 'variaveis-e-tipos', 'Variáveis e Tipos'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'fundamentos-js'), 'funcoes-e-escopos', 'Funções e Escopos'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'fundamentos-js'), 'arrays-objetos', 'Arrays e Objetos'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'fundamentos-js'), 'async-basico', 'Assíncrono: Promises e Async/Await'),

    ((SELECT "id" FROM "cursos" WHERE "slug" = 'node-essencial'), 'intro-node', 'Introdução ao Node.js'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'node-essencial'), 'modulos', 'Módulos e NPM'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'node-essencial'), 'http-basico', 'HTTP Básico com Node'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'node-essencial'), 'middlewares', 'Middlewares e Rotas'),

    ((SELECT "id" FROM "cursos" WHERE "slug" = 'sql-pratico'), 'modelagem', 'Modelagem Relacional'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'sql-pratico'), 'selects', 'SELECTs e JOINs'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'sql-pratico'), 'indices', 'Índices e Performance'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'sql-pratico'), 'transacoes', 'Transações e Consistência'),

    ((SELECT "id" FROM "cursos" WHERE "slug" = 'web-frontend'), 'html-semantico', 'HTML Semântico'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'web-frontend'), 'css-responsivo', 'CSS Responsivo'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'web-frontend'), 'acessibilidade', 'Acessibilidade Web'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'web-frontend'), 'fundamentos-js-web', 'JavaScript no Browser'),

    ((SELECT "id" FROM "cursos" WHERE "slug" = 'engenharia-software'), 'git-workflow', 'Git e Workflow'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'engenharia-software'), 'testes', 'Testes Automatizados'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'engenharia-software'), 'arquitetura', 'Arquitetura em Camadas'),
    ((SELECT "id" FROM "cursos" WHERE "slug" = 'engenharia-software'), 'code-review', 'Code Review e Boas Práticas');
`);

export function criarCurso({ slug, nome, descricao }) {
  try {
    return db
      .prepare(
        /*sql*/
        `
      INSERT OR IGNORE INTO "cursos"
        ("slug", "nome", "descricao")
      VALUES
        (?, ?, ?)
      `,
      )
      .run(slug, nome, descricao);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function criarAula({ cursoSlug, slug, nome }) {
  try {
    return db
      .prepare(
        /*sql*/
        `
      INSERT OR IGNORE INTO aulas
        ("curso_id", "slug", "nome")
      VALUES
        ((SELECT "id" FROM "cursos" WHERE "slug" = ?), ?, ?)
      `,
      )
      .run(cursoSlug, slug, nome);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarCursos() {
  try {
    return db
      .prepare(
        /*sql*/
        `
      SELECT * FROM "cursos"
      `,
      )
      .all();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarCurso({ slug }) {
  try {
    return db
      .prepare(
        /*sql*/
        `
      SELECT * FROM "cursos" WHERE slug = ?
      `,
      )
      .get(slug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarAulas({ cursoSlug }) {
  try {
    return db
      .prepare(
        /*sql*/
        `
      SELECT * FROM "aulas" WHERE "curso_id" = (SELECT "id" FROM "cursos" WHERE "slug" = ?) ORDER BY "id"
      `,
      )
      .all(cursoSlug);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function pegarAula({ cursoSlug, aulaSlug }) {
  try {
    return db
      .prepare(
        /*sql*/
        `
      SELECT * FROM "aulas" WHERE "curso_id" = (SELECT "id" FROM "cursos" WHERE "slug" = ?) AND "slug" = ?
      `,
      )
      .get(cursoSlug, aulaSlug);
  } catch (error) {
    console.log(error);
    return null;
  }
}
