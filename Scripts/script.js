// Loader & Video Autoplay

// Loader
window.onload = function () {
    var loaderContainer = document.getElementById('loader-container');
    var content = document.getElementById('content');

    setTimeout(function () {
        if (loaderContainer) {
            loaderContainer.classList.add('hide');
            setTimeout(function () {
                loaderContainer.style.display = 'none';
            }, 500);
        }

        if (content) {
            content.style.display = 'block';
            setTimeout(function () {
                content.classList.add('show');
            }, 600);
        }
    }, 2000);
};

// Video auto-play when visible
document.addEventListener("DOMContentLoaded", function () {
    const video = document.getElementById("video");
    let played = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !played) {
                video.play();
                played = true;
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(video);
});

// Global Variables

// Global variables
let xs = [], os = []; // Track moves
let is_end = false, is_start = false;
let two_player_mode = false;
let two_player_turn = 1;

const CROSS = "Assets/cross.png";
const CIRCLE = "Assets/circle.png";
let isSound = !(/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent));

const mode = document.getElementById("mode");
const turn = document.getElementById("turn");

// Theme Settings

// Theme colors
let theme_flag = -1;
let CROSScolor = "filter: brightness(0) saturate(100%) invert(52%) sepia(6%) saturate(1960%) hue-rotate(314deg) brightness(85%) contrast(77%);";
let CIRCLEcolor = "filter: brightness(0) saturate(100%) invert(61%) sepia(19%) saturate(645%) hue-rotate(237deg) brightness(77%) contrast(92%);";
document.getElementById("theme_cross").setAttribute("style", CROSScolor);
document.getElementById("theme_circle").setAttribute("style", CIRCLEcolor);

// Game Mode Selection

// Game mode selection
function TwoPlayers() {
    Clear();
    mode.innerHTML = "you are against your friend, have fun!";
    two_player_mode = true;
}
function Bot() {
    Clear();
    mode.innerHTML = "no worries, you are against an AI, have fun!";
    two_player_mode = false;
}

// Game Logic (Minimax, Player Moves, etc.)

// Update turn display
function updateTurnDisplay(symbolType) {
    turn.innerHTML = "turn:&nbsp;&nbsp;";
    let img = document.createElement("img");
    img.width = 15;
    img.height = 15;
    img.src = symbolType;
    img.setAttribute("style", symbolType === CROSS ? CROSScolor : CIRCLEcolor);
    turn.appendChild(img);
}

// Minimax Algorithm to determine the best move for AI (Player O)
function minimax(board, depth, isMaximizingPlayer) {
    const scores = {
        'X': -1,
        'O': 1,
        'draw': 0
    };

    const winner = checkWinner(board);
    if (winner !== null) {
        return scores[winner];
    }

    if (isMaximizingPlayer) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                best = Math.max(best, minimax(board, depth + 1, false));
                board[i] = null;
            }
        }
        return best;
    } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                best = Math.min(best, minimax(board, depth + 1, true));
                board[i] = null;
            }
        }
        return best;
    }
}

// Check if there's a winner
function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return 'X' or 'O'
        }
    }

    if (!board.includes(null)) {
        return 'draw'; // Return draw if no moves are left
    }

    return null; // No winner yet
}

// Find the best move for AI
function getBestMove(board) {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
            board[i] = 'O';
            const moveVal = minimax(board, 0, false);
            board[i] = null;

            if (moveVal > bestVal) {
                bestMove = i;
                bestVal = moveVal;
            }
        }
    }

    return bestMove;
}

// Bot move with Minimax Algorithm
function PcMove() {
    if (!two_player_mode) {
        let board = [...Array(9).keys()].map(i => {
            if (xs.includes(`0${i}`)) return 'X';
            if (os.includes(`0${i}`)) return 'O';
            return null;
        });

        let pos = getBestMove(board); // Find best move for AI using Minimax

        if (pos !== null) {
            PutSign(CIRCLE, os, `0${pos}`);
            if (CheckWin(os)) {
                mode.innerHTML = "bot won!";
                return;
            }
            updateTurnDisplay(CROSS);
        }
    }
}

// Audio & Sound Effects

// Sound effects
let put = new Audio("Assets/Sounds/put.mp3");
let changeMode = new Audio("Assets/Sounds/changemode.mp3");
let changecolor = new Audio("Assets/Sounds/colorchange.mp3");
let error = new Audio("Assets/Sounds/wrong.mp3");


// Preload sounds
[put, changeMode, changecolor, error].forEach(sound => sound.preload = "auto");

// Utility Functions (Clear, Check Win, etc.)

// Theme color switch
function SetColor() {
    changecolor.play();
    theme_flag = theme_flag === -1 ? 0 : -1;
    
    CROSScolor = theme_flag === 0
        ? "filter: brightness(0) saturate(100%) invert(37%) sepia(22%) saturate(957%) hue-rotate(290deg) brightness(95%) contrast(87%);"
        : "filter: brightness(0) saturate(100%) invert(52%) sepia(6%) saturate(1960%) hue-rotate(314deg) brightness(85%) contrast(77%);";
    
    CIRCLEcolor = theme_flag === 0
        ? "filter: brightness(0) saturate(100%) invert(45%) sepia(15%) saturate(1433%) hue-rotate(160deg) brightness(93%) contrast(94%);"
        : "filter: brightness(0) saturate(100%) invert(61%) sepia(19%) saturate(645%) hue-rotate(237deg) brightness(77%) contrast(92%);";

    document.getElementById("theme_cross").setAttribute("style", CROSScolor);
    document.getElementById("theme_circle").setAttribute("style", CIRCLEcolor);

    let images = document.querySelectorAll(".cell img");
    images.forEach(img => {
        img.setAttribute("style", img.src.includes("cross.png") ? CROSScolor : CIRCLEcolor);
    });

    let turnImg = turn.querySelector("img");
    if (turnImg) turnImg.setAttribute("style", turnImg.src.includes("cross.png") ? CROSScolor : CIRCLEcolor);
}

// Function to make the text blink twice
function blinkModeText() {
    const modeText = document.getElementById("mode");
    if (modeText) {
        modeText.classList.add('blink');
        setTimeout(() => {
            modeText.classList.remove('blink');
        }, 500);
    }
}

// Player move
function PlayerMove(pos) {
    if (!is_start) {
        if (isSound) {
            error.play();
            blinkModeText();  // Trigger the blink effect
        }
        mode.innerHTML = "choose the gamemode first";
        return;
    }
    if (os.includes(pos) || xs.includes(pos) || is_end) return;

    if (two_player_mode) {
        if (two_player_turn++ % 2 == 1) {
            updateTurnDisplay(CIRCLE);
            PutSign(CROSS, xs, pos);
        } else {
            updateTurnDisplay(CROSS);
            PutSign(CIRCLE, os, pos);
        }
    } else {
        if (xs.length > os.length) return;
        updateTurnDisplay(CIRCLE);
        PutSign(CROSS, xs, pos);
        if (!CheckWin(xs)) setTimeout(PcMove, 500);
    }

    if (CheckWin(xs)) mode.innerHTML = "player X won";
    else if (CheckWin(os)) mode.innerHTML = "player O won";
    else if (os.length + xs.length > 8) mode.innerHTML = "draw!";
}


// Place symbol on board
function PutSign(signType, signArray, pos) {
    if (!pos) return;
    var img = document.createElement("img");
    img.width = 80;
    img.height = 80;
    img.src = signType;
    img.setAttribute("style", signType === CIRCLE ? CIRCLEcolor : CROSScolor);
    document.getElementById(pos).appendChild(img);
    signArray.push(pos);
    if (isSound) put.play();
}

// Check win condition
function CheckWin(sign) {
    let wins = [
        ['00', '01', '02'], ['03', '04', '05'], ['06', '07', '08'], // Rows
        ['00', '03', '06'], ['01', '04', '07'], ['02', '05', '08'], // Columns
        ['00', '04', '08'], ['02', '04', '06']  // Diagonals
    ];
    return is_end = wins.some(comb => comb.every(cell => sign.includes(cell)));
}

// Clear board
function Clear() {
    xs = [], os = [];
    is_end = false, is_start = true;
    two_player_turn = 1;
    [...document.getElementsByClassName("cell")].forEach(cell => cell.innerHTML = "");
}
