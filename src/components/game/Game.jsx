import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SiteHeader from '../shared/siteHeader/SiteHeader';
import Board from './board/Board';
import SubBoard from './subBoard/SubBoard';

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
    gameId: this.props.match.params.gameId
  }

  componentDidMount() {
    this.props.fetchGameData(this.state.gameId);
  }

  componentWillUnmount() {
    this.props.clearGameDetailData();
  }

  render() {
    return (
      <div className="game">
        <SiteHeader />
        <Board />
        <SubBoard gameId={this.state.gameId}/>
      </div>
    );
  }
}

export default connect(null, {fetchGameData, clearGameDetailData})(Game);
