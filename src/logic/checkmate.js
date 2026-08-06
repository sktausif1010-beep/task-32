import { isKingInCheck } from "./check";
import { isValidMove } from "./moves";

export function isCheckmate(board, color) {
    if (!isKingInCheck(board, color)) {
        return false;
    }
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];
            if (piece === "") continue;
            if (piece[0] !== color) continue;
            for (let toRow = 0; toRow < 8; toRow++) {
                for (let toCol = 0; toCol < 8; toCol++) {

                    if (isValidMove(board, fromRow, fromCol, toRow, toCol)) {
                        const copy = board.map(r => [...r]);
                        copy[toRow][toCol] = copy[fromRow][fromCol];
                        copy[fromRow][fromCol] = "";
                        if (!isKingInCheck(copy, color)) {
                            return false;
                        }
                    }

                }
            }

        }
    }
    return true;
}