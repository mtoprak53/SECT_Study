import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows=5, ncols=5, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    // TODO: create array-of-arrays of true/false values
    const litRandom = () => Math.random() < 0.5 ? false : true;
    let cols = Array.from({ length: nrows});
    let row = Array.from({ length: ncols});
    initialBoard = cols.map(r => row.map(r => litRandom()));
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.

    return board.every(row => row.every(cell => !cell));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // TODO: Make a (deep) copy of the oldBoard
      const boardCopy = oldBoard.map(r => r.map(c => c));
      
      // TODO: in the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);
      flipCell(y - 1, x, boardCopy);
      flipCell(y + 1, x, boardCopy);
      flipCell(y, x - 1, boardCopy);
      flipCell(y, x + 1, boardCopy);

      // TODO: return the copy
      return boardCopy;
    });
  }

  // EXTRA WIN_THE_GAME FUNC
  function allLitOut() {
    setBoard(oldBoard => oldBoard.map(row => row.map(cell => false)));
  }

  // if the game is won, just show a winning msg & render nothing else
  // TODO
  if (hasWon()) return (<h1>CONGRATULATIONS! YOU WON!</h1>);

  // make table board
  // TODO

  return (
    <div>
    {/* EXTRA LIGHTS OUT BUTTON TO SEE END OF GAME SCREEN */}
    <button onClick={allLitOut}>WIN THE GAME</button>
    <table>
      <tbody>
        {board.map((row, y) => 
          <tr>
            {row.map((cell, x) => 
              <Cell isLit={cell} 
                flipCellsAroundMe={(() => flipCellsAround(`${y}-${x}`))} />
            )}
          </tr>
        )}
      </tbody>
    </table>
    </div>
  )
}

export default Board;



// ***********************************************************



// function createBoard() {
//   let initialBoard = [];
//   const litRandom = () => Math.random() < 0.5 ? false : true;
//   let row = [];
//   for (let j = 0; j < 6; j++) {
//     row = [];
//     for (let i = 0; i < 5; i++) {
//       row.push(litRandom());
//     }
//     initialBoard.push(row);
//   }
//   return initialBoard;
// }
// createBoard();


// row = [];
// for (let i = 0; i < 5; i++) row.push(() => Math.random() < 0.5 ? false : true);


// function createBoard() {
//   let initialBoard = [];
//   const litRandom = () => Math.random() < 0.5 ? false : true;
//   let cols = Array.from({ length: 5});
//   let row = Array.from({ length: 6});
//   initialBoard = cols.map(r => row.map(c => litRandom()));
//   return initialBoard;
// }
// createBoard();
