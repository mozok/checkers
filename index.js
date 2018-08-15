class Checker {
    constructor(id, color, posX, posY) {
        this.id = id;
        this.color = color;
        this.posX = posX;
        this.posY = posY;

        this.name = color + id;
        this.isKing = false;
    }
}

var boardMatrix = [];
var checkersBlackCount = 0;
var checkersWhiteCount = 0;
var currentMove = 'w';
var turnCount = 0;
var currentChecker = null;
var checkerToCapture = null;
var isEnd = false;
var mandatoryCaptureFlag = false;

var startButton = document.querySelector('#startButton');

startButton.addEventListener('click', function () {
    startButton.nextElementSibling.innerHTML = '';

    let boardSize = document.querySelector('#boardSize').value;

    if ((boardSize < 8 || boardSize > 64) || ((boardSize % 2) != 0)) {
        startButton.nextElementSibling.innerHTML = 'Wrong Number';
    } else {
        createGame(boardSize);
    }
});

function turnRoutine() {
    currentChecker = null;
    checkerToCapture = null;

    if (turnCount != 0) {
        if (currentMove === 'w') currentMove = 'b';
        else currentMove = 'w';
    }

    turnCount++;

    document.querySelector('#currentMove').innerHTML = currentMove;
    document.querySelector('#turnCount').innerHTML = turnCount;
    document.querySelector('#whiteCheckersCount').innerHTML = checkersWhiteCount;
    document.querySelector('#blackCheckersCount').innerHTML = checkersBlackCount;

    if (checkersBlackCount === 0 || checkersWhiteCount === 0) {
        isEnd = true;
        let winner = (checkersBlackCount === 0) ? 'w' : 'b';

        document.querySelector('#winner').innerHTML = 'The winner is: ' + winner;
    }

    checkMandatoryCapture();
}

function createGame(boardSize) {
    boardMatrix = [];
    checkersBlackCount = 0;
    checkersWhiteCount = 0;
    turnCount = 0;
    currentMove = 'w';
    isEnd = false;
    mandatoryCaptureFlag = false;
    document.querySelector('#winner').innerHTML = '';

    for (let i = 0; i < boardSize; i++) {
        boardMatrix.push([]);
        for (let j = 0; j < boardSize; j++) {
            boardMatrix[i].push(0);
        }
    }

    fillCheckers(boardSize);
    drawBoard(boardSize);
    drawCheckers();
    turnRoutine();
    // console.log(boardMatrix);

}

function fillCheckers(boardSize) {
    for (let i = 0; i < boardSize / 2 - 1; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (i % 2 === 0) {
                if (j % 2 === 0) {
                    boardMatrix[i][j] = new Checker(checkersBlackCount, 'b', j, i);
                    // let name = checkersBlackCollection.add('b', j, i);
                    // boardMatrix[i][j] = name; 
                    checkersBlackCount++;
                }
            } else {
                if (j % 2 != 0) {
                    boardMatrix[i][j] = new Checker(checkersBlackCount, 'b', j, i);
                    // boardMatrix[i][j] = 'b'; 
                    checkersBlackCount++;
                }
            }
        }
    }
    for (let i = boardSize / 2 + 1; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (i % 2 === 0) {
                if (j % 2 === 0) {
                    boardMatrix[i][j] = new Checker(checkersWhiteCount, 'w', j, i);
                    // boardMatrix[i][j] = 'w'; 
                    checkersWhiteCount++;
                }
            } else {
                if (j % 2 != 0) {
                    boardMatrix[i][j] = new Checker(checkersWhiteCount, 'w', j, i);
                    // boardMatrix[i][j] = 'w'; 
                    checkersWhiteCount++;
                }
            }
        }
    }

}

function drawBoard(size) {
    let boardDiv = document.querySelector('#board');
    boardDiv.removeChild(boardDiv.firstChild);
    let boardTable = document.createElement('table');

    let boardTableBody = document.createElement('tbody');

    for (let i = 0; i < size; i++) {
        let boardTableRow = document.createElement('tr');
        for (let j = 0; j < size; j++) {
            let boardTableData = document.createElement('td');

            if (i % 2 === 0) {
                if (j % 2 === 0) {
                    boardTableData.setAttribute('class', 'cell-black');
                    boardTableData.addEventListener('click', (event) => cellClicked(event));
                }
                else boardTableData.setAttribute('class', 'cell-white');
            } else {
                if (j % 2 === 0) boardTableData.setAttribute('class', 'cell-white');
                else {
                    boardTableData.setAttribute('class', 'cell-black');
                    boardTableData.addEventListener('click', (event) => cellClicked(event));
                }
            }

            boardTableData.setAttribute('id', 'td_' + i + '_' + j);

            boardTableRow.appendChild(boardTableData);
        }

        boardTableBody.appendChild(boardTableRow)
    }
    boardTable.appendChild(boardTableBody);
    boardDiv.appendChild(boardTable);
    // for (let i = 0; i < size/2; i ++) {
    //     for (let j = 0; j < size; j ++) {
    //         let cell = document.querySelector('.td_' + i + '_' + j);

    //     }
    // }
}

function drawCheckers() {
    for (i = 0; i < boardMatrix.length; i++) {
        for (j = 0; j < boardMatrix[i].length; j++) {
            if (boardMatrix[i][j].color == 'b') {
                let cell = document.querySelector('#td_' + i + '_' + j);
                let checker = document.createElement('div');
                checker.setAttribute('class', 'checker red');
                checker.setAttribute('id', boardMatrix[i][j].name);
                checker.addEventListener('click', (event) => checkerClicked(event));

                cell.appendChild(checker);
            } else if (boardMatrix[i][j].color == 'w') {
                let cell = document.querySelector('#td_' + i + '_' + j);
                let checker = document.createElement('div');
                checker.setAttribute('class', 'checker white');
                checker.setAttribute('id', boardMatrix[i][j].name);
                checker.addEventListener('click', (event) => checkerClicked(event));
                // checker.addEventListener('click', (event) => {console.log(event.target.name);});

                cell.appendChild(checker);
            }
        }
    }
}

function checkerClicked(event) {
    if (isEnd) return;
    // console.log('checker id: ' + event.target.id);
    // console.log('checker position: ' + event.target.parentNode.id);
    let pos = event.target.parentNode.id.split('_');
    // console.log('checker object: ');
    // console.log(boardMatrix[pos[1]][pos[2]]);

    clearActive();

    currentChecker = boardMatrix[pos[1]][pos[2]];
    if (currentChecker.color === currentMove) {
        let adjacent = spotAdjacent(currentChecker.color, currentChecker.posX, currentChecker.posY, currentChecker.isKing);


        if (adjacent.enemies.length > 0) {
            adjacent.enemies.forEach(element => {
                let target = canCapture(currentChecker.posX, currentChecker.posY, element.posX, element.posY);
                if (target != null) {
                    makeCellActive(target.posX, target.posY);
                }
            });
        }
        if (checkerToCapture === null && adjacent.unoccupied.length > 0) {
            adjacent.unoccupied.forEach(element => {
                makeCellActive(element.posX, element.posY);
            });
        }

    }

    // turnRoutine();
}

function spotAdjacent(color, posX, posY, isKing) {
    let result = {
        enemies: [],
        unoccupied: []
    };

    if (!isKing) {

        try {
            let cell = boardMatrix[posY + 1][posX - 1];
            if (color === 'b' && cell === 0) result.unoccupied.push({ posX: posX - 1, posY: posY + 1 });
            else if (cell != 0 && cell.color != color) result.enemies.push({ posX: posX - 1, posY: posY + 1 });
        } catch (error) {
            // console.log(error);
        }

        try {
            let cell = boardMatrix[posY + 1][posX + 1];
            if (color === 'b' && cell === 0) result.unoccupied.push({ posX: posX + 1, posY: posY + 1 });
            else if (cell != 0 && cell.color != color) result.enemies.push({ posX: posX + 1, posY: posY + 1 });
        } catch (error) {
            // console.log(error);
        }

        try {
            let cell = boardMatrix[posY - 1][posX - 1];
            if (color === 'w' && cell === 0) result.unoccupied.push({ posX: posX - 1, posY: posY - 1 });
            else if (cell != 0 && cell.color != color) result.enemies.push({ posX: posX - 1, posY: posY - 1 });
        } catch (error) {
            // console.log(error);
        }

        try {
            let cell = boardMatrix[posY - 1][posX + 1];
            if (color === 'w' && cell === 0) result.unoccupied.push({ posX: posX + 1, posY: posY - 1 });
            else if (cell != 0 && cell.color != color) result.enemies.push({ posX: posX + 1, posY: posY - 1 });
        } catch (error) {
            // console.log(error);
        }

    } else {
        let newPosX = posX;
        let newPosY = posY;
        while (newPosX > 0 && newPosY > 0) {
            newPosX--;
            newPosY--;
            let cell = boardMatrix[newPosY][newPosX];
            if (cell === 0) result.unoccupied.push({ posX: newPosX, posY: newPosY });
            else if (cell.color != color) {
                result.enemies.push({ posX: newPosX, posY: newPosY });
                break;
            } else break;
        }

        newPosX = posX;
        newPosY = posY;
        while (newPosX < (boardMatrix[newPosY].length - 1) && newPosY > 0) {
            newPosX++;
            newPosY--;
            let cell = boardMatrix[newPosY][newPosX];
            if (cell === 0) result.unoccupied.push({ posX: newPosX, posY: newPosY });
            else if (cell.color != color) {
                result.enemies.push({ posX: newPosX, posY: newPosY });
                break;
            } else break;
        }

        newPosX = posX;
        newPosY = posY;
        while (newPosX < (boardMatrix[newPosY].length - 1) && newPosY < (boardMatrix.length - 1)) {
            newPosX++;
            newPosY++;
            let cell = boardMatrix[newPosY][newPosX];
            if (cell === 0) result.unoccupied.push({ posX: newPosX, posY: newPosY });
            else if (cell.color != color) {
                result.enemies.push({ posX: newPosX, posY: newPosY });
                break;
            } else break;
        }

        newPosX = posX;
        newPosY = posY;
        while (newPosX > 0 && newPosY < (boardMatrix.length - 1)) {
            newPosX--;
            newPosY++;
            let cell = boardMatrix[newPosY][newPosX];
            if (cell === 0) result.unoccupied.push({ posX: newPosX, posY: newPosY });
            else if (cell.color != color) {
                result.enemies.push({ posX: newPosX, posY: newPosY });
                break;
            } else break;
        }
    }

    return result;
}

function canCapture(currentPosX, currentPosY, enemyPosX, enemyPosY) {

    /* let vecX = enemyPosX - currentPosX;
    let vecY = enemyPosY - currentPosY; */

    let vecX = (enemyPosX > currentPosX) ? 1 : -1;
    let vecY = (enemyPosY > currentPosY) ? 1 : -1;

    try {
        let posX = enemyPosX + vecX;
        let posY = enemyPosY + vecY
        if (boardMatrix[posY][posX] === 0) {
            checkerToCapture = boardMatrix[enemyPosY][enemyPosX];
            return { posX: posX, posY: posY };
        }
        else return null;
    } catch (error) { }
}

function makeCellActive(posX, posY) {
    if (boardMatrix[posY][posX] === 0) {
        boardMatrix[posY][posX] = 'a';
        document.querySelector('#td_' + posY + '_' + posX).classList.add('active');
    }
}

function clearActive() {
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            if (boardMatrix[i][j] === 'a') {
                boardMatrix[i][j] = 0;
                document.querySelector('#td_' + i + '_' + j).classList.remove('active');
            }
        }
    }
}

function cellClicked(event) {
    // console.log(event);
    // console.log(event.target.classList.contains('active'));
    if (event.target.classList.contains('active')) {
        clearActive();

        let cell = event.target;
        // let cellId = event.target.id;
        let pos = cell.id.split('_');
        let newPosX = parseInt(pos[2]);
        let newPosY = parseInt(pos[1]);

        boardMatrix[currentChecker.posY][currentChecker.posX] = 0;

        let oldCell = document.querySelector('#td_' + currentChecker.posY + '_' + currentChecker.posX);
        oldCell.firstChild.remove();

        currentChecker.posX = newPosX;
        currentChecker.posY = newPosY;

        boardMatrix[currentChecker.posY][currentChecker.posX] = currentChecker;

        let color = '';
        if (currentChecker.color === 'b') color = 'red';
        else color = 'white';

        let checker = document.createElement('div');
        checker.setAttribute('class', 'checker ' + color);
        checker.setAttribute('id', currentChecker.name);
        if (currentChecker.isKing) checker.innerHTML = 'K';
        checker.addEventListener('click', (event) => checkerClicked(event));

        cell.appendChild(checker);

        if (checkerToCapture != null) {
            captureChecker();

            let adjacent = spotAdjacent(currentChecker.color, currentChecker.posX, currentChecker.posY, currentChecker.isKing);


            if (adjacent.enemies.length > 0) {
                adjacent.enemies.forEach(element => {
                    let target = canCapture(currentChecker.posX, currentChecker.posY, element.posX, element.posY);
                    if (target != null) {
                        makeCellActive(target.posX, target.posY);
                    }
                });
            }
        }

        checkKing();

        if (checkerToCapture === null) turnRoutine();
    }
}

function captureChecker() {
    document.querySelector('#td_' + checkerToCapture.posY + '_' + checkerToCapture.posX).firstChild.remove();

    if (checkerToCapture.color === 'w') checkersWhiteCount--;
    else checkersBlackCount--;

    boardMatrix[checkerToCapture.posY][checkerToCapture.posX] = 0;
    checkerToCapture = null;
}

function checkKing() {
    let posY = currentChecker.posY;
    if (currentChecker.color === 'w') {
        if (posY === 0) {
            if (!currentChecker.isKing) {
                currentChecker.isKing = true;
                document.querySelector('#' + currentChecker.name).innerHTML = 'K';
            }
        }
    } else {
        if (posY === boardMatrix.length - 1) {
            if (!currentChecker.isKing) {
                currentChecker.isKing = true;
                document.querySelector('#' + currentChecker.name).innerHTML = 'K';
            }
        }
    }
}

function checkMandatoryCapture() {
    mandatoryCaptureFlag = false;
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            let checkerToCheck = boardMatrix[i][j];
            if (checkerToCheck != 0) {
                if (checkerToCheck.color === currentMove) {
                    let adjacent = spotAdjacent(checkerToCheck.color, checkerToCheck.posX, checkerToCheck.posY, checkerToCheck.isKing);

                    if (adjacent.enemies.length > 0) {
                        adjacent.enemies.forEach(element => {
                            let target = canCapture(checkerToCheck.posX, checkerToCheck.posY, element.posX, element.posY);
                            if (target != null) {
                                makeCellActive(target.posX, target.posY);
                                mandatoryCaptureFlag = true;
                            }
                        });
                    }
                }
            }
        }
    }
}
// var checker1
// document.querySelector('#test').addEventListener('click', (event) => {
//     console.log(event.target.name);

//     checker1 = new Checker(1, 'b', 2, 3);
//     console.log(checker1);
// });