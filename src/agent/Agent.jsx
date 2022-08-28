import Boundary from './Boundary.jsx';
import GameState from './GameState.jsx';
import deepcopy from 'deepcopy';
import StateVisitor from '../util/stateVisitor.jsx';
import VisitBoard from '../util/visitBoard.jsx';
import Evaluator from '../util/evaluator.jsx';

class Agent {
    constructor(depth) {
        this.depth = depth;
        this.symbol = 'o';
        this.boundary = null;

    }

    calculateNextMove(x, y, board) {
        board.set(x, y, 'x');

        if (this.boundary == null) {
            this.boundary = new Boundary(x, x, y, y);
        } else {
            this.boundary = this.boundary.getNewBoundary(x, y);
        }

        let gameState = new GameState(board, this.boundary, x, y, 'x');

        let result = this.search(0, gameState, 0, -1000000, 1000000);

        this.boundary = this.boundary.getNewBoundary(result.move.x, result.move.y);
        return result.move;
    }

    search(depth, gameState, noMinAgent, alpha, beta) {
        if (depth == this.depth) {
            let score = this.evaluate(gameState);

            gameState.score = score;
            return gameState;
        } else {
            if (noMinAgent == 0) {
                return this.maxValue(gameState, depth, alpha, beta);
            } else {
                return this.minValue(gameState, depth, alpha, beta);
            }
        }
    }

    maxValue(gameState, depth, alpha, beta) {
        let v = -1000000;

        let possibleMoves = gameState.generateSuccessors('o');
        // console.log(possibleMoves);
        let ret = null;

        for (let i = 0; i < possibleMoves.length; i++) {

            let gstate = possibleMoves[i];

            let analyzeMove = this.checkMove(gstate);

            if (analyzeMove == 1) {
                gstate.score = 2000;
                return gstate;
            }

            let newState = this.search(depth, gstate, 1, alpha, beta);
            console.log(newState);
            gstate.score = newState.score;
            if (newState.score != null && newState.score > v) {
                v = newState.score;
                ret = gstate;

                if (v > beta) {
                    return ret;
                }
                alpha = Math.max(alpha, v);
            }
        }

        if (ret == null) {
            console.log('ret max is null');
            for (let i = 0; i < possibleMoves.length; i++) {
                console.log(possibleMoves[i].score);
            }
        }
        return ret;
    }

    minValue(gameState, depth, alpha, beta) {
        let v = 1000000;
        let possibleMoves = gameState.generateSuccessors('x');
        let ret = null;

        for (let i = 0; i < possibleMoves.length; i++) {
            let state = possibleMoves[i];
            let analyzeMove = this.checkMove(state);

            if (analyzeMove == 2) {
                state.score = -2000;
                return state;
            }

            let newState = this.search(depth + 1, state, 0, alpha, beta);
            state.score = newState.score;
            if (newState.score != null && newState.score < v) {
                v = newState.score;

                ret = state;

                if (v < alpha) {
                    return ret;
                }
                beta = Math.min(beta, v);
            }
        }
        if (ret == null) {
            console.log('ret min is null');
            for (let i = 0; i < possibleMoves.length; i++) {
                console.log(possibleMoves[i].score);
            }
        }
        return ret;
    }

    evaluate(gameState) {

        let evaluator = new Evaluator(this.symbol);
        new VisitBoard().travers(gameState.board, evaluator);

        let initialScore = 0;
        if (evaluator.opponentOpenThree >= 2 ||
            evaluator.opponentFour >= 2 ||
            evaluator.opponentOpenFour >= 1 ||
            evaluator.opponentSeparateThree >= 2 ||
            evaluator.opponentOpenThree * evaluator.opponentFour > 0 ||
            evaluator.opponentSeparateThree * evaluator.opponentFour > 0 ||
            evaluator.opponentSeparateThree * evaluator.opponentOpenThree > 0
        ) {
            initialScore = -1000;
        }

        let defensiveRating = 31 * evaluator.opponentOpenFour +
            15 * evaluator.opponentOpenThree +
            15 * evaluator.opponentSeparateThree +
            13 * evaluator.opponentFour +
            3 * evaluator.opponentThree +
            evaluator.opponentOpenTwo;

        let offensiveRating = 26 * evaluator.ourOpenFour +
            16 * evaluator.ourOpenThree +
            6 * evaluator.ourFour +
            evaluator.ourOpenTwo +
            16 * evaluator.ourSeparateThree;

        return offensiveRating - defensiveRating + initialScore;
    }

    checkMove(gameState) {
        let gameStateVisitor = new StateVisitor();
        new VisitBoard().travers(gameState.board, gameStateVisitor);

        if (gameStateVisitor.gameFinished) {
            if (gameStateVisitor.winner == this.symbol) {
                return 1;
            } else {
                return 2;
            }
        }
    }

}

export default Agent;