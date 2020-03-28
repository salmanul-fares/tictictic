/******** UI Vars ********/

const newGameBtn = document.querySelector('#new-game-btn');
const gameBoxContainer = document.querySelector('.game-box-container');
const gameInfo = document.querySelector('.game-info');
const gameBoxes = Array.from(document.querySelectorAll('.game-box')); //array from zero to eight of each of the boxes
const gamePiece = ['blue', 'green']; //if changing array, update css class names also!
const blueScore = document.querySelector('#bscore');
const greenScore = document.querySelector('#gscore');

/******** Global Vars ********/

gameInfo.style.display = 'none';
let selectBoxes = []; //obtain freeSpaces as gameBoxes.filter(e => !e.classList.contains('selected'))
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
var points = {blue:0, green:0};

/******** Objects ********/

const GameBoard = (() => {
  const start = () => {
    gameBoxContainer.addEventListener('click', GameBoard.addMark);
    newGameBtn.classList.add('disappear');
    newGameBtn.removeEventListener('click', GameBoard.start);
    gameBoxContainer.classList.add('appear');
    selectBoxes = [];
    gameBoxes.forEach(box => {
      box.classList.remove('blue', 'green', 'selected');
    });
    gameInfo.classList.remove('blue','green', 'winner');


    //make last game's loser play first in next game
    usedPiece = gamePiece.shift();
    gamePiece.push(usedPiece);

    gameInfo.style.display = 'inline';
    gameInfo.classList.add('change');
    setTimeout(function() {
      gameInfo.classList.add(gamePiece[0]);
      // gameInfo.innerText = `${gamePiece[0]}'s Turn`
    }, 100);
    setTimeout(function() {
      gameInfo.classList.remove('change')
    }, 200);

  };

  function addMark(e) {
    // verify that target is in the gamebox, and that new-game button has been clicked
    if (!e.target.classList.contains('game-box') || newGameBtn.classList.contains('dissappear')) {
      return;
    }

    // verify that box hasn't already been used
    if (!e.target.classList.contains('selected')) {
      // add 'selected' class to clicked box and gamePiece class
      let box = e.target;
      box.classList.add(gamePiece[0]);
      box.classList.add('selected');

      // switch piece used
      usedPiece = gamePiece.shift();
      gamePiece.push(usedPiece);

      gameInfo.classList.add('change');
      setTimeout(function() {
        gameInfo.classList.remove(gamePiece[1]);
        gameInfo.classList.add(gamePiece[0]);
      }, 100);
      setTimeout(function() {
        gameInfo.classList.remove('change')
      }, 200);

      selectBoxes.push(parseInt(e.target.classList[1]));
      selectBoxes.sort();
      // check if game over
      let oCombos = GameController.getCombinations(selectBoxes);
      GameController.findMatch(oCombos, winningPatterns); //if oCombos have a winningPattern then gamePiece[0] has won
    }
  }

  return {
    start,
    addMark
  };
})();

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
    filteredResult = result.filter(function(e) {
      return e.length == 3;
    }); //delete all array elements whose length is not 3.
    return filteredResult; //eg: [1,2,3,4] returns ['123', '124', '134', '234']
  }

  function gameOver() {
    gameInfo.classList.add('change');
    setTimeout(function() {
      // gameInfo.innerText = `${gamePiece[0]} wins`
      gameInfo.classList.add('winner');
      gameInfo.classList.add(gamePiece[0]);
      gameInfo.classList.remove(gamePiece[1]);
    }, 100);
    setTimeout(function() {
      gameInfo.classList.remove('change');
      points[gamePiece[0]] += 1;
      document.querySelector('.blu').style.opacity='1';
      document.querySelector('.grn').style.opacity='1';
      blueScore.innerText = points['blue'];
      greenScore.innerText = points['green'];
    }, 200);


    replay();
  }

  function replay() {

    gameBoxContainer.removeEventListener('click', GameBoard.addMark);
    newGameBtn.addEventListener('click', GameBoard.start);

    gameBoxes.forEach(box => {
      box.classList.add('selected'); //workaround to disable css onHover animations
    });
    setTimeout(() => {
      newGameBtn.classList.remove('disappear');
    }, 1000); //after 1 second, new game button is displayed.
  }

  return {
    findMatch,
    getCombinations,
    gameOver,
    replay
  };
})();

/******** Event Listeners ********/

newGameBtn.addEventListener('click', GameBoard.start);
//another event listener for GameBoard is initiated in GameBoard.start()
