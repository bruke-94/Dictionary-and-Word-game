const words = ["hi","hello"];

let selectedWord = "";
let displayedWord = [];
let attemptsLeft = 6;

const wordDisplay = document.getElementById("wordDisplay");
const attemptsDisplay = document.getElementById("attempts");
const letterInput = document.getElementById("letterInput");
const guessBtn = document.getElementById("guessBtn");
const message = document.getElementById("gameMessage");
const restartBtn = document.getElementById("restartBtn");

function updateUI() {
  wordDisplay.textContent = displayedWord.join(" ");
  attemptsDisplay.textContent = attemptsLeft;
}

function saveGameProgress() {
  const gameProgress = {
    selectedWord,
    displayedWord,
    attemptsLeft,
  };
  localStorage.setItem("gameProgress", JSON.stringify(gameProgress));
}

function loadGameProgress() {
  const savedGame = localStorage.getItem("gameProgress");
  if (!savedGame) return false;

  const gameData = JSON.parse(savedGame);
  selectedWord = gameData.selectedWord;
  displayedWord = gameData.displayedWord;
  attemptsLeft = gameData.attemptsLeft;

  message.textContent = "";
  letterInput.disabled = false;
  guessBtn.disabled = false;

  updateUI();
  return true;
}

function startNewGame(clearStorage = true) {
  if (clearStorage) {
    localStorage.removeItem("gameProgress");
  }

  selectedWord = words[Math.floor(Math.random() * words.length)];
  displayedWord = Array(selectedWord.length).fill("_");
  attemptsLeft = 6;

  message.textContent = "";
  letterInput.disabled = false;
  guessBtn.disabled = false;

  updateUI();
  saveGameProgress();
}

function endGame() {
  letterInput.disabled = true;
  guessBtn.disabled = true;
  localStorage.removeItem("gameProgress");
}

function checkGameStatus() {
  if (!displayedWord.includes("_")) {
    message.textContent = " Congratulations! You won!";
    endGame();
  } else if (attemptsLeft === 0) {
    message.textContent = ` Game Over! The word was "${selectedWord}".`;
    endGame();
  }
}

guessBtn.addEventListener("click", () => {
  const letter = letterInput.value.toLowerCase();

  if (!letter || !letter.match(/^[a-z]$/)) {
    message.textContent = "⚠ Please enter a valid letter.";
    return;
  }

  if (selectedWord.includes(letter)) {
    selectedWord.split("").forEach((char, index) => {
      if (char === letter) {
        displayedWord[index] = letter;
      }
    });
  } else {
    attemptsLeft--;
  }

  letterInput.value = "";
  updateUI();
  saveGameProgress();
  checkGameStatus();
});

restartBtn.addEventListener("click", () => {
  startNewGame(true);
});

function startGame() {
  const hasSavedGame = loadGameProgress();
  if (!hasSavedGame) {
    startNewGame(false);
  }
}

startGame();
