'use strict'

/////////////////////////////////////////////////////////////////////////////////////////////
//Stater function
var gGame = {
	score: 0,
	isOn: false,
	foodCount: 0,
}

function init() {
	gGame.isOn = true
	gGame.foodCount = 0
	gGame.score = 0

	gBoard = buildBoard()
	createPacman(gBoard)
	createGhosts(gBoard)

	renderBoard(gBoard)
	gCherryInterval = setInterval(createCherry, 15000)

	document.querySelector('.modal').classList.toggle('hide')
}

/////////////////////////////////////////////////////////////////////////////////////////////
//Building a board

function buildBoard() {
	const SIZE = 10
	const board = []

	for (var i = 0; i < SIZE; i++) {
		board.push([])
		for (var j = 0; j < SIZE; j++) {
			if (isCorner(i, j, SIZE)) {
				board[i][j] = POWER_FOOD
			} else {
				board[i][j] = FOOD
			}
			if (i === 0 || i === SIZE - 1 || j === 0 || j === SIZE - 1 || (j === 3 && i > 4 && i < SIZE - 2)) {
				board[i][j] = WALL
			}
		}
	}
	return board
}

/////////////////////////////////////////////////////////////////////////////////////////////
//Rendering a board


function renderBoard(board) {
	var strHTML = ''

	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>'
		for (var j = 0; j < board[0].length; j++) {
			var cell = board[i][j]
			var className = `cell cell-${i}-${j}`
			strHTML += `<td class="${className}">${cell}</td>`
		}
		strHTML += '</tr>'
	}
	var elBoard = document.querySelector('.board-container tbody')
	elBoard.innerHTML = strHTML
}


/////////////////////////////////////////////////////////////////////////////////////////////
//Update score


function updateScore(value) {
	// Update both the model and the dom for the score
	gGame.score += value
	document.querySelector('header h3 span').innerText = gGame.score
}

/////////////////////////////////////////////////////////////////////////////////////////////
//

function createMat(ROWS, COLS) {
    const mat = []
    for (var i = 0; i < ROWS; i++) {
        const row = []
        for (var j = 0; j < COLS; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
  }