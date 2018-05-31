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
    const { orders, convoy_routes, userId } = this.props;  
    this.props.submitOrders({ game_id, orders, convoy_routes, userId });
  };

  render() {
    return (
      <div className="game">
        <SiteHeader />
        <Board />
        <SubBoard
          handleSubmitOrders={this.handleSubmitOrders}
          loading={this.props.gameDataStatus.loading}
          countries={this.props.countries}
        />
      </div>
    );
  }
}

Game.propTypes = {
  orders: PropTypes.object.isRequired,
  convoy_routes: PropTypes.arrayOf(PropTypes.object).isRequired,
  gameDataStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.bool.isRequired
  }).isRequired,
  countries: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  fetchGameData: PropTypes.func.isRequired,
  submitOrders: PropTypes.func.isRequired,
  clearGameDetailData: PropTypes.func.isRequired
};

const connectStateToProps = state => ({
  orders: state.orders,
  convoy_routes: state.convoyRoutes,
  gameDataStatus: state.gameDataStatus,
  countries: state.countries,
  userId: state.currentUser ? state.currentUser.id : null,
});

export default connect(connectStateToProps, {
  fetchGameData,
  submitOrders,
  clearGameDetailData
})(Game);
