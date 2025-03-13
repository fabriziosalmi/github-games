const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth;
    const size = Math.min(800, containerWidth * 0.95);
    canvas.width = size;
    canvas.height = size;
    drawBoard(); // Redraw the board after resizing
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const BOARD_SIZE = 8;
const pieces = {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
};

let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null));
let selectedPiece = null;
let currentPlayer = 'white';
let gameStatus = 'White\'s turn';
let isGameOver = false;

function updateGameStatus(message) {
    gameStatus = message;
    const statusElement = document.getElementById('gameStatus');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function findKing(color) {
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (piece === `${color}_king`) {
                return [row, col];
            }
        }
    }
    return null; // Should not happen in a valid game state
}

function isKingInCheck(color) {
    const [kingRow, kingCol] = findKing(color);
    if (kingRow === null || kingCol === null) return false; // Handle potential error

    const opponentColor = color === 'w' ? 'b' : 'w';
    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            const piece = board[row][col];
            if (piece && piece.startsWith(opponentColor)) {
                if (isValidMove(row, col, kingRow, kingCol)) { // Pass `false` to avoid infinite recursion
                    return true;
                }
            }
        }
    }
    return false;
}

function isCheckmate(color) {
    if (!isKingInCheck(color)) return false;

    // Try all possible moves for all pieces
    for (let fromRow = 0; fromRow < BOARD_SIZE; fromRow++) {
        for (let fromCol = 0; fromCol < BOARD_SIZE; fromCol++) {
            const piece = board[fromRow][fromCol];
            if (piece && piece.startsWith(color)) {
                for (let toRow = 0; toRow < BOARD_SIZE; toRow++) {
                    for (let toCol = 0; toCol < BOARD_SIZE; toCol++) {
                        if (isValidMove(fromRow, fromCol, toRow, toCol, true)) { // Pass `true` for normal move validation
                            // Try move
                            const originalPiece = board[toRow][toCol];
                            board[toRow][toCol] = board[fromRow][fromCol];
                            board[fromRow][fromCol] = null;

                            const stillInCheck = isKingInCheck(color);

                            // Undo move
                            board[fromRow][fromCol] = board[toRow][toCol];
                            board[toRow][toCol] = originalPiece;

                            if (!stillInCheck) return false;
                        }
                    }
                }
            }
        }
    }
    return true;
}

// Initialize the board
function initializeBoard() {
    // Place white pieces
    board[7] = ['w_rook', 'w_knight', 'w_bishop', 'w_queen', 'w_king', 'w_bishop', 'w_knight', 'w_rook'];
    board[6] = Array(8).fill('w_pawn');

    // Place black pieces
    board[0] = ['b_rook', 'b_knight', 'b_bishop', 'b_queen', 'b_king', 'b_bishop', 'b_knight', 'b_rook'];
    board[1] = Array(8).fill('b_pawn');
}

function drawBoard() {
    const squareSize = canvas.width / BOARD_SIZE;

    for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
            ctx.fillStyle = (row + col) % 2 === 0 ? '#ffffff' : '#4a4a4a';
            ctx.fillRect(col * squareSize, row * squareSize, squareSize, squareSize);

            if (board[row][col]) {
                drawPiece(board[row][col], col * squareSize, row * squareSize, squareSize);
            }
        }
    }

    if (selectedPiece) {
        const [row, col] = selectedPiece;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 3;
        ctx.strokeRect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
}

function drawPiece(piece, x, y, size) {
    const [color, type] = piece.split('_');
    ctx.fillStyle = color === 'w' ? '#fff' : '#000';
    ctx.strokeStyle = color === 'w' ? '#000' : '#fff';
    ctx.font = `${size * 0.7}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    let symbol;
    switch (type) {
        case 'king': symbol = pieces.king; break;
        case 'queen': symbol = pieces.queen; break;
        case 'rook': symbol = pieces.rook; break;
        case 'bishop': symbol = pieces.bishop; break;
        case 'knight': symbol = pieces.knight; break;
        case 'pawn': symbol = pieces.pawn; break;
    }

    ctx.fillText(symbol, x + size/2, y + size/2);
    ctx.strokeText(symbol, x + size/2, y + size/2);
}

canvas.addEventListener('click', (event) => {
    if (isGameOver) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const squareSize = canvas.width / BOARD_SIZE;

    const col = Math.floor(x / squareSize);
    const row = Math.floor(y / squareSize);

    if (!selectedPiece) {
        const piece = board[row][col];
        if (piece && piece.startsWith(currentPlayer === 'white' ? 'w' : 'b')) {
            selectedPiece = [row, col];
        }
    } else {
        const [selectedRow, selectedCol] = selectedPiece;
        if (isValidMove(selectedRow, selectedCol, row, col)) { // In click handler
            // Attempt the move and check for self-check

            const originalPieceAtTarget = board[row][col]; // Store piece at the target
            const pieceToMove = board[selectedRow][selectedCol];

            board[row][col] = pieceToMove;
            board[selectedRow][selectedCol] = null;

            const currentColor = currentPlayer === 'white' ? 'white' : 'black';
             if (isKingInCheck(currentColor)) {
               // Move results in self-check.  Undo the move.
                 board[selectedRow][selectedCol] = pieceToMove;
                 board[row][col] = originalPieceAtTarget; // Restore target square
                 updateGameStatus("Invalid move: Cannot put yourself in check.");
                 drawBoard();
                 selectedPiece = null;  // Clear selected piece
                 return; // Exit without changing turns

            }
             const nextColor = currentPlayer === 'white' ? 'b' : 'w';

             if (isKingInCheck(nextColor)) {
                if (isCheckmate(nextColor)) {
                    updateGameStatus(`Checkmate! ${currentPlayer} wins!`);
                    isGameOver = true;
                } else {
                    updateGameStatus(`${currentPlayer === 'white' ? 'Black' : 'White'} is in check!`);
                }
             } else {
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                updateGameStatus(`${currentPlayer === 'white' ? 'White' : 'Black'}'s turn`);
             }

        } else {
          updateGameStatus("Invalid Move");
        }

        selectedPiece = null; // Always deselect after attempting a move, valid or invalid
    }

    drawBoard();
});

function isPathClear(fromRow, fromCol, toRow, toCol) {
    const deltaRow = Math.sign(toRow - fromRow);
    const deltaCol = Math.sign(toCol - fromCol);
    let row = fromRow + deltaRow;
    let col = fromCol + deltaCol;

    while (row !== toRow || col !== toCol) {
        if (board[row][col]) return false;
        row += deltaRow;
        col += deltaCol;
    }
    return true;
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const [color, type] = piece.split('_');
    const deltaRow = toRow - fromRow;
    const deltaCol = toCol - fromCol;
    const targetPiece = board[toRow][toCol];

    // Can't capture own pieces
    if (targetPiece && targetPiece.startsWith(color)) return false;

    switch (type) {
        case 'pawn':
            const direction = color === 'w' ? -1 : 1;
            const startRow = color === 'w' ? 6 : 1;
            
            // Basic forward move
            if (deltaCol === 0 && !targetPiece) {
                if (deltaRow === direction || (fromRow === startRow && deltaRow === 2*direction)) {
                    return true;
                }
            }
            
            // Diagonal capture
            if (Math.abs(deltaCol) === 1 && deltaRow === direction && targetPiece && targetPiece.startsWith(color === 'w' ? 'b' : 'w')) {
                return true;
            }
            return false;

        case 'rook':
            if ((deltaRow === 0 || deltaCol === 0) && isPathClear(fromRow, fromCol, toRow, toCol)) return true;
            return false;

        case 'knight':
            return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
                   (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);

        case 'bishop':
            if (Math.abs(deltaRow) === Math.abs(deltaCol) && isPathClear(fromRow, fromCol, toRow, toCol)) return true;
            return false;

        case 'queen':
            if ((deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)) &&
                isPathClear(fromRow, fromCol, toRow, toCol)) return true;
            return false;

        case 'king':
            return Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1;

        default:
            return false;
    }
}

initializeBoard();
drawBoard();