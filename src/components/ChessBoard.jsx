import { useState, useEffect } from "react";
import "./ChessBoard.css";
import boardData from "../data/board";
import { isValidMove } from "../logic/moves";
import { isKingInCheck } from "../logic/check";
import { isCheckmate } from "../logic/checkmate";

function ChessBoard() {

  const [board, setBoard] = useState(boardData);
  const [selected, setSelected] = useState(null);
  const [turn, setTurn] = useState("white");
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);

  const [moveList, setMoveList] = useState([]);
  const [history, setHistory] = useState([]);
  const [whiteCaptured, setWhiteCaptured] = useState([]);
  const [blackCaptured, setBlackCaptured] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (turn === "white") {
        setWhiteTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            alert("Black Wins!");
            return 0;

          }
          return prev - 1;
        });
      }
      else
      {
        setBlackTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            alert("White Wins!");
            return 0;
          }

          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [turn]);

  function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  }

  function getPosition(row, col) {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    return files[col] + (8 - row);
  }

  function getPieceName(piece) {
    if (piece[1] === "p") return "";
    if (piece[1] === "r") return "R";
    if (piece[1] === "n") return "N";
    if (piece[1] === "b") return "B";
    if (piece[1] === "q") return "Q";
    if (piece[1] === "k") return "K";
    return "";
  }

  function undoMove() {
    if (history.length === 0) return;
    const lastBoard = history[history.length - 1];
    setBoard(lastBoard);
    setHistory(history.slice(0, history.length - 1));
    setTurn(turn === "white" ? "black" : "white");
  }

  function handleClick(row, col) {
    const piece = board[row][col];

    if (selected === null) {
      if (piece === "") return;
      if (turn === "white" && piece[0] !== "w") return;
      if (turn === "black" && piece[0] !== "b") return;
       setSelected({ row, col });
      return;

    }
    if ( isValidMove(board, selected.row, selected.col, row, col)) {
      setHistory((old) => [...old, board.map(r => [...r])]);
      const newBoard = board.map(r => [...r]);
      const capturedPiece = newBoard[row][col];

      newBoard[row][col] = newBoard[selected.row][selected.col];
      newBoard[selected.row][selected.col] = "";

      if (capturedPiece !== "") {
        if (capturedPiece[0] === "w") {
          setWhiteCaptured(old => [...old, capturedPiece]);
        }
        else 
        {
          setBlackCaptured(old => [...old, capturedPiece]);
        }
      }

      const movingPiece = newBoard[row][col];
      const move = getPieceName(movingPiece) + getPosition(row, col);
      setMoveList(old => [...old, move]);
      setBoard(newBoard);
      const nextTurn = turn === "white" ? "black" : "white";

      setTurn(nextTurn);
      if (isKingInCheck(newBoard, nextTurn[0])) {
        if (isCheckmate(newBoard, nextTurn[0])) {
          alert("Checkmate!");
        }
        else 
        {
          alert("Check!");
        }
      }
    }

    setSelected(null);
  }
    return (
    <>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const light = (rowIndex + colIndex) % 2 === 0;

            const isSelected = selected && selected.row === rowIndex && selected.col === colIndex;
            return (
              <div key={rowIndex + "-" + colIndex}
                className={`square ${light ? "light" : "dark"} ${isSelected ? "selected" : ""}`}
                onClick={() => handleClick(rowIndex, colIndex)}>
                {piece !== "" && (
                  <img src={`/pieces/${piece}.png`} alt={piece}/>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="players">
        <div className="playerBox">
          <h3>White</h3>
          <h2>{formatTime(whiteTime)}</h2>
        </div>

        <div className="playerBox">
          <h3>Black</h3>
          <h2>{formatTime(blackTime)}</h2>
        </div>
      </div>

      <div className="moveBox">
        <h3>Move History</h3>
        <div className="moves">
          {moveList.map((move, index) => (
            <p key={index}>
              {index + 1}. {move}
            </p>
          ))}

        </div>
      </div>

      <div className="undoSection">
        <button onClick={undoMove}>
          Undo Move
        </button>
      </div>

      <div className="captured">
        <div>
          <h3>White Captured</h3>
          <div>
            {whiteCaptured.map((piece, index) => (
              <img key={index} src={`/pieces/${piece}.png`} alt={piece} className="smallPiece" />
            ))}
          </div>
        </div>

        <div>
          <h3>Black Captured</h3>
          <div>
            {blackCaptured.map((piece, index) => (
              <img key={index} src={`/pieces/${piece}.png`} alt={piece} className="smallPiece" />
            ))}

          </div>
        </div>
      </div>
    </>
  );
}

export default ChessBoard;