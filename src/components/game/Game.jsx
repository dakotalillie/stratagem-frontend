import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SiteHeader from '../shared/siteHeader/SiteHeader';
import Board from './board/Board';
import SubBoard from './subBoard/SubBoard';
import GameInfoModal from './gameInfoModal/GameInfoModal';

import CustomPropTypes from '../../utils/customPropTypes';
import {
  fetchGameData, clearGameDetailData, receiveGameData
} from '../../actions';
import './game.css';

export const gameSocket = React.createContext();

export class Game extends React.Component {

  static propTypes = {
    match: CustomPropTypes.match,
    fetchGameData: PropTypes.func.isRequired,
    clearGameDetailData: PropTypes.func.isRequired,
    receiveGameData: PropTypes.func.isRequired
  }

  state = {
    gameId: this.props.match.params.gameId,
    gameInfoModal: false,
    gameSocket: null,
  }

  componentDidMount() {
    const { gameId } = this.state;
    this.props.fetchGameData(gameId);

    const gameSocket = new WebSocket(`ws://localhost:8000/ws/games/${gameId}`);
    gameSocket.onopen = () => {};
    gameSocket.onmessage = e => {
      const gameData = JSON.parse(e.data);
      this.props.receiveGameData(gameData);
    };
    gameSocket.onerror = e => { console.log(e); };

    this.setState({ gameSocket });
  }

  componentWillUnmount() {
    this.props.clearGameDetailData();
    this.state.gameSocket.close();
  }

  toggleGameInfoModal = () => {
    this.setState(prevState => ({
      gameInfoModal: !prevState.gameInfoModal
    }));
  }

  render() {
    const { gameId, gameInfoModal } = this.state;
    return (
      <div className="game">
        <gameSocket.Provider value={this.state.gameSocket}>
          <SiteHeader />
          <Board
            toggleGameInfoModal={this.toggleGameInfoModal}
          />
          <SubBoard gameId={gameId} />
          <GameInfoModal
            isOpen={gameInfoModal}
            toggle={this.toggleGameInfoModal}
          />
        </gameSocket.Provider>
      </div>
    );
  }
}

export default connect(null, {
  fetchGameData, clearGameDetailData, receiveGameData
})(Game);
