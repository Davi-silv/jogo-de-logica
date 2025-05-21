// Palavras relacionadas à lógica de programação
const palavras = [
    'ALGORITMO',
    'VARIAVEL',
    'FUNÇÃO',
    'LOOP',
    'CONDICIONAL',
    'ARRAY',
    'OBJETO',
    'CLASSE',
    'MÉTODO',
    'PARÂMETRO',
    'RETORNO',
    'RECURSÃO',
    'ITERAÇÃO',
    'BOOLEANO',
    'OPERADOR'
];

// Dicas para cada palavra
const dicas = {
    'ALGORITMO': 'Sequência de passos para resolver um problema',
    'VARIÁVEL': 'Local para armazenar dados que podem mudar',
    'FUNÇÃO': 'Bloco de código reutilizável que realiza uma tarefa específica',
    'LOOP': 'Estrutura que repete um bloco de código',
    'CONDICIONAL': 'Estrutura que executa código baseado em uma condição',
    'ARRAY': 'Estrutura que armazena múltiplos valores em uma única variável',
    'OBJETO': 'Estrutura que agrupa dados e comportamentos relacionados',
    'CLASSE': 'Modelo para criar objetos com propriedades e métodos',
    'MÉTODO': 'Função que pertence a um objeto ou classe',
    'PARÂMETRO': 'Valor passado para uma função',
    'RETORNO': 'Valor que uma função devolve após sua execução',
    'RECURSÃO': 'Função que chama a si mesma',
    'ITERAÇÃO': 'Processo de repetição de um bloco de código',
    'BOOLEANO': 'Tipo de dado que pode ser verdadeiro ou falso',
    'OPERADOR': 'Símbolo que realiza operações em valores'
};

// Elementos do DOM
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const wordDisplay = document.getElementById('wordDisplay');
const attemptsDisplay = document.getElementById('attempts');
const usedLettersDisplay = document.getElementById('usedLetters');
const messageDisplay = document.getElementById('message');
const keyboard = document.getElementById('keyboard');
const newGameBtn = document.getElementById('newGameBtn');
const hintBtn = document.getElementById('hintBtn');

// Configurações do canvas
canvas.width = 300;
canvas.height = 300;

// Variáveis do jogo
let palavraAtual;
let letrasUsadas;
let tentativasRestantes;
let jogoAtivo;
let dicaUsada;

// Inicializa o teclado
function criarTeclado() {
    keyboard.innerHTML = '';
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letras.forEach(letra => {
        const button = document.createElement('button');
        button.className = 'key';
        button.textContent = letra;
        button.addEventListener('click', () => tentarLetra(letra));
        keyboard.appendChild(button);
    });
}

// Desenha a forca
function desenharForca() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Base
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(250, 250);
    ctx.stroke();

    // Poste vertical
    ctx.beginPath();
    ctx.moveTo(100, 250);
    ctx.lineTo(100, 50);
    ctx.stroke();

    // Topo
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(200, 50);
    ctx.stroke();

    // Corda
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 80);
    ctx.stroke();

    // Desenha o boneco baseado nas tentativas restantes
    if (tentativasRestantes < 6) {
        // Cabeça
        ctx.beginPath();
        ctx.arc(200, 100, 20, 0, Math.PI * 2);
        ctx.stroke();
    }
    if (tentativasRestantes < 5) {
        // Corpo
        ctx.beginPath();
        ctx.moveTo(200, 120);
        ctx.lineTo(200, 180);
        ctx.stroke();
    }
    if (tentativasRestantes < 4) {
        // Braço esquerdo
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(170, 160);
        ctx.stroke();
    }
    if (tentativasRestantes < 3) {
        // Braço direito
        ctx.beginPath();
        ctx.moveTo(200, 140);
        ctx.lineTo(230, 160);
        ctx.stroke();
    }
    if (tentativasRestantes < 2) {
        // Perna esquerda
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(170, 220);
        ctx.stroke();
    }
    if (tentativasRestantes < 1) {
        // Perna direita
        ctx.beginPath();
        ctx.moveTo(200, 180);
        ctx.lineTo(230, 220);
        ctx.stroke();
    }
}

// Atualiza o display da palavra
function atualizarPalavraDisplay() {
    const display = palavraAtual
        .split('')
        .map(letra => letrasUsadas.includes(letra) ? letra : '_')
        .join(' ');
    wordDisplay.textContent = display;
}

// Verifica se o jogador ganhou
function verificarVitoria() {
    return palavraAtual.split('').every(letra => letrasUsadas.includes(letra));
}

// Tenta uma letra
function tentarLetra(letra) {
    if (!jogoAtivo || letrasUsadas.includes(letra)) return;

    letrasUsadas.push(letra);
    usedLettersDisplay.textContent = letrasUsadas.join(', ');

    if (!palavraAtual.includes(letra)) {
        tentativasRestantes--;
        attemptsDisplay.textContent = tentativasRestantes;
    }

    atualizarPalavraDisplay();
    desenharForca();

    // Verifica o estado do jogo
    if (verificarVitoria()) {
        jogoAtivo = false;
        messageDisplay.textContent = 'Parabéns! Você venceu!';
        messageDisplay.className = 'message win';
    } else if (tentativasRestantes === 0) {
        jogoAtivo = false;
        messageDisplay.textContent = `Game Over! A palavra era ${palavraAtual}`;
        messageDisplay.className = 'message lose';
    }
}

// Função para mostrar dica
function mostrarDica() {
    if (!jogoAtivo || dicaUsada) return;
    
    const dica = dicas[palavraAtual];
    messageDisplay.textContent = `Dica: ${dica}`;
    messageDisplay.className = 'message';
    dicaUsada = true;
    hintBtn.disabled = true;
}

// Inicia um novo jogo
function iniciarJogo() {
    palavraAtual = palavras[Math.floor(Math.random() * palavras.length)];
    letrasUsadas = [];
    tentativasRestantes = 6;
    jogoAtivo = true;
    dicaUsada = false;

    messageDisplay.textContent = '';
    messageDisplay.className = 'message';
    attemptsDisplay.textContent = tentativasRestantes;
    usedLettersDisplay.textContent = '';
    hintBtn.disabled = false;

    atualizarPalavraDisplay();
    desenharForca();
    criarTeclado();
}

// Event listeners
newGameBtn.addEventListener('click', iniciarJogo);
hintBtn.addEventListener('click', mostrarDica);

// Inicia o primeiro jogo
iniciarJogo(); 