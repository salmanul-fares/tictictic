/** AI for single player games **/
//to be appended to factories.js

function AI_play(Board, WinningCombos, ai_level){
	switch(ai_level){
		case 1: return babyAI(Board);
		case 2: return manAI(Board, WinningCombos);
		case 3: return godAI(Board, WinningCombos);
	}
}

function babyAI(Board){
	play_pos = 1;
	while(Board.indexOf(play_pos)==-1){
		play_pos = Math.random()*9 + 1;
	}
	return play_pos;
}

function manAI(Board, WinningCombos){
	return 0;
}

function godAI(Board, WinningCombos){
	return 0;
}
