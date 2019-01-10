
var container = document.querySelector(".container"),
    deckTable = document.querySelector(".deck"),
    restart = document.querySelector(".restart"),
    movesCounter = document.querySelector(".moves"),
    star = document.getElementsByClassName("fa fa-star"),
    timer = document.getElementsByClassName("fa fa-timer"),
    modal = document.querySelector(".modal"),
    modalText = document.querySelector(".modal-text"),
    playAgain = document.getElementsByTagName("button"),
    playAgainButton = document.createElement("button"),
    totalPairs = deckTable.childElementCount/2,
    matchedPairs = 0,
    numberOfMoves = 0,
    min = 0,
    sec = 0,
    openCards = [],
    cards = [],
    gameTimer;

//Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        array[currentIndex].classList.remove("open", "show", "match");
        temporaryValue = array[currentIndex].firstElementChild.className;
        array[currentIndex].firstElementChild.className = array[randomIndex].firstElementChild.className;
        array[randomIndex].firstElementChild.className = temporaryValue;
    }
    return array;
}

// display clicked cards
function showCards(event) {
    event.target.classList.add("open", "show");
    openCards.push(event.target);  //save cards so we can compare them if they match
}

// close mismatch cards
function closeCards(event) {
    openCards.forEach(function(element) {
      var defaultBgColor = element.style.backgroundColor;

      element.style.backgroundColor = "#DC143C";  // highlight mismatch cards

      setTimeout(function() {
          element.classList.remove("open", "show");
          element.style.backgroundColor = defaultBgColor;
      }, 800);  // set delay timer (milliseconds) before closing mismatch cards
    });
}

// lock matching cards in open position
function lockCards(event) {
    matchedPairs += 1;
    openCards.forEach(function(element) {
      element.classList.remove("open", "show");
      element.classList.add("match");
      element.classList.add("pulse");
      setTimeout(function() {
          element.classList.remove("pulse");
      },500);
    });

    // if the total open matched pairs === total pairs, game over
    if (matchedPairs === totalPairs) {
      endGame();
    }
}

// check if the open pair of cards matched
function matchCards (event) {
    if (openCards[0].firstElementChild.className === openCards[1].firstElementChild.className) {
        lockCards(event);  //cards matched, keep both cards open
    } else {
        closeCards(event);  // card don't match, close both cards
      }
}

// a card is clicked
function cardClicked() {
    if (event.target.className === "card") {  // card is closed if classlist does not have open, show, match attributes
        showCards(event);                     // program does nothing unless user clicks on an a closed card
        countMoves();
        if (numberOfMoves === 1) { // when the very first card is opened, start the game timer
            gameTimer = setInterval(startGameTimer, 1000);  // timer interval in millisecond
        }
        // when 2 cards are opened, check if they match
        // note: if user clicks too fast and opens more than 2 cards, only the first 2 are evaluated
        if (openCards.length >= 2) {
            matchCards(event);
            openCards = [];  //clear openCard tracker
        }
    }
}

// count every valid click. only clicks made on a closed card counts. remove stars as the click count gets larger
function countMoves() {
    numberOfMoves += 1;
    movesCounter.innerHTML = numberOfMoves;
    switch (true) {
        case (numberOfMoves > 55):
            star[0].style.opacity = 0.1;
            break;
        case (numberOfMoves > 40):
            star[1].style.opacity = 0.1;
            break;
        case (numberOfMoves > 25):
            star[2].style.opacity = 0.1;
    }

}

// tracks how long the game is played
function startGameTimer() {
    sec += 1;
    if (sec === 60) {
      min += 1;
      sec = 0;
    }

    timer[0].innerHTML = ("Timer: " + min + "min " + sec + "sec")
}

// stop the game timer
function stopGameTimer() {
  clearInterval(gameTimer);
}

// initialize game parameters and start a new game
function initGame () {
    var cardElements = document.querySelectorAll(".card"),
        shuffledCards = shuffle(cardElements);

    stopGameTimer();  // stop game timer if game is reset before it is completed
    min = 0;
    sec = 0;
    timer[0].innerHTML = ("Timer: " + min + "min " + sec + "sec");
    matchedPairs = 0;   //reset match pair counter
    numberOfMoves = 0;  //reset click or move counter
    movesCounter.innerHTML = numberOfMoves;

    // reset game stars
    for (let i =0; i < star.length; i++) {
        star[i].style.opacity = 1;
    }

    // reset card grid
    modal.style.display = "none";
    container.style.display = "flex";
    while (deckTable.hasChildNodes()) {
      deckTable.removeChild(deckTable.lastChild);
    }

    // repopulate the card grid with shuffled cards
    shuffledCards.forEach(function(element) {
        deckTable.appendChild(element);
    });
}

// end of game stats
function displayAccolades () {
    container.style.display = "none";
    modalText.innerHTML = ("<b>Congatulations!!!</b> <br><br>You completed the game in <br>" +
    numberOfMoves + " moves with a time of " + min +"min " + sec + "sec <br><br>");
    playAgainButton.innerHTML = "Play Again!";
    modalText.appendChild(playAgainButton);
    modal.style.display = "block";
}

// all hidden matching pairs are opened - end of game
function endGame() {
    stopGameTimer();
    setTimeout(displayAccolades, 200);
}

// initialize game
initGame();

// click event listener for the reset game icon
restart.addEventListener('click', function(event) {
  event.preventDefault();
  initGame()});

// click event listener when a card is clicked
deckTable.addEventListener('click', function(event) {cardClicked(event)});

// click event listener for play again button
playAgainButton.addEventListener('click', initGame);
