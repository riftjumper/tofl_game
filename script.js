const words = [
  ["Abandon", "To leave behind"],
  ["Brief", "Short in duration"],
  ["Capable", "Able to do something"],
  ["Deteriorate", "To become worse"],
  ["Essential", "Absolutely necessary"],
  ["Fluctuate", "To change irregularly"],
];

let cards = [],
  moves = 24,
  matched = 0;
let timer,
  timeLeft = 120;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  matched = 0;
  moves = 24;
  document.getElementById("moves").textContent = `Moves: ${moves}`;
  document.getElementById("cta-popup").style.display = "none";

  // Flatten vocab pairs
  const flatCards = shuffle(
    words
      .slice(0, 6)
      .map(([word, def]) => [word, def])
      .flat()
  );

  cards = flatCards.map((text, i) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.value = text;
    card.textContent = "?";
    card.onclick = () => flipCard(card);
    board.appendChild(card);
    return card;
  });

  startTimer();
}

let flipped = [];

function flipCard(card) {
  if (
    flipped.length === 2 ||
    card.classList.contains("matched") ||
    flipped.includes(card)
  )
    return;

  card.textContent = card.dataset.value;
  flipped.push(card);

  if (flipped.length === 2) {
    moves--;
    document.getElementById("moves").textContent = `Moves: ${moves}`;
    const [a, b] = flipped;

    const match = words.some(
      ([w, d]) =>
        (a.dataset.value === w && b.dataset.value === d) ||
        (a.dataset.value === d && b.dataset.value === w)
    );

    setTimeout(() => {
      if (match) {
        a.classList.add("matched");
        b.classList.add("matched");
        matched += 1;
        if (matched === 6) return winGame();
      } else {
        a.textContent = "?";
        b.textContent = "?";
      }

      if (moves <= 0) loseGame();

      flipped = [];
    }, 800);
  }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 120;
  document.getElementById("timer").textContent = "⏱️ 2:00";

  timer = setInterval(() => {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    document.getElementById("timer").textContent = `⏱️ ${mins}:${
      secs < 10 ? "0" : ""
    }${secs}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

function loseGame() {
  document.getElementById("cta-popup").style.display = "block";
}

function winGame() {
  clearInterval(timer);
  alert("🎉 You matched all pairs! Well done.");
  // You could add confetti here
}

function restartGame() {
  startGame();
}

startGame();
