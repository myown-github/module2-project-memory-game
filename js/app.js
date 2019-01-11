
let container = document.querySelector(".container"),
    deckTable = document.querySelector(".deck"),
    restart = document.querySelector(".restart"),
    movesCounter = document.querySelector(".moves"),
    totalMoves = document.getElementById("totalMoves"),
    totalMin = document.getElementById("totalMin"),
    totalSec = document.getElementById("totalSec"),
    totalStars = document.getElementById("totalStars"),
    star = document.getElementsByClassName("fa fa-star"),
    timer = document.getElementsByClassName("fa fa-timer"),
    modal = document.querySelector(".modal"),
    modalText = document.querySelector(".modal-text"),
    playAgain = document.getElementById("playAgain"),
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
    let currentIndex = array.length,
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
    //save cards so we can compare them if they match
    openCards.push(event.target);
}

// close mismatch cards
function closeCards(event) {
    openCards.forEach(function(element) {
      let defaultBgColor = element.style.backgroundColor;

      // highlight mismatch cards
      element.style.backgroundColor = "#DC143C";

      // set delay timer (milliseconds) before closing mismatch cards
      setTimeout(function() {
          element.classList.remove("open", "show");
          element.style.backgroundColor = defaultBgColor;
      }, 800);
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
        //cards matched, keep both cards open
        lockCards(event);
    } else {
        // card don't match, close both cards
        closeCards(event);
      }
}

// a card is clicked
function cardClicked() {
    /* card is closed if classlist does not have open, show, match attributes.
    program does nothing unless user clicks on an a closed card */
    if (event.target.className === "card") {
        showCards(event);
        countMoves();
        // when the very first card is opened, start the game timer. timer interval in millisecond.
        if (numberOfMoves === 1) {
            gameTimer = setInterval(startGameTimer, 1000);
        }
        /* when 2 cards are opened, check if they match
        note: if user clicks too fast and opens more than 2 cards, only the first 2 are evaluated */
        if (openCards.length >= 2) {
            matchCards(event);
            //clear openCard tracker
            openCards = [];
        }
    }
}

/* count every valid click. only clicks made on a closed card counts.
remove stars as the click count gets larger */
function countMoves() {
    numberOfMoves += 1;
    movesCounter.innerHTML = numberOfMoves;
    switch (numberOfMoves) {
        case 40:
            star[1].style.opacity = 0.1;
            break;
        case 25:
            star[2].style.opacity = 0.1;
            break;
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
    let cardElements = document.querySelectorAll(".card"),
        shuffledCards = shuffle(cardElements);

    // stop game timer if game is reset before it is completed
    stopGameTimer();
    // reset counters and temporary variables
    min = 0;
    sec = 0;
    timer[0].innerHTML = ("Timer: " + min + "min " + sec + "sec");
    matchedPairs = 0;
    numberOfMoves = 0;
    movesCounter.innerHTML = numberOfMoves;

    // reset game stars
    star[1].style.opacity = 1;
    star[2].style.opacity = 1;

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
    let stars = document.querySelector(".stars").innerHTML;

    container.style.display = "none";
    totalMoves.innerHTML = numberOfMoves;
    totalMin.innerHTML = min;
    totalSec.innerHTML = sec;
    totalStars.innerHTML = stars;
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
playAgain.addEventListener('click', initGame);
