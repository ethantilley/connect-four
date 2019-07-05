import React, { Component } from 'react';
import './App.css';
import FU from './media/fulogo.png'
import { random } from 'node-forge';


function Cell(props) {
  return (
    <div className="Cell">
      <div className={props.value} />
    </div>
  )
}

function Column(props) {
  return (
    <div className="Column" onClick={() => props.handleClick()}>
      {
        // Stepping through each element in a column array to add cells 
        [...Array(props.cells.length)].map(
          (x, j) =>
            <Cell key={j} value={props.cells[j]} />
        )
      }
    </div>
  )
}

class GameBoard extends Component {

  constructor() {
    super();
    this.state = {
      boardState: new Array(7).fill(new Array(6).fill(null)),
      currentPlayer: 'Red',
      gameActive: false,
      winner: '',
      totalPlays: 0
    }
  }

  /* Reset some state values for fresh game */
  startGame() {
    this.setState({
      gameActive: true,
      boardState: new Array(7).fill(new Array(6).fill(null)),
      totalPlays: 0,
      winner: ''
    })
  }

  playMove(columnID) {
    const boardCopy = this.state.boardState.map(function (arr) {
      return arr.slice();
    });
    // checks if there's anempty space in this slot (is it full?)
    if (boardCopy[columnID].indexOf(null) !== -1) {
      // reversing the array to assign the next empty space      
      let newColumn = boardCopy[columnID].reverse()
      newColumn[newColumn.indexOf(null)] = this.state.currentPlayer
      newColumn.reverse() // reversing back
      // changing players and refreashing the state of the board.
      this.setState({
        currentPlayer: (this.state.currentPlayer === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy
      })
      this.state.totalPlays += 1;
    }
  }

  /* called when the player clicks on a column */
  handleClick(columnID) {
    // Only make plays when there's no winner yet
    if (this.state.winner === '') {
      this.playMove(columnID)
    }
  }

  /* Check if there's a winner */
  componentDidUpdate() {
    // No point checking for a winner if there hasn't been enough placed!
    if (this.state.totalPlays >= 7) {
      let winner = checkWinStates(this.state.boardState) // run all the checks for a winner
      if (this.state.winner !== winner) {
        this.setState({ winner: winner }) // set winner in state
      }
    }
  }

  render() {


    // If a winner exists... set the winner text a new class name for css styling
    let winMessageClassName
    if (this.state.winner !== "") {
      winMessageClassName = "winnerMessage appear"
    } else {
      winMessageClassName = "winnerMessage"
    }

    /* Contructing the columns */
    let columns = [...Array(this.state.boardState.length)].map(
      (x, i) =>
        <div key={i}>
          <Column
            cells={this.state.boardState[i]}
            handleClick={() => this.handleClick(i)} // setting click event
          />
          <div className="drop-point" onClick={() => this.handleClick(i)} />

        </div>
    )

    // current player indication!
    let player1Class = (this.state.currentPlayer !== 'Red') ? 'Player1' : 'Player1 displayActive';
    let player2Class = (this.state.currentPlayer !== 'Yellow') ? 'Player2' : 'Player2 displayActive';

    return (
      <div>
        {this.state.gameActive &&
          <div className="Board">
            <div className='Info'>
              <h2>Plays: {this.state.totalPlays}</h2>
              <div className={player1Class} />
              <div className={player2Class} />
              <div className={winMessageClassName}>{this.state.winner}</div>
              {/* Reset button that only displays when a reset in potentially necessary */}
              {(this.state.totalPlays > 0 && this.state.winner === '') &&
                <button onClick={() => this.startGame()} style={{minWidth:'100px'}}>Reset</button>
              }
            </div>
            {columns}
          </div>
        }
        {/* button that only appears when there's a winner or a draw */}
        {(!this.state.gameActive || this.state.winner !== '') &&
          <div>
            <button onClick={() => this.startGame()}>Play Game</button>
          </div>
        }
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Connect Four</h1>
          <h2>An <img src={FU} className="fu-logo" /> Coding Challange!</h2>
        </div>
        <div className="Game">
          <GameBoard />
        </div>
      </div>
    );
  }
}

/* Are these arguments (cells on the board) contain the same player 'token' */
function checkLine(a, b, c, d) {
  return ((a !== null) && (a === b) && (a === c) && (a === d));
}

/* checks all the cells for any that line up for a win  */
function checkWinStates(board) {

  /* Checks for a diagonal line going left  */
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++)
      if (checkLine(board[c][r], board[c + 1][r + 1], board[c + 2][r + 2], board[c + 3][r + 3]))
        return board[c][r] + (" wins!")

  /* Checking for vertical connections */
  for (let c = 0; c < 7; c++)
    for (let r = 0; r < 4; r++)
      if (checkLine(board[c][r], board[c][r + 1], board[c][r + 2], board[c][r + 3]))
        return board[c][r] + ' wins!'

  /* Checks for horizontal lines */
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 4; c++)
      if (checkLine(board[c][r], board[c + 1][r], board[c + 2][r], board[c + 3][r]))
        return board[c][r] + ' wins!'

  /* Checks for the diagonal win state on the right side of the board */
  for (let r = 0; r < 4; r++)
    for (let c = 3; c < 7; c++)
      if (checkLine(board[c][r], board[c - 1][r + 1], board[c - 2][r + 2], board[c - 3][r + 3])) // counting up and to the right to see if the same play has placed there.
        return board[c][r] + ' wins!'

  /* Check to see if there's an empty space to return theres no winner... otherwise... return it's a draw! */
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[c][r] == null)
        return "";
    }
  }

  return 'Draw! You both win!'
}

export default App;
