const base = "http://localhost:3000";

const criarCurso = await fetch(base + "/curso", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    slug: "react-basico",
    nome: "React Básico",
    descricao: "Curso de React, aprenda o básico de react para se tornar um desenvolvedor frontend.",
  }),
}).then((r) => r.json());
console.log(criarCurso)

const criarAula = await fetch(base + "/aula", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    cursoSlug: "react-basico",
    nome: "Hooks Iniciais",
    slug: "hooks-iniciais",
  }),
}).then((r) => r.json());
console.log(criarAula);

const cursos = await fetch(base + "/cursos").then((r) => r.json());
console.log(cursos);

const curso = await fetch(base + "/curso?slug=fundamentos-js").then((r) => r.json());
console.log(curso);

const aulas = await fetch(base + "/aulas?curso=fundamentos-js").then((r) => r.json());
console.log(aulas);

const aula = await fetch(base + "/aula?curso=fundamentos-js&slug=variaveis-e-tipos").then((r) => r.json());
console.log(aula);
