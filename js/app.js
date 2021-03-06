var openCards = [];
var matches = 0;
var moves = 0;
var moveCounter = document.querySelector('.moves');
var matchCounter = document.querySelector('.matches');
var starContainer = document.querySelector('.stars');
var starCount = 3;

// State for timer
var minutesLabel = document.getElementById("minutes");
var secondsLabel = document.getElementById("seconds");
var totalSeconds = 0;

/*
* Create a list that holds all of your cards
*/
var cardList = ['fa-diamond','fa-diamond','fa-paper-plane-o','fa-paper-plane-o',
'fa-anchor','fa-anchor','fa-bolt','fa-bolt','fa-cube','fa-cube','fa-leaf','fa-leaf',
'fa-bicycle','fa-bicycle','fa-bomb','fa-bomb'];

function newCard(card) {
  return `<li class="card" data-card="${card}"><i class="fa ${card}"></i></li>`;
}

/*Open modal box when game is over*/
// Get the modal
var modal = document.getElementById('modalBox');
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the modal
var clickyes = document.getElementById('playagain');
// Get the modal
var clickno = document.getElementById('quitgame');
// Open modal function
function gameOver(){
  modal.style.display = "block";
  stopTimer();

  document.querySelector("#congrats-text").innerHTML = `
    <p>Congratualations! You have won.</p>
    <p>Game duration was ${minutesLabel.innerText} minutes and ${secondsLabel.innerText} seconds.</p>
    <p>Star count is ${starCount}.</p>
    <p>Do you want to play again?</p>
  `;
}
// When the user clicks on span x, close the modal
span.onclick = function() {
    modal.style.display = "none";
}

clickno.addEventListener('click', function() {
  modal.style.display = "none";
});

clickyes.addEventListener('click', function() {
  newGame();

  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
/*clickyes.onclick = function() {
      //modal.style.display = "none";
    }*/
}

//Create timer
var timer = setInterval(setTime, 1000);

function setTime() {
  ++totalSeconds;
  secondsLabel.innerHTML = pad(totalSeconds % 60);
  minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

//Stop timer
function stopTimer() {
    clearInterval(timer);
}

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/

function showStars(numberOfStars) {
  var starItems = "";

  for (var i = 0; i < numberOfStars; i++) {
    starItems += "<li><i class='fa fa-star'></i></li>";
  }

  return starItems;
}

function newGame(){
  totalSeconds = 0;

  var deck = document.querySelector('.deck');
  var cardHTML = shuffle(cardList).map(function(card){
    return newCard(card);
  });
  moves = 0;
  matches = 0;
  moveCounter.innerText = moves;
  matchCounter.innerText = matches;
  deck.innerHTML = cardHTML.join('');
  setTime();

  starCount = 3;
  starContainer.innerHTML = showStars(starCount);

  var allCards = document.querySelectorAll('.card');

  allCards.forEach(function(card){
    card.addEventListener('click',function(e){
      if (!card.classList.contains('open') &&
      !card.classList.contains('show') &&
      !card.classList.contains('match')){

        openCards.push(card);
        card.classList.add('open','show');

        if (openCards.length ==2){
          if (openCards[0].dataset.card == openCards[1].dataset.card){
            openCards[0].classList.add('match');
            openCards[0].classList.remove('open');
            openCards[0].classList.remove('show');
            openCards[1].classList.add('match');
            openCards[1].classList.remove('open');
            openCards[1].classList.remove('show');
            openCards = [];
            matches = matches + 2;
          } else {
            setTimeout(function(){
              openCards.forEach(function(card){
                card.classList.remove('open','show');
              });
              openCards = [];
            }, 1000);
          }

          // At this point, we have made a valid move
          moves += 1;
          moveCounter.innerText = moves;
          matchCounter.innerText = matches;

          //Reduce number of stars if move count reaches certain level. Determine how to remove star
          if (moves >= 6 && moves < 10) {
            starCount = 2;
          } else if (moves >= 10){
            starCount = 1;
          }

          starContainer.innerHTML = showStars(starCount);

          /*Condition to show when game is over*/
          if (matches === 16){
            gameOver();
          }
        }
      }
    });
  });
}

newGame();

//Create function to reset game if button is pressed
var reset = document.querySelector('.restart');
reset.addEventListener('click', newGame);
