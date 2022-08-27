import React from 'react';

import Square from "./Square";
import StateVisitor from "./../util/stateVisitor";
import VisitBoard from "./../util/visitBoard";
import Agent from '../agent/Agent';
import deepcopy from 'deepcopy';

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.size = props.size;

        this.board = new Array(this.size);
        for (let i = 0; i < this.size; i++) {
            this.board[i] = new Array(this.size);
        }
        this.finish = false;
        this.symbol = 'x';
        this.agent = new Agent(1);
    }
    state = {}

    componentDidMount() {
        this.setState({
            turn: 'agent',
            row: -1,
            col: -1
        });
        window.requestAnimationFrame(() => this.update());
    }

    checkGameState() {
        let gameState = new StateVisitor();
        new VisitBoard().travers(this, gameState);
        if (gameState.gameFinished) {
            if (gameState.winner = this.symbol) {
                this.props.finishGame('win');
            } else {
                this.props.finishGame('lose');
            }
            this.finish = true;
        }
    }

    waitForAgent() {
        let move = this.agent.calculateNextMove(this.state.row, this.state.col, this);
        this.checkGameState();
        this.setState({ turn: 'agent', row: move.x, col: move.y, symbol: 'o' });
        window.requestAnimationFrame(() => { this.update() });
    }

    update() {
        let row = this.state.row;
        let col = this.state.col;
        let symbol = this.state.symbol;

        if (row >= 0 && col >= 0) {
            this.board[row][col] = symbol;
            this.checkGameState();
            this.forceUpdate();

            if (this.state.turn == 'human') {
                window.requestAnimationFrame(() => { this.waitForAgent() });
            } else {
                window.requestAnimationFrame(() => { this.update(); });
            }
        } else {
            window.requestAnimationFrame(() => { this.update(); });
        }

    }

    onClick(row, col) {
        if (!this.finish && this.state.turn == 'agent' && this.board[row][col] == null) {
            this.setState({ turn: 'human', row: row, col: col, symbol: 'x' });
        }
        console.log(row, col);
    }

    get(x, y) {
        return this.board[x][y];
    }

    set(x, y, val) {
        this.board[x][y] = val;
    }

    clone() {
        let newBoard = new Board({ size: this.size });
        newBoard.board = deepcopy(this.board);
        return newBoard;
    }

    renderRow(row) {
        let squares = [];
        for (let col = 0; col < this.props.size; col++) {
            squares.push(
                <Square
                    value={this.board[row][col]}
                    key={row * this.props.size + col}
                    onClick={() => this.onClick(row, col)}
                />
            );
        }
        return squares;
    }
    renderBoard() {
        let rows = [];
        for (let row = 0; row < this.props.size; row++) {
            rows.push(
                <div className="row" key={row}>
                    {this.renderRow(row)}
                </div>
            );
        }
        return rows;
    }
    render() {
        return (<div className="board">
            {this.renderBoard()}
        </div>);
    }
}

export default Board;