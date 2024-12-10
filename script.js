// script.js

const chessboard = document.getElementById("chessboard");

// Chessboard setup
const pieces = {
    0: ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
    1: ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
    6: ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
    7: ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
};

// Generate the chessboard
for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.classList.add((row + col) % 2 === 0 ? "white" : "black");
        tile.dataset.row = row;
        tile.dataset.col = col;

        // Add pieces
        if (pieces[row]) {
            tile.textContent = pieces[row][col];
        }

        // Add click event for move logic
        tile.addEventListener("click", () => handleTileClick(tile));
        chessboard.appendChild(tile);
    }
}

let selectedTile = null;

function handleTileClick(tile) {
    if (selectedTile) {
        // Move the piece to the new tile
        tile.textContent = selectedTile.textContent;
        selectedTile.textContent = "";
        selectedTile.classList.remove("selected");
        selectedTile = null;
    } else if (tile.textContent) {
        // Select a tile with a piece
        selectedTile = tile;
        tile.classList.add("selected");
    }
}
