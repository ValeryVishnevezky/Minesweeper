'use strict'

const mine = '💣'
const flag = '🚩'

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
    const cells = document.querySelectorAll('.cell')
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener('contextmenu', function(event) {
            event.preventDefault()
            onCellMarked(cells[i])
        })
    }
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
            var cell = board[i][j]
            var cellClass = getClassName({ i, j })

            var cellContent = ''
            if (cell.isShown) {
                 if (cell.minesAroundCount > 0) {
                    cellContent = cell.minesAroundCount
                }
            }
            if (cell.isMarked) return
            strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})">${cellContent}</td>`
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}


function getClassName(location) {
    const cellClass = `cell-${location.i}-${location.j}`
    return cellClass
}


function onCellClicked(elCell, i, j) {
    console.log('Clicked cell:', i, j)
    if (!gGame.isOn) return
    if (gGame.firstClick) {
        gGame.firstClick = false
        addMines(gBoard, gLevel)
    }
    const cell = gBoard[i][j]
    if (cell.isShown) return
    if (cell.isMarked) return

    cell.isShown = true
    elCell.classList.add('open')

    if (cell.isMine) {
        elCell.querySelector('.mine').classList.remove('hide')
        setInterval(() => {
            gameOver(false)
            return
        }, 100)
    }
    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    } else {
        elCell.innerHTML = cell.minesAroundCount
        setMinesNegsCount(gboard)
    }
    gGame.shownCount++
    // checkGameOver()
}

function addMines(board, gLevel) {
    if (gGame.firstClick === false) {
        const cells = []
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                cells.push({ i, j })
            }
        }
        var minesPlaced = 0
        while (minesPlaced < gLevel.MINES) {
            const randIdx = getRandomInt(0, cells.length)
            var currCell = cells[randIdx]
            board[currCell.i][currCell.j].isMine = true
            minesPlaced++
            cells.splice(randIdx, 1)

            var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)
            elCell.innerHTML = `<span class="mine">${mine}</span>`
            elCell.querySelector('.mine').classList.add('hide')
        }
    } else return
    setMinesNegsCount(board)
}



function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            if (board[i][j].isMine) continue
            board[i][j].minesAroundCount = minesAroundCount(board, i, j)
        }
    }
}

function minesAroundCount(board, i, j) {
    var minesCount = 0
    for (var row = i - 1; row <= i + 1; row++){
        for (var col = j - 1; col <= j + 1; col++) {
            if (row < 0 || row >= board.length ||
                 col < 0 || col >= board[0].length ||
                  (row === i && col === j)) continue
            if (board[row][col].isMine) {
                minesCount++
            }
        }
    }
    return minesCount
}


function onCellMarked(elCell) {
var cellClass = elCell.classList

if (cellClass.contains('flag')) {
    cellClass.remove('flag')
    elCell.innerHTML = ''
} else {
    cellClass.add('flag')
    elCell.innerHTML = flag
}
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



function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}


