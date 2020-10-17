/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
*/

// A Player class with color and value parameters
class Player {
  constructor(color, value) {
    this.color = color;
    this.value = value;
  }
}

// The Game class with all needed methods and properties
class Game {
  constructor(HEIGHT, WIDTH) {
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;

    // needed properties for players
    this.player1 = null;
    this.player2 = null;
    this.currPlayer = null;

    this.board = [];

    // bound click callbacks
    this.boundHandleClick = this.handleClick.bind(this);
    this.boundPlay = this.play.bind(this);

    // Game Over flag
    this.gameOver = false;
  }

  makeBoard() {

    // board restart for new game
    this.board = [];
    
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');
    
    // erase previous board
    board.innerHTML = '';
    
    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.boundHandleClick);
  
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
  
    board.append(top);
  
    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');
  
      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
  
      board.append(row);
    }
  }

  /* making the button ready for clicks */
  button() {
    const startButton = document.querySelector("#start");
    startButton.addEventListener('click', this.boundPlay);
  }

  /* making the players ready for the new game */
  initializePlayers() {
    const pl1 = document.querySelector('#player1');
    const pl2 = document.querySelector('#player2');
    this.player1 = new Player(pl1.value, 1);
    this.player2 = new Player(pl2.value, 2);
    this.currPlayer = this.player1;
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!(this.board[y][x])) {
        return y;
      }
    }
    return null;
  }
  
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.top = -50 * (y + 2);

    // choosing the player name as the color of the piece
    const colour = this.currPlayer.color;
    piece.style.backgroundColor = colour;
  
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    this.gameOver = true;
    alert(msg);
    const startButton = document.querySelector("#start");
    startButton.innerText = "Restart the Game";
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // check if the game still continues
    if (this.gameOver) {
      return;
    }
  
    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer.value;
    this.placeInTable(y, x);
    
    // check for win
    if (this.checkForWin()) {
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }
    
    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }
      
    // switch players
    this.currPlayer = this.currPlayer.value === 1 ? this.player2 : this.player1;
  }
  
  /** checkForWin: check board cell-by-cell for "does a win start here?" */
  checkForWin() {    
    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];
  
        // find winner (only checking each win-possibility as needed)
        if (this._win(horiz) || this._win(vert) || this._win(diagDR) || this._win(diagDL)) {
          return true;
        }
      }
    }
  }

  _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.HEIGHT &&
        x >= 0 &&
        x < this.WIDTH &&
        this.board[y][x] === this.currPlayer.value
    );
  }

  /* A game play session */
  play() {
    this.initializePlayers();
    this.makeBoard();
    this.makeHtmlBoard();
    this.gameOver = false;
  }
}

/* Creting an instance of the Game class 
   & making the button ready to start the game*/
const myGame = new Game(6, 7);
myGame.button();