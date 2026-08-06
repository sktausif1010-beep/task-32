import { isValidMove } from "./moves";

export function isKingInCheck(board, color) {
  let kingRow = -1;
  let kingCol = -1;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col] === color + "k") {
        kingRow = row;
        kingCol = col;
      }
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let piece = board[row][col];
      if (piece === "") continue;
      if (piece[0] !== color) {
        if (isValidMove(board, row, col, kingRow, kingCol)) {
          return true;
        }
      }
    }
  }
  return false;

}