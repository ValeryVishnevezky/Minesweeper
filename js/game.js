'use strict'

const mine = '💣'
const flag = '🚩'

//A Matrix containing cell objects: Each cell:
var gBoard = []

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
            strHTML += `<td class="cell ${cellClass}" onclick="onCellClicked(this, ${i}, ${j})"oncontextmenu="onCellMarked(this, ${i}, ${j}); return false;">${cellContent}</td>`
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
    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked) return
    if (gGame.firstClick) {
        gGame.firstClick = false
        gBoard = buildBoard()
        addMines(gBoard, gLevel, i, j)
    }
    cell.isShown = true
    elCell.classList.add('open')
    if (cell.isMine) {
        elCell.querySelector('.mine').classList.remove('hide')
        gameOver(false)
        return
    }
    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    } else {
        elCell.innerText = cell.minesAroundCount
    }
    gGame.shownCount++
    console.log('gGame.shownCount', gGame.shownCount)
    checkGameOver()
}

function addMines(board, gLevel, firstClickI, firstClickJ) {
    const cells = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (i !== firstClickI || j !== firstClickJ) {
                cells.push({ i, j })
            }
        }
    }
    console.log('Cells available for mines:', cells)

    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        const randIdx = getRandomInt(0, cells.length)
        var currCell = cells[randIdx]
        board[currCell.i][currCell.j].isMine = true
        minesPlaced++
        cells.splice(randIdx, 1)
        console.log(`Mine at (${currCell.i}, ${currCell.j})`, board[currCell.i][currCell.j])

        var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)
        elCell.innerHTML = `<span class="mine">${mine}</span>`
        elCell.querySelector('.mine').classList.add('hide')
    }
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
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (row < 0 || row >= board.length ||
                col < 0 || col >= board[0].length) continue
            var cell = board[row][col]
            if (cell.isMine) {
                minesCount++
            }
        }
    }
    console.log(`Cell (${i}, ${j})`, 'Mines count:', minesCount)
    return minesCount
}

function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    var cellClass = elCell.classList
    if (cell.isMarked) {
        cellClass.remove('marked')
        elCell.innerText = ''
        cell.isMarked = false
        gGame.markedCount--
    } else {
        cellClass.add('marked')
        elCell.innerText = flag
        cell.isMarked = true
        gGame.markedCount++
    }
    console.log('gGame.markedCount', gGame.markedCount)
    console.log('Cell isMarked', cell.isMarked)
    console.log('Cell content:', elCell.innerText)
    console.log('The cell class', cellClass)
}

function expandShown(board, elCell, i, j) {
    // const cell = board[i][j]
    // if (cell.isShown || cell.isMarked) return
    // cell.isShown = true
    // elCell.classList.add('open')
    // elCell.innerText = cell.minesAroundCount

    // for (var row = i - 1; row <= i + 1; row++) {
    //     for (var col = j - 1; col <= j + 1; j++) {
    //         if (row >= 0 && row < board.length && col >= 0 && col < board.length) {

    //             openEmptyNeighbors(board, row, col)
    //         }
    //     }
    // }
}


function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
        gameOver(true)
    }
}


function gameOver(isWin) {
    gGame.isOn = false
    // TO DO: add cells opening to show all the mine
    const msg = isWin ? 'You Win!' : 'Game Over!'
    alert(msg)
}



function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}
