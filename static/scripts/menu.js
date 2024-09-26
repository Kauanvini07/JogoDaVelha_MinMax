let currentPlayer = 'X'; // Armazena quem é o jogador atual
let gameMode = ''; // Guarda o modo de jogo, tipo humano vs humano ou computador
let difficulty = ''; // Guarda a dificuldade selecionada

function startGame(mode, selectedDifficulty) {
    gameMode = mode; // Define o modo de jogo escolhido
    difficulty = selectedDifficulty; // Define a dificuldade escolhida

    resetBoard(); // Limpa o tabuleiro antes de começar o jogo
    document.getElementById('menu').style.display = 'none'; // Esconde o menu
    document.getElementById('game-container').style.display = 'block'; // Mostra a área do jogo
    document.getElementById('reset-button').style.display = 'block'; // Mostra o botão de reiniciar
    document.getElementById('menu-button').style.display = 'block'; // Mostra o botão de voltar ao menu

    if (mode === 'humano-humano') {
        document.getElementById('status').style.display = 'block'; // Mostra o status se for humano vs humano
    } else {
        document.getElementById('status').style.display = 'block'; // Mostra o status pra computador vs humano
        const script = document.createElement('script'); // Cria um novo script
        script.src = '../static/scripts/minimax.js'; // Define o caminho do minimax
        document.body.appendChild(script); // Adiciona o script ao corpo do documento
    }
    resetGame(); // Reinicia o jogo
}

function resetBoard() {
    board = [ // Cria um tabuleiro vazio
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = ""; // Limpa as células
        cell.classList.remove('disabled'); // Remove a classe de desabilitado
        cell.classList.remove('X', 'O'); // Remove as classes X e O
    });
    document.getElementById('status').innerText = ""; // Limpa o texto de status
}

function updateStatus() {
    if (gameMode === 'humano-humano') {
        document.getElementById('status').innerText = 'Vez do jogador: ' + currentPlayer; // Atualiza quem é o próximo
    }
}

function resetGame() {
    for (let i = 0; i < 3; i++) { // Loop pelas linhas
        for (let j = 0; j < 3; j++) { // Loop pelas colunas
            document.getElementById(i + '' + j).innerHTML = ''; // Limpa cada célula
        }
    }
    currentPlayer = 'X'; // Reinicia o jogador pra ser 'X'
    resetBoard(); // Limpa o tabuleiro
    updateStatus(); // Atualiza o status do jogo
}

function goToMenu() {
    document.getElementById('game-container').style.display = 'none'; // Esconde a área do jogo
    document.getElementById('menu').style.display = 'flex'; // Mostra o menu
    document.getElementById('reset-button').style.display = 'none'; // Esconde o botão de reiniciar
    document.getElementById('menu-button').style.display = 'none'; // Esconde o botão de voltar
    resetGame(); // Reinicia o jogo
}

// Função pra alternar o modo de debug
let debugMode = false; // Variável pra controlar se o debug tá ativado ou não

function toggleDebug() {
    const debugToggle = document.getElementById('debugToggle'); // Pega o checkbox do debug
    const debugStatus = document.getElementById('debugStatus'); // Pega o texto do status do debug

    debugMode = debugToggle.checked; // Atualiza se o modo debug tá ativado
    debugStatus.innerText = debugMode ? "Ativado" : "Desativado"; // Muda o texto do status
    console.log(`Modo Debug ${debugMode ? "Ativado" : "Desativado"}`); // Mostra mensagem no console
}
