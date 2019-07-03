import React, { Text, Component } from 'react';
import logo from './logo.svg';
import './App.css';

function Cell(props) {
  return (
   
    <div className="Cell">    
      <div className={props.value}/>
    </div>
  ) 
}

function Column(props) {
  return (

    <div className="Collum" onClick={() => props.handleClick()}>
      {
        [...Array(props.cells.length)].map ( 
          (x, j) => 
             
            <Cell key={j} value={props.cells[j]}/>
         
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
      gameSelected: false,
      winner: '',
      gameOver: false,
      totalPlays: 0,

    }
  }

  startGame() {
    this.setState({
      gameSelected: true,
      boardState: new Array(7).fill(new Array(6).fill(null)),
      totalPlays: 0,
      winner: '',
      gameOver: false

    })
  }

  makeMove(slatID) {
    const boardCopy = this.state.boardState.map(function (arr) {
      return arr.slice();
    });
    if (boardCopy[slatID].indexOf(null) !== -1) {
      let newCol = boardCopy[slatID].reverse()
      newCol[newCol.indexOf(null)] = this.state.currentPlayer
      newCol.reverse()
      this.setState({
        currentPlayer: (this.state.currentPlayer === 'Red') ? 'Yellow' : 'Red',
        boardState: boardCopy
      })
      this.state.totalPlays += 1;
    }
  }

  /*Only make moves if winner doesn't exist*/
  handleClick(colID) {
    if (this.state.winner === '') {
      this.makeMove(colID)
    }
  }

  /*check the winner and make AI move IF game is in AI mode*/
  componentDidUpdate() {
    if(this.state.totalPlays >= 7 && !this.state.gameOver)
     {
       let winner = checkAll(this.state.boardState)
       if (winner !== null) {
         this.setState({ winner: winner, gameOver: true })
         winner = null;
       }

     }
      
  }

  render() {

    /*If a winner exists display the name*/
    let winnerMessageStyle
    if (this.state.winner !== "") {
      winnerMessageStyle = "winnerMessage appear"
    } else {
      winnerMessageStyle = "winnerMessage"
    }

    /*Contruct slats allocating column from board*/
    let slats = [...Array(this.state.boardState.length)].map((x, i) =>
      <Column
        key={i}
        cells={this.state.boardState[i]}
        handleClick={() => this.handleClick(i)}
      />
    )

    return (
      <div>
           <div className="Title">Connect Four! (FU Coding Test)</div>
            <div className="Info">
              <div className="Player1"/>
              <div className="Player2"/>
            </div>
        { this.state.gameSelected &&
          <div className="Board">
           
            {slats}
          </div>
        }
        <div className={winnerMessageStyle}>{this.state.winner}</div>
        {(!this.state.gameSelected || this.state.winner !== null ) &&
          <div>
            <button onClick={() => this.startGame()}>Play</button>
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
        <div className="Game">
          <GameBoard />
        </div>
        
      </div>
    );
  }
}
function checkLine(a, b, c, d) {
  return ((a !== null) && (a === b) && (a === c) && (a === d));
}

function checkVertical(board) {
  // Check only if row is 3 or greater
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c]) {
        if (board[r][c] === board[r - 1][c] &&
            board[r][c] === board[r - 2][c] &&
            board[r][c] === board[r - 3][c]) {
          return board[r][c] + ' wins!';    
        }
      }
    }
  }
}

function checkHorizontal(board) {
  // Check only if column is 3 or less
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c]) {
        if (board[r][c] === board[r][c + 1] && 
            board[r][c] === board[r][c + 2] &&
            board[r][c] === board[r][c + 3]) {
          return board[r][c] + ' wins!';
        }
      }
    }
  }
}

function checkDiagonalRight(board) {
  // Check only if row is 3 or greater AND column is 3 or less
  for (let r = 3; r < 6; r++) {
    for (let c = 0; c < 4; c++) {
      if (board[r][c]) {
        if (board[r][c] === board[r - 1][c + 1] &&
            board[r][c] === board[r - 2][c + 2] &&
            board[r][c] === board[r - 3][c + 3]) {
          return board[r][c] + ' wins!';
        }
      }
    }
  }
}

function checkDiagonalLeft(board) {
  // Check only if row is 3 or greater AND column is 3 or greater
  for (let r = 3; r < 6; r++) {
    for (let c = 3; c < 7; c++) {
      if (board[r][c]) {
        if (board[r][c] === board[r - 1][c - 1] &&
            board[r][c] === board[r - 2][c - 2] &&
            board[r][c] === board[r - 3][c - 3]) {
          return board[r][c] + ' wins!';
        }
      }
    }
  }
}

function checkDraw(board) {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      if (board[r][c] === null) {
        return null;
      }
    }
  }
  return 'Its a Draw!';    
}

function checkAll(board) {
  return checkVertical(board) || checkDiagonalRight(board) || checkDiagonalLeft(board) || checkHorizontal(board) || checkDraw(board);
}

export default App;
