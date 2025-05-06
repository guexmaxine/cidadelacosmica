const MAX_MESAS = 6;
const LIMITE_ESPERA = 14;

const atendimento = document.getElementById('atendimento');
const salaEspera = document.getElementById('sala-espera');

let filaDeEspera = [];
let cadeiras = [];
let personagensUsados = new Set();

// 🎵 Sons
const somAtender = new Audio("assets/atender.wav");
const somConvidar = new Audio("assets/convidar.wav");

// 🧠 Puxa personagem aleatório único (imagem + nome)
async function obterPersonagemInfo() {
  let id;
  do {
    id = Math.floor(Math.random() * 826) + 1;
  } while (personagensUsados.has(id));
  personagensUsados.add(id);

  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  const data = await res.json();
  return { image: data.image, name: data.name };
}

// 👤 Cria card de personagem com imagem e nome
function criarPersonagem(imgSrc, nome = "") {
  const div = document.createElement("div");
  div.className = "personagem";

  const img = document.createElement("img");
  img.src = imgSrc;

  const legenda = document.createElement("div");
  legenda.className = "nome-personagem";
  legenda.textContent = nome;

  div.appendChild(img);
  div.appendChild(legenda);
  return div;
}

// 🕒 Define temporizadores de borda
function aplicarTemporizador(personagem) {
  setTimeout(() => personagem.style.borderColor = "orange", 5000);
  setTimeout(() => {
    personagem.style.borderColor = "red";
    personagem.classList.add("piscar");
  }, 10000);
}

// 💡 Efeito verde no botão clicado
function cliqueTemporario(botao) {
  botao.classList.add("clicked");
  setTimeout(() => botao.classList.remove("clicked"), 300);
}

// 🚀 Inicializa com 12 personagens
async function iniciarFila() {
  for (let i = 0; i < 12; i++) {
    const { image, name } = await obterPersonagemInfo();
    const personagem = criarPersonagem(image, name);
    filaDeEspera.push(personagem);
    salaEspera.appendChild(personagem);
  }

  preencherMesas();
}

// 🪑 Preenche mesas com quem está na fila
function preencherMesas() {
  while (cadeiras.length < MAX_MESAS && filaDeEspera.length > 0) {
    const proximo = filaDeEspera.shift();
    salaEspera.removeChild(proximo);
    atendimento.appendChild(proximo);
    aplicarTemporizador(proximo);
    cadeiras.push(proximo);
  }
}

// 🍺 Atende personagem da mesa
function atender() {
  const botao = document.querySelector(".botao-atender");
  cliqueTemporario(botao);

  try {
    somAtender.currentTime = 1;
    somAtender.play();
  } catch (e) {
    console.warn("Erro ao tocar somAtender", e);
  }

  if (cadeiras.length === 0) return;

  const atendido = cadeiras.shift();
  atendido.remove();

  if (filaDeEspera.length > 0) {
    const { image, name } = atendido.dataset;
    const proximo = filaDeEspera.shift();
    salaEspera.removeChild(proximo);
    atendimento.appendChild(proximo);
    aplicarTemporizador(proximo);
    cadeiras.push(proximo);
  }

  preencherMesas();
}

// ➡️ Adiciona novo personagem à fila
async function convidarNovos() {
  const botao = document.querySelector(".botao-convidar");
  cliqueTemporario(botao);

  try {
    somConvidar.currentTime = 1;
    somConvidar.play();
  } catch (e) {
    console.warn("Erro ao tocar somConvidar", e);
  }

  if (filaDeEspera.length >= LIMITE_ESPERA) return;

  const { image, name } = await obterPersonagemInfo();
  const personagem = criarPersonagem(image, name);
  filaDeEspera.push(personagem);
  salaEspera.appendChild(personagem);
}

iniciarFila();
