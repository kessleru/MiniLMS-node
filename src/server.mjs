import { createServer } from "node:http";
import { Router } from "./router.mjs";
import { customRequest } from "./custom-request.mjs";
import { customResponse } from "./custom-response.mjs";
import {
  criarAula,
  criarCurso,
  pegarCursos,
  pegarCurso,
  pegarAulas,
  pegarAula,
} from "./database.mjs";

const router = new Router();

// Cria um curso
router.post("/curso", (req, res) => {
  const { slug, nome, descricao } = req.body;

  const curso = criarCurso({ slug, nome, descricao });
  if (!curso) {
    return res.status(400).json("Curso não criado.");
  }
  return res.status(201).json(curso);
});

// Cria uma aula
router.post("/aula", (req, res) => {
  const { cursoSlug, slug, nome } = req.body;

  const aula = criarAula({ cursoSlug, slug, nome });
  if (!aula) {
    return res.status(400).json("Aula não criada.");
  }
  return res.status(201).json(aula);
});

// Lista todos os cursos
router.get("/cursos", (req, res) => {
  const cursos = pegarCursos();
  if (!cursos) {
    return res.status(404).json("Não foi possivel listar os cursos.");
  }
  return res.status(200).json(cursos);
});

// Pega um curso por slug
router.get("/curso", (req, res) => {
  const slug = req.query.get("slug");
  const curso = pegarCurso({ slug });
  if (!curso) {
    return res.status(400).json("Curso não encontrado.");
  }
  return res.status(200).json(curso);
});

// Listas todas as aulas do curso por slug
router.get("/aulas", (req, res) => {
  const cursoSlug = req.query.get("curso");
  const aulas = pegarAulas({ cursoSlug });
  if (!aulas) {
    return res.status(400).json("Não foi possivel listar as aulas.");
  }
  return res.status(200).json(aulas);
});

// Pega a aula usando o slug do curso e da aula
router.get("/aula", (req, res) => {
  const cursoSlug = req.query.get("curso");
  const aulaSlug = req.query.get("slug");
  const aula = pegarAula({ cursoSlug, aulaSlug });
  if (!aula) {
    return res.status(400).json("Aula não encontrada.");
  }
  return res.status(200).json(aula);
});

console.log(router.routes);
console.log("------------");

const server = createServer(async (request, response) => {
  const req = await customRequest(request);
  const res = customResponse(response);

  const handler = router.find(req.method, req.pathname);
  if (handler) {
    handler(req, res);
  } else {
    res.status(404).end("Não encontrada");
  }
});

server.listen(3000, () => {
  console.log("Server: http://localhost:3000");
});
