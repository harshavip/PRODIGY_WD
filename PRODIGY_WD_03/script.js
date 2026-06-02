const navbar = document.getElementById("navbar");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");
const revealElements = document.querySelectorAll(".reveal");

const cells = document.querySelectorAll(".cell");
const messageBox = document.getElementById("messageBox");
const gameStatus = document.getElementById("gameStatus");
const friendModeBtn = document.getElementById("friendModeBtn");
const aiModeBtn = document.getElementById("aiModeBtn");
const newRoundBtn = document.getElementById("newRoundBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");
const playerOLabel = document.getElementById("playerOLabel");

const winningPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let gameMode = "friend";
let scores = {
  X: 0,
  O: 0,
  draw: 0
};

function updateMessage(text) {
  messageBox.textContent = text;
  gameStatus.textContent = gameActive ? "Playing" : "Finished";
}

function updateScoreboard() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draw;
  playerOLabel.textContent = gameMode === "ai" ? "Computer O" : "Player O";
}

function renderBoard() {
  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.classList.remove("x", "o", "win");

    if (board[index] === "X") {
      cell.classList.add("x");
    }

    if (board[index] === "O") {
      cell.classList.add("o");
    }
  });
}

function checkWinner() {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        winner: board[a],
        pattern: pattern
      };
    }
  }

  if (!board.includes("")) {
    return {
      winner: "draw",
      pattern: []
    };
  }

  return null;
}

function highlightWinner(pattern) {
  pattern.forEach(index => {
    cells[index].classList.add("win");
  });
}

function finishGame(result) {
  gameActive = false;

  if (result.winner === "draw") {
    scores.draw++;
    updateMessage("It is a draw! No empty cells left.");
  } else {
    scores[result.winner]++;
    highlightWinner(result.pattern);

    if (gameMode === "ai" && result.winner === "O") {
      updateMessage("Computer wins this round!");
    } else {
      updateMessage(`Player ${result.winner} wins this round!`);
    }
  }

  updateScoreboard();
}

function switchPlayer() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";

  if (gameMode === "ai" && currentPlayer === "O" && gameActive) {
    updateMessage("Computer is thinking...");
    setTimeout(makeAiMove, 450);
  } else {
    updateMessage(`Player ${currentPlayer} turn`);
  }
}

function handleCellClick(event) {
  const index = Number(event.target.dataset.index);

  if (!gameActive || board[index] !== "") return;
  if (gameMode === "ai" && currentPlayer === "O") return;

  board[index] = currentPlayer;
  renderBoard();

  const result = checkWinner();

  if (result) {
    finishGame(result);
    return;
  }

  switchPlayer();
}

function findBestMove(player) {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;
    const values = [board[a], board[b], board[c]];

    if (values.filter(value => value === player).length === 2 && values.includes("")) {
      return pattern[values.indexOf("")];
    }
  }

  return null;
}

function makeAiMove() {
  if (!gameActive) return;

  let move = findBestMove("O");

  if (move === null) {
    move = findBestMove("X");
  }

  if (move === null && board[4] === "") {
    move = 4;
  }

  if (move === null) {
    const corners = [0, 2, 6, 8].filter(index => board[index] === "");

    if (corners.length > 0) {
      move = corners[Math.floor(Math.random() * corners.length)];
    }
  }

  if (move === null) {
    const availableMoves = board
      .map((value, index) => value === "" ? index : null)
      .filter(value => value !== null);

    move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  board[move] = "O";
  renderBoard();

  const result = checkWinner();

  if (result) {
    finishGame(result);
    return;
  }

  switchPlayer();
}

function startNewRound() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  renderBoard();
  updateMessage("Player X turn");
}

function resetScores() {
  scores = {
    X: 0,
    O: 0,
    draw: 0
  };

  updateScoreboard();
  startNewRound();
}

function setGameMode(mode) {
  gameMode = mode;

  if (mode === "friend") {
    friendModeBtn.classList.add("active-mode");
    aiModeBtn.classList.remove("active-mode");
  } else {
    aiModeBtn.classList.add("active-mode");
    friendModeBtn.classList.remove("active-mode");
  }

  updateScoreboard();
  startNewRound();
}

cells.forEach(cell => {
  cell.addEventListener("click", handleCellClick);
});

friendModeBtn.addEventListener("click", () => setGameMode("friend"));
aiModeBtn.addEventListener("click", () => setGameMode("ai"));
newRoundBtn.addEventListener("click", startNewRound);
resetScoreBtn.addEventListener("click", resetScores);

function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}

function updateActiveLink() {
  let current = "home";

  sections.forEach(section => {
    const top = section.offsetTop - 170;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
}

function revealOnScroll() {
  revealElements.forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const revealPoint = 115;

    if (elementTop < window.innerHeight - revealPoint) {
      element.classList.add("show");
    }
  });
}

window.addEventListener("scroll", () => {
  updateNavbar();
  updateActiveLink();
  revealOnScroll();
});

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("show");
  menuBtn.textContent = navLinks.classList.contains("show") ? "✕" : "☰";
});

navItems.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("show");
    menuBtn.textContent = "☰";
  });
});

renderBoard();
updateScoreboard();
updateMessage("Player X turn");
updateNavbar();
updateActiveLink();
revealOnScroll();
