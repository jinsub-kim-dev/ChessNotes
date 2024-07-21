function pieceTheme (piece) {
    return 'img/chesspieces/wikipedia/' + piece + '.png'
}

let gameIdCounter = 0;
let boards = {};

let defaultBoardConfig = {
    draggable: true,
    dropOffBoard: 'trash',
    pieceTheme: pieceTheme,
    showNotation: true,
    position: 'start',
    orientation: 'white'
}

let defaultGameTitle = "New Title"

function createGame(callback) {
    gameIdCounter++;
    const gameId = `game${gameIdCounter}`;
    const gameContainer = document.createElement('div');
    gameContainer.className = 'game';
    gameContainer.id = `container${gameId}`;

    const gameActions = document.createElement('div');
    gameActions.className = 'game-actions';

    const gameTitleContainer = document.createElement('div');
    gameTitleContainer.className = 'game-title-container';

    const gameTitlePrefix = document.createElement('span');
    gameTitlePrefix.className = 'game-title-prefix';
    gameTitlePrefix.textContent = 'Game: ';

    const gameTitle = document.createElement('span');
    gameTitle.id = `${gameId}-title`;
    gameTitle.className = 'game-title';
    gameTitle.textContent = defaultGameTitle;
    gameTitle.addEventListener('click', handleTitleClick)

    gameTitleContainer.appendChild(gameTitlePrefix);
    gameTitleContainer.appendChild(gameTitle);

    const fenContainer = document.createElement('div');
    fenContainer.className = 'fen-container';

    const fenPrefix = document.createElement('span');
    fenPrefix.className = 'fen-prefix';
    fenPrefix.textContent = '포지션 설정(FEN): ';

    const fenInput = document.createElement('input');
    fenInput.id = `${gameId}-fen-input`;
    fenInput.className = 'fen-input';
    fenInput.placeholder = 'Enter FEN string';

    const fenApplyBtn = document.createElement('button');
    fenApplyBtn.id = `${gameId}-fen-apply-btn`;
    fenApplyBtn.className = 'fen-apply-btn';
    fenApplyBtn.textContent = 'Apply FEN';
    fenApplyBtn.addEventListener('click', () => handleFenApply(gameId));

    fenContainer.appendChild(fenPrefix);
    fenContainer.appendChild(fenInput);
    fenContainer.appendChild(fenApplyBtn);


    const startPositionButton = document.createElement('button');
    startPositionButton.textContent = 'Start Position';
    startPositionButton.className = 'start-position-btn';
    startPositionButton.addEventListener('click', () => startPositionForGame(gameId));

    const flipBoardButton = document.createElement('button');
    flipBoardButton.textContent = 'Flip Board';
    flipBoardButton.className = 'flip-board-btn';
    flipBoardButton.addEventListener('click', function() {
        flipBoard(gameId);
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Game';
    deleteButton.className = 'delete-game-btn';
    deleteButton.addEventListener('click', () => deleteGame(gameId));

    gameActions.appendChild(gameTitleContainer);
    gameActions.appendChild(fenContainer);
    gameActions.appendChild(startPositionButton);
    gameActions.appendChild(flipBoardButton);
    gameActions.appendChild(deleteButton);

    const boardContainer = document.createElement('div');
    boardContainer.className = 'board-container';

    for (let i = 1; i <= 3; i++) {
        const boardId = `${gameId}-board${i}`;
        const boardWrapper = document.createElement('div');
        boardWrapper.className = 'board-wrapper';

        const headerDiv = document.createElement('div');
        headerDiv.className = 'header-div';
        switch (i) {
            case 1:
                headerDiv.textContent = '주어진 포지션';
                break;
            case 2:
                headerDiv.textContent = '내가 둔 수';
                break;
            case 3:
                headerDiv.textContent = '엔진 제안';
                break;
        }

        const boardDiv = document.createElement('div');
        boardDiv.id = boardId;
        boardDiv.className = 'board';

        const bottomDiv = document.createElement('div');
        bottomDiv.className = 'bottom-div';

        const memoTextarea = document.createElement('textarea');
        memoTextarea.id = `${boardId}-memoInput`;
        memoTextarea.className = 'memo-textarea';
        memoTextarea.placeholder = '메모를 입력하세요...';
        memoTextarea.rows = 3;

        bottomDiv.appendChild(memoTextarea);

        boardWrapper.appendChild(headerDiv);
        boardWrapper.appendChild(boardDiv);
        boardWrapper.appendChild(bottomDiv);

        boardContainer.appendChild(boardWrapper);
    }

    gameContainer.appendChild(gameActions);
    gameContainer.appendChild(boardContainer);
    document.getElementById('games').appendChild(gameContainer);

    setTimeout(() => {
        for (let i = 1; i <= 3; i++) {
            const boardId = `${gameId}-board${i}`;
            boards[boardId] = Chessboard(boardId, defaultBoardConfig);
        }

        if (callback) callback(gameId);
    }, 0);
}

function handleFenApply(gameId) {
    const fenInput = document.getElementById(`${gameId}-fen-input`)
    for (let i = 1; i <= 3; i++) {
        const boardId = `${gameId}-board${i}`;
        boards[boardId].position(fenInput.value)
    }
}

function startPositionForGame(gameId) {
    for (let i = 1; i <= 3; i++) {
        const boardId = `${gameId}-board${i}`;
        boards[boardId].start();
    }
}

function flipBoard(gameId) {
    for (let i = 1; i <= 3; i++) {
        const boardId = `${gameId}-board${i}`;
        const board = boards[boardId]
        board.flip();
    }
}

function deleteGame(gameId) {
    for (let i = 1; i <= 3; i++) {
        const boardId = `${gameId}-board${i}`;
        boards[boardId].destroy();
        delete boards[boardId];
    }
    document.getElementById(`container${gameId}`).remove();
}


function handleTitleClick(event) {
    const titleElement = event.target;
    if (titleElement.classList.contains('game-title')) {
        if (titleElement.classList.contains('editing')) return;

        const currentTitle = titleElement.innerText;
        titleElement.classList.add('editing');
        titleElement.innerHTML = `<input type="text" value="${currentTitle}" />`;

        const input = titleElement.querySelector('input');
        input.focus();

        input.addEventListener('blur', () => {
            const newTitle = input.value.trim();
            titleElement.innerText = newTitle === '' ? defaultGameTitle : newTitle;
            titleElement.classList.remove('editing');
        });
    }
}

function showSnackbar(message) {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = 'show';
    setTimeout(() => {
        snackbar.className = snackbar.className.replace('show', '');
    }, 3000);
}

function saveData() {
    const games = Array.from(document.querySelectorAll('.game')).map(game => {
        const gameId = game.id.replace('container', '');
        const title = document.getElementById(`${gameId}-title`).innerText;

        const boardsData = [];
        for (let i = 1; i <= 3; i++) {
            const boardId = `${gameId}-board${i}`;
            const board = boards[boardId];
            boardsData.push({
                fen: board.fen(), 
                orientation: board.orientation(),
                note: document.getElementById(`${boardId}-memoInput`).value
            });
        }

        return {
            title,
            boards: boardsData
        };
    });

    const jsonData = JSON.stringify(games, null, 2);
    localStorage.setItem('chessGames', jsonData);

    showSnackbar('Data saved successfully!');
}

function loadData() {
    const savedData = localStorage.getItem('chessGames');
    if (savedData) {
        const games = JSON.parse(savedData);
        games.forEach(gameData => {
            createGameFromData(gameData);
        });
    }
}

function createGameFromData(gameData) {
    createGame((gameId) => {
        document.getElementById(`${gameId}-title`).innerText = gameData.title;
        gameData.boards.forEach((boardData, index) => {
            const boardId = `${gameId}-board${index + 1}`;
            const board = boards[boardId];
            if (board) {
                board.position(boardData.fen);
                board.orientation(boardData.orientation);
                document.getElementById(`${boardId}-memoInput`).value = boardData.note;
            }
    
            if (index == 0) {
                const fenInput = document.getElementById(`${gameId}-fen-input`);
                fenInput.value = boardData.fen;
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', loadData);

document.getElementById('addGame').addEventListener('click', () => createGame(null));
document.getElementById('saveData').addEventListener('click', saveData);