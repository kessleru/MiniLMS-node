const response = await fetch('http://localhost:3000/produtos', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    nome: 'Notebook',
    slug: 'notebook',
    categoria: 'eletronicos',
    preco: 4000,
  }),
});

console.log(response);
console.log('------------');
const data = await response.text();
console.log(data);
