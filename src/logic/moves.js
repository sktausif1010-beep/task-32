function isInsideBoard(row, col) {
  return row >= 0 && row < 8 && col >= 0 && col < 8;
}

function clearStraight(board, fromRow, fromCol, toRow, toCol) {
  if (fromRow === toRow) {
    let start = Math.min(fromCol, toCol) + 1;
    let end = Math.max(fromCol, toCol);

    for (let i = start; i < end; i++) {
      if (board[fromRow][i] !== "") {
        return false;
      }
    }
    return true;
  }

  if (fromCol === toCol) {
    let start = Math.min(fromRow, toRow) + 1;
    let end = Math.max(fromRow, toRow);

    for (let i = start; i < end; i++) {
      if (board[i][fromCol] !== "") {
        return false;
      }
    }
    return true;
  }
  return false;
}

function clearDiagonal(board, fromRow, fromCol, toRow, toCol) {
  let rowDiff = toRow - fromRow;
  let colDiff = toCol - fromCol;
  if (Math.abs(rowDiff) !== Math.abs(colDiff)) {
    return false;
  }
  let rowStep = rowDiff > 0 ? 1 : -1;
  let colStep = colDiff > 0 ? 1 : -1;
  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  while (r !== toRow && c !== toCol) {
    if (board[r][c] !== "") {
      return false;
    }
    r += rowStep;
    c += colStep;
  }

  return true;
}
export function isValidMove(board, fromRow, fromCol, toRow, toCol) {

  if (!isInsideBoard(toRow, toCol)) {
    return false;
  }
  const piece = board[fromRow][fromCol];
  if (piece === "") {
    return false;
  }

  const target = board[toRow][toCol];
  if (target !== "" && piece[0] === target[0]) {
    return false;
  }

  const type = piece[1];
  if (type === "p") {
    if (piece[0] === "w") {

      if (toCol === fromCol &&
          toRow === fromRow - 1 &&
          target === "") {

        return true;
      }

      if (fromRow === 6 &&
          toCol === fromCol &&
          toRow === 4 &&
          board[5][fromCol] === "" &&
          target === "") {
        return true;
      }

      if (Math.abs(toCol - fromCol) === 1 &&
          toRow === fromRow - 1 &&
          target !== "" &&
          target[0] === "b") {

        return true;
      }

    } 
    else 
    {

      if (toCol === fromCol &&
          toRow === fromRow + 1 &&
          target === "") {

        return true;
      }
      if (fromRow === 1 &&
          toCol === fromCol &&
          toRow === 3 &&
          board[2][fromCol] === "" &&
          target === "") {
        return true;
      }

      if (Math.abs(toCol - fromCol) === 1 &&
          toRow === fromRow + 1 &&
          target !== "" &&
          target[0] === "w") {

        return true;
      }

    }
    return false;
  }

  if (type === "n") {
    const row = Math.abs(toRow - fromRow);
    const col = Math.abs(toCol - fromCol);

    if (
      (row === 2 && col === 1) ||
      (row === 1 && col === 2)
    ) {
      return true;
    }
    return false;
  }

if (type === "b") {
  return clearDiagonal(board, fromRow, fromCol, toRow, toCol);
}

if (type === "r") {
  return clearStraight( board, fromRow, fromCol, toRow, toCol);
}

if (type === "q") {
  if (clearStraight(board, fromRow, fromCol, toRow, toCol)) {
    return true;
  }
  if (clearDiagonal(board, fromRow, fromCol, toRow, toCol)) {
    return true;
  }
  return false;
}

if (type === "k") {
  let row = Math.abs(toRow - fromRow);
  let col = Math.abs(toCol - fromCol);
  if (row <= 1 && col <= 1) {
    return true;
  }
  return false;
}
return false;
}