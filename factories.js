/******** UI Vars ********/

const newGameBtn = document.querySelector('#new-game-btn');
const gameBoxContainer = document.querySelector('.game-box-container');
const gameInfo = document.querySelector('.game-info');
const gameBoxes = Array.from(document.querySelectorAll('.game-box'));//array from zero to eight of each of the boxes
const gamePiece = ['blue', 'green']; //if changing array, update css class names also!

/******** Global Vars ********/

gameInfo.style.display = 'none';
let freeSpaces = gameBoxes.filter(e => !e.classList.contains('selected'));
let selectBoxes = [];
const winningPatterns = [
  '123',
  '147',
  '159',
  '258',
  '357',
  '369',
  '456',
  '789'
];

/******** Objects ********/

const GameBoard =( () => {
  const start = () => {
	gameBoxContainer.addEventListener('click', GameBoard.addMark);
    newGameBtn.style.display = 'none';
    selectBoxes = [];
    gameBoxes.forEach(box => {
      box.classList.remove('blue', 'green', 'selected');
	  box.style.transition = 'background 0.3s';
    });

    // set message "blue's Turn"
    gameInfo.style.display = 'inline';
    gameInfo.innerText = `${gamePiece[0]}'s Turn`;
  };

  function addMark(e) {
    // verify that target is in the gamebox, and that new-game button has been clicked
    if (!e.target.classList.contains('game-box') || newGameBtn.style.display !== 'none') {
      return;
    }
    
	// verify that box hasn't already been used
    if (!e.target.classList.contains('selected')) {
      // add 'selected' class to clicked box and gamePiece class
      let box = e.target;
      box.classList.add('selected');
      box.classList.add(gamePiece[0]);

      // switch piece used
      usedPiece = gamePiece.shift();
      gamePiece.push(usedPiece);
      gameInfo.innerText = `${gamePiece[0]}'s Turn`;
	  
	  selectBoxes.push(parseInt(e.target.classList[1]));
      selectBoxes.sort();
	  // check if game over
	  let oCombos = GameController.getCombinations(selectBoxes);
	  GameController.findMatch(oCombos, winningPatterns); //if oCombos have a winningPattern then gamePiece[0] has won
    }
  }

  return { start, addMark };
}) ();

const GameController = (() => {
  // Check for winner by finding out if one array(of positions marked) contains a value found in another array(of winningPatterns)
  function findMatch(aryOne, aryTwo) {
    for (i = 0; i < aryOne.length; i++) {
      for (j = 0; j < aryTwo.length; j++) {
        // comparing two strings both of length 3.
        if (aryOne[i] == aryTwo[j]) {
          gameOver();
        }
      }
    }
  }

  
  // get every possible 3-digit combination of every element in array 
  function getCombinations(chars) {
    let result = [];
    let f = function(prefix, chars) {
      for (let i = 0; i < chars.length; i++) {
        result.push(prefix + chars[i]);
        f(prefix + chars[i], chars.slice(i + 1)); //1st call is f('',[1,2,3,4]) 2nd is f('1', [2,3,4]) 4th is f('123', [4])
      }
    };
    f('', chars);
    filteredResult = result.filter(function(e){return e.length == 3;}); //delete all array elements whose length is not 3.
    return filteredResult; //eg: [1,2,3,4] returns ['123', '124', '134', '234']
  }

  function gameOver() {
    gameInfo.innerText = `${gamePiece[0]} is the winner!`;
    replay();
  }

  function replay() {
    // disable input of gameBoxes (removeEventListener)
	gameBoxContainer.removeEventListener('click', GameBoard.addMark);
	gameBoxes.forEach(box => {
		box.classList.add('selected'); //workaround to disable css onHover animations
    });
    setTimeout(() => {
      gameInfo.style.display = 'none';
      newGameBtn.style.display = 'inline';
    }, 2000); //after 2 seconds, previous game results are gone and new game button is displayed.
  }

  return { findMatch, getCombinations, gameOver, replay };
})();

/******** Event Listeners ********/

newGameBtn.addEventListener('click', GameBoard.start);
//another event listener for GameBoard is initiated in GameBoard.start()

