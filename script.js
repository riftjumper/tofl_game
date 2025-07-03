const wordPairs = [
  ["Abandon", "To leave behind"],
  ["Brief", "Short in duration"],
  ["Capable", "Able to do something"],
  ["Deteriorate", "To become worse"],
  ["Essential", "Absolutely necessary"],
  ["Fluctuate", "To change irregularly"],
];

let moves = 24;
let timeLeft = 120;
let matched = 0;
let flipped = [];
let timer = null;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startGame() {
  const flatCards = shuffle(wordPairs.flat());
  const $board = $("#game-board");
  $board.empty();
  matched = 0;
  moves = 24;
  timeLeft = 120;
  flipped = [];

  $("#timer").text("2:00");
  $("#moves").text(moves);

  flatCards.forEach((value) => {
    const $col = $("<div>").addClass("col");

    const $cardInner = $("<div>")
      .addClass("card-inner")
      .attr("data-value", value);

    const $front = $("<div>").addClass("card-front").text("?");
    const $back = $("<div>").addClass("card-back").text(value);

    $cardInner.append($front, $back);

    const $cardBox = $("<div>")
      .addClass("card-box")
      .append($cardInner)
      .on("click", function () {
        flipCard($(this).find(".card-inner"));
      });

    $col.append($cardBox);
    $board.append($col);
  });

  startTimer();
}

function flipCard($cardInner) {
  if (
    $cardInner.hasClass("card-flip") ||
    flipped.length >= 2 ||
    $cardInner.parent().hasClass("matched")
  )
    return;

  $cardInner.addClass("card-flip");
  flipped.push($cardInner[0]);

  if (flipped.length === 2) {
    moves--;
    $("#moves").text(moves);

    const $a = $(flipped[0]);
    const $b = $(flipped[1]);

    const match = wordPairs.some(
      ([word, def]) =>
        ($a.data("value") === word && $b.data("value") === def) ||
        ($a.data("value") === def && $b.data("value") === word)
    );

    setTimeout(() => {
      if (match) {
        $a.parent().addClass("matched");
        $b.parent().addClass("matched");
        matched++;
        if (matched === 6) return winGame();
      } else {
        $a.removeClass("card-flip");
        $b.removeClass("card-flip");
      }

      flipped = [];

      if (moves <= 0) loseGame();
    }, 900);
  }
}

function startTimer() {
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    $("#timer").text(`${mins}:${secs < 10 ? "0" : ""}${secs}`);

    if (timeLeft <= 0) {
      clearInterval(timer);
      loseGame();
    }
  }, 1000);
}

function winGame() {
  clearInterval(timer);
  alert("🎉 Congratulations! You matched all pairs.");
}

function loseGame() {
  clearInterval(timer);
  const loseModal = new bootstrap.Modal($("#loseModal")[0]);
  loseModal.show();
}

$(document).ready(() => {
  $("#restart-btn").on("click", () => {
    const modal = bootstrap.Modal.getInstance($("#loseModal")[0]);
    modal.hide();
    startGame();
  });

  startGame();
});
