'use strict'

const mine = '💣'
const flag = '🚩'
var timerInterval
const soundWin = new Audio('sound/win.mp3')
const soundLose = new Audio('sound/lose.mp3')

var gBoard = []
var gMines = []

var gLevel = {
    SIZE: 9,
    MINES: 5,
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
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.firstClick = true
    resetTimer()
    markedCount(gGame.markedCount)
    gBoard = buildBoard()
    renderBoard(gBoard)
    const elButton = document.querySelector('.button')
    elButton.textContent = '😊'
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
    // console.log('Clicked cell:', i, j)
    if (!gGame.isOn) return
    const cell = gBoard[i][j]
    if (cell.isShown || cell.isMarked) return
    if (gGame.firstClick) {
        timer()
        gGame.firstClick = false
        addMines(gBoard, gLevel, i, j)
    }
    if (cell.isMine) {
        elCell.querySelector('.mine').classList.remove('hide')
        gameOver(false)
        return
    }
    if (cell.minesAroundCount === 0) {
        expandShown(gBoard, elCell, i, j)
    } else {
        cell.isShown = true
        elCell.classList.add('open')
        gGame.shownCount++
        elCell.innerText = cell.minesAroundCount
    }
    // console.log('gGame.shownCount', gGame.shownCount)
    checkGameOver()
}

function expandShown(board, elCell, i, j) {
    const cell = board[i][j]
    if (cell.isShown || cell.isMarked) return
    cell.isShown = true
    elCell.classList.add('open')
    gGame.shownCount++
    if (cell.minesAroundCount > 0) {
        elCell.innerText = cell.minesAroundCount
        return
    } else {
        elCell.innerText = ''
    }
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (row >= 0 && row < board.length && col >= 0 && col < board.length && (row !== i || col !== j)) {
                const neighborCell = board[row][col]
                const neighborEl = document.querySelector(`.cell-${row}-${col}`)
                if (!neighborCell.isShown && !neighborCell.isMarked) {
                    expandShown(board, neighborEl, row, col)
                }
            }
        }
    }
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
    // console.log('Cells available for mines:', cells)

    var minesPlaced = 0
    while (minesPlaced < gLevel.MINES) {
        const randIdx = getRandomInt(0, cells.length)
        var currCell = cells[randIdx]
        board[currCell.i][currCell.j].isMine = true
        gMines.push(currCell)
        minesPlaced++
        cells.splice(randIdx, 1)
        console.log('Mine at', currCell.i, currCell.j, board[currCell.i][currCell.j])

        var elCell = document.querySelector(`.cell-${currCell.i}-${currCell.j}`)
        elCell.innerHTML = `<span class="mine hide">${mine}</span>`
        // elCell.querySelector('.mine').classList.add('hide')
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
    // console.log('Cell', i, j, 'Mines count:', minesCount)
    return minesCount
}

function onCellMarked(elCell, i, j) {
    const cell = gBoard[i][j]
    var cellClass = elCell.classList
    if (!cell.isShown) {
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
    }
    checkGameOver()
    markedCount(gGame.markedCount)
    // console.log('gGame.markedCount', gGame.markedCount)
    // console.log('Cell isMarked', cell.isMarked)
    // console.log('Cell content:', elCell.innerText)
    // console.log('The cell class', cellClass)
}

function revealMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            const cell = board[i][j]
            const elCell = document.querySelector(`.cell-${i}-${j}`)
            if (cell.isMine) {
                const mineIcon = elCell.querySelector('.mine')
                mineIcon.classList.remove('hide')
                elCell.classList.add('open')
            }
        }
    }
}

function checkGameOver() {
    if (gGame.shownCount + gGame.markedCount === gLevel.SIZE ** 2) {
        gameOver(true)
    }
}

function gameOver(isWin) {
    gGame.isOn = false
    stopTimer()
    if (!isWin) {
        soundLose.play()
        revealMines(gBoard)
        document.querySelector('.button').textContent = '😫'
    } else {
        soundWin.play()
        document.querySelector('.button').textContent = '🥳'
    }
}

function markedCount(count) {
    document.querySelector('.marked-count').textContent = count
}

function timer() {
    timerInterval = setInterval(() => {
        gGame.secsPassed++
        document.querySelector('.timer').textContent = gGame.secsPassed
    }, 1000)
}

function stopTimer() {
    clearInterval(timerInterval)
    timerInterval = null
}

function resetTimer() {
    gGame.secsPassed = 0
    document.querySelector('.timer').textContent = gGame.secsPassed
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}


