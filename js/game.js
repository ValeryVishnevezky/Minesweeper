'use strict'

const FLOOR = 'FLOOR'

//A Matrix containing cell objects: Each cell:
var gBoard = {
    isShown: false,
    isMine: false,
    isMarked: true,
    minesAroundCount: 4,
}

var gLevel = {
    SIZE: 4,
    MINES: 2,
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    firstClick: true,
}

function onInit() {
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
    console.log(gBoard)
}

function buildBoard() {
    const rowCount = gLevel.SIZE
    const colCount = gLevel.SIZE
    const board = []
    for (var i = 0; i < rowCount; i++) {
        board[i] = []
        for (var j = 0; j < colCount; j++) {
            const cell = {
                isShown: false,
                isMine: false,
                isMarked: false,
                minesAroundCount: 0,
                type: FLOOR,
                gameElement: null
            }
            board[i][j] = cell
        }
    }
    return board
}


function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            const currCell = board[i][j]
            var cellClass = getClassName({ i, j }) + ' '
            cellClass += (currCell.type === FLOOR) ? 'floor' : ''
            strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function renderCell(location, value) {
    const cellSelector = '.' + getClassName(location) 
    const elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`
    return cellClass
}


function onCellClicked(elCell, i, j) {
    console.log('Clicked cell:', i, j)

    if (!gGame.isOn) return

    const cell = gBoard[i][j]
 
    if (cell.isShown) return

    cell.isShown = true
    elCell.classList.add('open')

    if (cell.isMine) {
        gameOver(false)
        return
    }

    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    } else {
        elCell.innerHTML = cell.minesAroundCount
    }

    gGame.shownCount++
    checkGameOver()
}



function onCellMarked(elCell) {

 }



function expandShown(board, elCell, i, j) {

}






function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.MINES) {
        gameOver(true)
    }
}


function gameOver(isWin) {
    gGame.isOn = false
    const msg = isWin ? 'You Win!' : 'Game Over!'
    alert(msg)

}
