const chessboard = document.getElementById('chessboard');
const status = document.getElementById('status');
const startGameButton = document.getElementById('startGame');
const restartGameButton = document.getElementById('restartGame');

const initialBoard = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
];

const pieceSymbols = {
  r: '♜', n: '♞', b: '♝', q: '♛', k: '♚', p: '♟',
  R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔', P: '♙',
};

let boardState = JSON.parse(JSON.stringify(initialBoard));
let selectedPiece = null; // Tracks the currently selected piece
let whiteTurn = true; // White starts first
let gameActive = false;

function renderBoard(board) {
  chessboard.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = document.createElement('div');
      square.className = `square ${(i + j) % 2 === 0 ? 'light' : 'dark'}`;
      square.dataset.row = i;
      square.dataset.col = j;

      if (board[i][j]) {
        const piece = document.createElement('span');
        piece.className = 'piece';
        piece.textContent = pieceSymbols[board[i][j]];
        square.appendChild(piece);
      }

      square.addEventListener('click', () => handleSquareClick(i, j));
      chessboard.appendChild(square);
    }
  }
}

function handleSquareClick(row, col) {
  const piece = boardState[row][col];

  if (selectedPiece) {
    const [selectedRow, selectedCol] = selectedPiece;

    if (isValidMove(selectedRow, selectedCol, row, col)) {
      movePiece(selectedRow, selectedCol, row, col);
      selectedPiece = null;
      whiteTurn = !whiteTurn;
      status.textContent = whiteTurn ? "White's turn" : "Black's turn";
    } else {
      status.textContent = "Invalid move. Try again.";
    }
  } else if (piece && isWhiteTurnPiece(piece)) {
    selectedPiece = [row, col];
    status.textContent = "Piece selected. Click on a valid square.";
  } else {
    status.textContent = "Select a piece to move.";
  }
}

function isWhiteTurnPiece(piece) {
  return whiteTurn ? piece === piece.toUpperCase() : piece === piece.toLowerCase();
}

function isValidMove(fromRow, fromCol, toRow, toCol) {
  const piece = boardState[fromRow][fromCol];
  const target = boardState[toRow][toCol];

  if (piece === null || (target && isWhiteTurnPiece(target))) return false;

  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;

  switch (piece.toLowerCase()) {
    case 'p': // Pawn
      return handlePawnMove(piece, fromRow, fromCol, toRow, toCol, target, rowDiff, colDiff);
    case 'r': // Rook
      return handleRookMove(fromRow, fromCol, toRow, toCol);
    case 'n': // Knight
      return (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 1) || 
             (Math.abs(rowDiff) === 1 && Math.abs(colDiff) === 2);
    case 'b': // Bishop
      return handleBishopMove(fromRow, fromCol, toRow, toCol);
    case 'q': // Queen
      return handleBishopMove(fromRow, fromCol, toRow, toCol) || 
             handleRookMove(fromRow, fromCol, toRow, toCol);
    case 'k': // King
      return Math.abs(rowDiff) <= 1 && Math.abs(colDiff) <= 1;
    default:
      return false;
  }
}

function handlePawnMove(piece, fromRow, fromCol, toRow, toCol, target, rowDiff, colDiff) {
  const direction = piece === 'P' ? -1 : 1;

  if (colDiff === 0 && !target && rowDiff === direction) {
    return true; // Forward move
  }

  if (colDiff === 0 && !target && rowDiff === 2 * direction && (fromRow === 6 || fromRow === 1)) {
    return true; // Two-square initial move
  }

  if (Math.abs(colDiff) === 1 && rowDiff === direction && target) {
    return true; // Capture
  }

  return false;
}

function handleRookMove(fromRow, fromCol, toRow, toCol) {
  if (fromRow !== toRow && fromCol !== toCol) return false;
  return checkPathClear(fromRow, fromCol, toRow, toCol);
}

function handleBishopMove(fromRow, fromCol, toRow, toCol) {
  if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) return false;
  return checkPathClear(fromRow, fromCol, toRow, toCol);
}

function checkPathClear(fromRow, fromCol, toRow, toCol) {
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow || c !== toCol) {
    if (boardState[r][c]) return false;
    r += rowStep;
    c += colStep;
  }

  return true;
}

function movePiece(fromRow, fromCol, toRow, toCol) {
  boardState[toRow][toCol] = boardState[fromRow][fromCol];
  boardState[fromRow][fromCol] = null;
  renderBoard(boardState);
}

startGameButton.addEventListener('click', () => {
  gameActive = true;
  startGameButton.disabled = true;
  restartGameButton.disabled = false;
  renderBoard(boardState);
  status.textContent = "White's turn. Make a move!";
});

restartGameButton.addEventListener('click', () => {
  boardState = JSON.parse(JSON.stringify(initialBoard));
  selectedPiece = null;
  whiteTurn = true;
  renderBoard(boardState);
  status.textContent = "Game restarted. White's turn.";
  startGameButton.disabled = false;
  restartGameButton.disabled = true;
});
