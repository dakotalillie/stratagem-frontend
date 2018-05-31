import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  fetchGameData,
  submitOrders,
  clearGameDetailData
} from '../../actions';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import Board from './board/Board';
import SubBoard from './subBoard/SubBoard';
import './game.css';

class Game extends React.Component {

  componentDidMount() {
    this.props.fetchGameData(this.props.match.params.game_id);
  }

  componentWillUnmount() {
    this.props.clearGameDetailData();
  }

  handleSubmitOrders = () => {
    const game_id = this.props.match.params.game_id;
    const orders = this.props.orders;
    const convoy_routes = this.props.convoy_routes;
    this.props.submitOrders({ game_id, orders, convoy_routes });
  };

  render() {
    return (
      <div className="game">
        <SiteHeader />
        <Board />
        <SubBoard
          handleSubmitOrders={this.handleSubmitOrders}
          loading={this.props.gameDataStatus.loading}
        />
      </div>
    );
  }
}

Game.propTypes = {
  orders: PropTypes.object.isRequired,
  gameDataStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired
  }).isRequired,
  fetchGameData: PropTypes.func.isRequired,
  submitOrders: PropTypes.func.isRequired,
  clearGameDetailData: PropTypes.func.isRequired
};

const connectStateToProps = state => ({
  orders: state.orders,
  convoy_routes: state.convoyRoutes,
  gameDataStatus: state.gameDataStatus,
});

export default connect(connectStateToProps, {
  fetchGameData,
  submitOrders,
  clearGameDetailData
})(Game);
