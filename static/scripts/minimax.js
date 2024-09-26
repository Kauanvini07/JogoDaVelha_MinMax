var board = [ // Tabuleiro inicial, 0 indica células vazias
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];

var HUMAN = -1; // Representa o jogador humano
var COMP = +1; // Representa o computador

/* Função para avaliar o estado do jogo. */
function evalute(state) {
    var score = 0; // Inicializa a pontuação

    if (gameOver(state, COMP)) {
        score = +1; // Computador ganhou
    } else if (gameOver(state, HUMAN)) {
        score = -1; // Humano ganhou
    } else {
        score = 0; // Jogo empatado ou não terminou
    }

    return score; // Retorna a pontuação
}

// Verifica se o jogo terminou para um jogador
function gameOver(state, player) {
    var win_state = [ // Todas as combinações de vitória possíveis
        [state[0][0], state[0][1], state[0][2]], // Linhas
        [state[1][0], state[1][1], state[1][2]],
        [state[2][0], state[2][1], state[2][2]],
        [state[0][0], state[1][0], state[2][0]], // Colunas
        [state[0][1], state[1][1], state[2][1]],
        [state[0][2], state[1][2], state[2][2]],
        [state[0][0], state[1][1], state[2][2]], // Diagonais
        [state[2][0], state[1][1], state[0][2]],
    ];

    for (var i = 0; i < 8; i++) {
        var line = win_state[i]; // Checa cada combinação de vitória
        var filled = 0; // Conta quantas posições estão preenchidas pelo jogador

        for (var j = 0; j < 3; j++) {
            if (line[j] == player)
                filled++; // Aumenta a contagem se o jogador preencheu a posição
        }

        if (filled == 3) // Se o jogador preencheu todas as 3 posições
            return true; // Jogo acabou
    }
    return false; // Se não, o jogo continua
}

function gameOverAll(state) {
    return gameOver(state, HUMAN) || gameOver(state, COMP); // Verifica se algum dos jogadores ganhou
}

function emptyCells(state) {
    var cells = []; // Cria uma lista para armazenar células vazias
    for (var x = 0; x < 3; x++) {
        for (var y = 0; y < 3; y++) {
            if (state[x][y] == 0)
                cells.push([x, y]); // Adiciona a célula se estiver vazia
        }
    }
    return cells; // Retorna todas as células vazias
}

function validMove(x, y) {
    try {
        return board[x][y] == 0; // Retorna verdadeiro se a célula estiver vazia
    } catch (e) {
        return false; // Se a célula não existe (fora do tabuleiro)
    }
}

function setMove(x, y, player) {
    if (validMove(x, y)) { // Se o movimento é válido
        board[x][y] = player; // Atualiza a célula com o jogador
        return true; // Movimento bem-sucedido
    } else {
        return false; // Movimento inválido
    }
}

// Função minimax que busca o melhor movimento
function minimax(state, depth, player, alpha, beta) {
    var best; // Variável para armazenar o melhor movimento

    if (player == COMP) { // Se é a vez do computador
        best = [-1, -1, -1000]; // Melhor resultado inicial
    } else {
        best = [-1, -1, +1000]; // Melhor resultado inicial para humano
    }

    // Se o jogo acabou ou atingiu a profundidade máxima
    if (depth == 0 || gameOverAll(state)) {
        var score = evalute(state); // Avalia o estado atual do jogo
        return [-1, -1, score]; // Retorna a pontuação
    }

    emptyCells(state).forEach(function (cell) { // Para cada célula vazia
        var x = cell[0];
        var y = cell[1];
        state[x][y] = player; // Faz o movimento
        var score = minimax(state, depth - 1, -player, alpha, beta); // Chama minimax recursivamente
        state[x][y] = 0; // Desfaz o movimento

        score[0] = x; // Armazena a linha do movimento
        score[1] = y; // Armazena a coluna do movimento

        if (player == COMP) { // Se é a vez do computador
            if (score[2] > best[2]) // Se o novo movimento é melhor que o melhor atual
                best = score; // Atualiza o melhor movimento
                if (debugMode) console.log(`Novo melhor encontrado: ${best[0]}, ${best[1]} com valor ${best[2]}`);
            alpha = Math.max(alpha, best[2]); // Atualiza Alfa
        } else { // Se é a vez do humano
            if (score[2] < best[2]) // Se o novo movimento é pior que o melhor atual
                best = score; // Atualiza o melhor movimento
            beta = Math.min(beta, best[2]); // Atualiza Beta
        }

        // Poda: se beta é menor ou igual a alfa, interrompe a busca
        if (beta <= alpha) {
            return best; // Sai do loop
        }
    });
    return best; // Retorna o melhor movimento encontrado
}

function aiTurn() {
    var x, y;
    var move;
    var validMoveFound = false;

    while (!validMoveFound && emptyCells(board).length > 0) {
        if (emptyCells(board).length == 9) { // Se o tabuleiro estiver vazio
            x = parseInt(Math.random() * 3); // Movimento aleatório
            y = parseInt(Math.random() * 3);
        } else {
            var depth = emptyCells(board).length; // Define a profundidade como o número de células vazias
            if (debugMode) console.log(`Profundidade: ${depth}`);

            if (difficulty === 'easy') { // Se a dificuldade é fácil
                if (debugMode) console.log("Dificuldade: Facil");
                if (Math.random() < 0.7) { // 70% de chance de fazer um movimento aleatório
                    move = emptyCells(board)[Math.floor(Math.random() * emptyCells(board).length)];
                    if (debugMode) console.log(`Jogada aleatória: ${move}`);
                    x = move[0];
                    y = move[1];
                } else { // 30% de chance de usar minimax
                    move = minimax(board, depth, COMP, -Infinity, +Infinity);
                    if (debugMode) console.log(`Jogada minimax: ${move}`);
                    x = move[0];
                    y = move[1];
                }
            } else { // Se a dificuldade é difícil
                if (debugMode) console.log("Dificuldade: Dificil");
                move = minimax(board, depth, COMP, -Infinity, +Infinity); // Sempre usa minimax
                console.log(`Jogada minimax: ${move}`);
                x = move[0];
                y = move[1];
            }
        }

        validMoveFound = setMove(x, y, COMP); // Tenta fazer o movimento
    }

    if (validMoveFound) {
        var cell = document.getElementById(String(x) + String(y));
        if (debugMode) console.log(`Computador jogou na célula: ${move[0]}, ${move[1]}`);
        cell.innerHTML = "O"; // Atualiza a célula com o movimento do computador
        cell.classList.add("O")

        // Verifica se o computador ganhou
        if (gameOver(board, COMP)) {
            document.getElementById('status').innerText = "O computador ganhou!";
            endGame(); // Finaliza o jogo
            return; // Evita execução adicional
        }
    }
}

function clickedCell(cell) {
    // Aqui, a gente pega o id da célula clicada e divide ele em duas partes: x e y.
    var x = cell.id.split("")[0]; // O primeiro caractere do id é a coordenada x
    var y = cell.id.split("")[1]; // O segundo caractere é a coordenada y
    var move; // Vamos usar essa variável pra armazenar o movimento feito

    // Se o modo de jogo é computador contra humano
    if (gameMode === 'computador-humano') {
        move = setMove(x, y, HUMAN); // O humano faz o movimento
    } else {
        move = setMove(x, y, currentPlayer); // Se não, é um jogo humano-humano
    }

    // Se o movimento foi válido (ou seja, a célula não tava ocupada)
    if (move) {
        cell.innerHTML = currentPlayer; // Atualiza a célula com o símbolo do jogador
        cell.classList.add(currentPlayer) // Adiciona a classe correspondente pra estilo

        // Agora, vamos verificar se alguém ganhou
        if (gameMode === 'computador-humano') {
            // Verifica se o humano ganhou
            if (gameOver(board, HUMAN)) {
                document.getElementById('status').innerText = "Você ganhou!"; // Mensagem de vitória
                endGame(); // Finaliza o jogo
                return; // Para aqui, não precisa executar mais nada
            }
        } else {
            // Modo humano-humano
            if (gameOver(board, currentPlayer)) {
                document.getElementById('status').innerText = currentPlayer + " ganhou!"; // Mensagem de vitória
                endGame(); // Finaliza o jogo
                return; // Para aqui também
            }
        }

        // Verifica se ainda tem células vazias
        if (emptyCells(board).length == 0) {
            document.getElementById('status').innerText = "Empate!"; // Mensagem de empate
            endGame(); // Finaliza o jogo
            return; // Para aqui mais uma vez
        }

        // Se o jogo ainda tá rolando e é o modo computador-humano
        if (gameMode === 'computador-humano') {
            aiTurn(); // Chama a função pro computador jogar
        } else {
            // Se é humano-humano
            cell.classList.add(currentPlayer); // Adiciona a classe certa
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Alterna o jogador
            updateStatus(); // Atualiza o status do jogo
        }
    }
}


// Função pra finalizar o jogo, desabilitando as células
function endGame() {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('X', 'O'); // Remove as classes X e O
        cell.classList.add('disabled'); // Marca as células como desabilitadas
    });
}
