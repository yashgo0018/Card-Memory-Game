import { Component } from 'react';
import { startNewGame } from '../services/game';

class GamePlay extends Component {
    componentDidMount() {
        startNewGame();
    }

    render() {
        return <div>Hello</div>
    }
}

export default GamePlay;