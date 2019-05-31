let timeAtStart;
let interval;
let time;
let table;
let startButton;
let timeElapsedDisplayFormat;

// the game works correctly only with even number of cells
const nbCellsX = 4;
const nbCellsY = 4;

let randomColors = [];

let foundCells = [];
let pressedCells = [];

let gamePaused = false;
let gameStarted = false;

// fills the table with empty cells
function fillTable() {
	let k = 0;
	for (let i = 0; i < nbCellsY; i++) {
		const row = document.createElement('tr');
		for (let j = 0; j < nbCellsX; j++) {
			const cell = document.createElement('td');
			cell.setAttribute('id', k); // sets a unique id which will match the index of the color in randomColors array
			cell.setAttribute('onclick', 'openCell(this)');
			row.appendChild(cell);
			k++;
		}
		table.appendChild(row);
	}
}

// initialises the game for the first time
function init() {
	table = document.getElementById('table');
	time = document.getElementById('time');
	startButton = document.getElementById('startButton');
	fillTable();
}

// cleans the table
function tableClean() {
	while (table.firstChild) {
		table.removeChild(table.firstChild);
	}
}

// mixes up an array
function shuffle(arrayP) {
	const array = [...arrayP];
	for (let i = array.length - 1; i > 0; i -= 1) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// return an array consisting of randomly distributed random colors (one color for a pair of cells)
function generateRandomColors(nb) {
	let randColors = [];
	for (let i = 0; i < nb; i++) {
		const rc = randomColor();
		randColors.push(rc);
		randColors.push(rc);
	}
	randColors = shuffle(randColors);
	return randColors;
}

// generates a new game with random colors
function generateGame() {
	const nbColors = Math.trunc((nbCellsY * nbCellsX) / 2);
	randomColors = generateRandomColors(nbColors);
}

// returns time in appropriate format (minmin:ss.msmsms)
function displayFormat(minP, sP, msP) {
	let min = minP;
	let s = sP;
	let ms = msP;
	if (min < 10) {
		min = `0${min}`;
	}
	if (s < 10) {
		s = `0${s}`;
	}
	if (ms < 10) {
		ms = `00${ms}`;
	} else {
		if (ms < 100) {
			ms = `0${ms}`;
		}
	}
	return `${min}:${s}.${ms}`;
}

// updates and displays time
function timeUpdate() {
	const timeNow = new Date();
	const timeElapsed = new Date(timeNow - timeAtStart);
	const min = timeElapsed.getUTCMinutes();
	const s = timeElapsed.getUTCSeconds();
	const ms = timeElapsed.getUTCMilliseconds();
	timeElapsedDisplayFormat = displayFormat(min, s, ms);
	time.innerHTML = timeElapsedDisplayFormat;
}

// starts the stopwatch
function timeStart() {
	timeAtStart = new Date();
	interval = setInterval(timeUpdate, 1);
}

// starts the game
function gameStart() {
	gameStarted = true;
	startButton.style.visibility = 'hidden';
	generateGame();
	timeStart();
}

// generates a random color in RGB string format
function randomColor() {
	const randomR = Math.floor(Math.random() * 256);
	const randomG = Math.floor(Math.random() * 256);
	const randomB = Math.floor(Math.random() * 256);
	return `RGB(${randomR},${randomG},${randomB})`;
}

// called when the user clicks on a cell
function openCell(cell) {
	if (gameStarted && !gamePaused) {
		if (foundCells.indexOf(cell) === -1 && pressedCells.indexOf(cell) === -1) {
			cell.style.background = randomColors[cell.id];
			pressedCells.push(cell);
			if (pressedCells.length === 2) {
				if (pressedCells[0].style.background === pressedCells[1].style.background) {
					foundCells.push(pressedCells.pop());
					foundCells.push(pressedCells.pop());
				} else {
					pressedCellsBadMatch(); // the pressed cells don't match, so we call this function
				}
			}
		}
	}
	if (foundCells.length === nbCellsX * nbCellsY) {
		clearInterval(interval);
		setTimeout(gameFinished, 100);
	}
}

// gives 500ms to the user to remember the colors, and after makes the pressed cells white again
function pressedCellsBadMatch() {
	gamePaused = true;
	setTimeout(() => {
		pressedCells[0].style.background = 'transparent';
		pressedCells[1].style.background = 'transparent';
		pressedCells = [];
		gamePaused = false;
	}, 500);
}

// reinitialises the game so it can be played one more time
function clearGame() {
	tableClean();
	init();
	foundCells = [];
	startButton.style.visibility = 'visible';
	gameStarted = false;
	time.innerHTML = '00:00.000';
}

function gameFinished() {
	alert(`Вы выиграли!\nЗатраченное время: ${timeElapsedDisplayFormat}`);
	clearGame();
}
