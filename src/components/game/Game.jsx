import React from 'react';
import { Button } from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { fetchGameData, submitOrders } from '../../actions';
import Board from './board/Board';
import SiteHeader from '../shared/siteHeader/SiteHeader';
// import OrderAlert from './orderAlert/OrderAlert';
import './game.css';

class Game extends React.Component {
  componentDidMount() {
    this.props.fetchGameData(this.props.match.params.game_id);
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
        <Button onClick={this.handleSubmitOrders} className="submit-button">
          Submit Orders
        </Button>
      </div>
    );
  }
}

Game.propTypes = {
  orders: PropTypes.object.isRequired,
  fetchGameData: PropTypes.func.isRequired,
  submitOrders: PropTypes.func.isRequired
};

const connectStateToProps = state => ({
  orders: state.orders,
  convoy_routes: state.convoyRoutes
});

export default connect(connectStateToProps, { fetchGameData, submitOrders })(
  Game
);
