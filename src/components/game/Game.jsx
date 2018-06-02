import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SiteHeader from '../shared/siteHeader/SiteHeader';
import Board from './board/Board';
import SubBoard from './subBoard/SubBoard';
import GameInfoModal from './gameInfoModal/GameInfoModal';

import CustomPropTypes from '../../utils/customPropTypes';
import { fetchGameData, clearGameDetailData } from '../../actions';
import './game.css';

export class Game extends React.Component {

  static propTypes = {
    match: CustomPropTypes.match,
    fetchGameData: PropTypes.func.isRequired,
    clearGameDetailData: PropTypes.func.isRequired
  }

  state = {
    gameId: this.props.match.params.gameId,
    gameInfoModal: false,
  }

  componentDidMount() {
    this.props.fetchGameData(this.state.gameId);
  }

  componentWillUnmount() {
    this.props.clearGameDetailData();
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
        <SiteHeader />
        <Board
          toggleGameInfoModal={this.toggleGameInfoModal}
        />
        <SubBoard gameId={gameId} />
        <GameInfoModal
          isOpen={gameInfoModal}
          toggle={this.toggleGameInfoModal}
        />
      </div>
    );
  }
}

export default connect(null, {fetchGameData, clearGameDetailData})(Game);
