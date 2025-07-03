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
