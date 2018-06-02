import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { connect } from 'react-redux'

import CountryIcon from '../../shared/countryIcon/CountryIcon';

import CustomPropTypes from '../../../utils/customPropTypes';
import { stringifyOrderData, capitalize } from '../../../utils/stringUtils';
import './gameInfoModal.css';

class GameInfoModal extends React.Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    orders: PropTypes.objectOf(CustomPropTypes.order).isRequired,
  }

  state = {
    active: 'orders'
  }

  handleChangeTab = tab => {
    this.setState({ active: tab });
  }

  renderOrdersPane = () => {
    const { orders } = this.props;
    return (
      <Fragment>
        {Object.values(orders).length ? Object.values(orders).map(order => (
          <div key={order.origin} className="order-row">
            <CountryIcon country={order.country} size={25} />
            <span>{stringifyOrderData(order)}</span>
            {order.auxUnitId && (
              <React.Fragment>
                <CountryIcon country={order.auxCountry} size={25} marginLeft />
                <span>{stringifyOrderData(order, true)}</span>
              </React.Fragment>
            )}
          </div>
        )) : <p className="placeholder-text">No orders to display</p>}
      </Fragment>  
    )
  }

  render() {
    const tabs = ['game', 'orders', 'log'];
    const { active } = this.state;
    const { isOpen, toggle } = this.props;
    return (
      <Modal
        isOpen={isOpen}
        toggle={toggle}
        className="game-info-modal"
        backdrop="static"
      >
        <ModalHeader>
          <ul>
            {tabs.map(tab => (
              <li
                key={tab}  
                className={active === tab ? 'active' : ''}
                onClick={() => this.handleChangeTab(tab)}
              >
                {capitalize(tab)}
              </li>
            ))}
          </ul>
        </ModalHeader>  
        <ModalBody>
          {active === 'orders' && this.renderOrdersPane()}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    orders: state.orders,
  }
}

export default connect(mapStateToProps, null)(GameInfoModal);