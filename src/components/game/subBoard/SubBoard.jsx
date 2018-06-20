import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Col, Container, Row } from 'reactstrap';
import Spinner from 'react-spinkit';

import { gameSocket } from '../Game';
import CustomPropTypes from '../../../utils/customPropTypes';
import { requestOrdersSubmission } from '../../../actions';
import IconsRow from './iconsRow/IconsRow';
import './subBoard.css';

function SubBoard(
  { orders, convoyRoutes, loading, countries, userId, requestOrdersSubmission }
) {

  function handleSubmitOrders(gameSocket) {
    requestOrdersSubmission();
    gameSocket.send(JSON.stringify(
      {
        type: 'submit_orders',
        payload: { userId, orders, convoyRoutes }
      }
    ));
  }

  return (
    <div className="sub-board">
      <Container>
        <Row>
          <Col className="flex-col">
            <IconsRow countries={countries} />
            <gameSocket.Consumer>
              {gameSocket => (
                <Button
                  onClick={() => handleSubmitOrders(gameSocket)}
                  size="lg"
                  className="submit-button"
                > 
                  {loading ? (
                    <Spinner name='ball-clip-rotate' fadeIn='none' />
                  ) : 'Ready'}  
                </Button>
              )}
            </gameSocket.Consumer>
          </Col>  
        </Row>  
      </Container>        
    </div>
  );
}

SubBoard.propTypes = {
  orders: PropTypes.objectOf(CustomPropTypes.order).isRequired,
  convoyRoutes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  countries: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  requestOrdersSubmission: PropTypes.func.isRequired,
};

function connectStateToProps(state) {
  return {
    orders: state.orders,
    convoyRoutes: state.convoyRoutes,
    loading: state.gameDataStatus.loading,
    countries: state.countries,
    userId: state.currentUser ? state.currentUser.id : null,
  };
}

export default connect(connectStateToProps, { requestOrdersSubmission })(SubBoard);