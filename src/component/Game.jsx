import React from 'react';
import Board from './Board';

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.status = 'unfinished';
    }
    state = {}

    finishGame(status) {
        this.setState({ status: status });
        console.log(status);
    }

    render() {
        return (<div className='game'>
            <Board size={10}
                finishGame={(status) => this.finishGame(status)}
            />
        </div>);
    }
}

export default Game;