import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import { connect } from 'react-redux'

import CountryIcon from '../../../shared/countryIcon/CountryIcon';
import './gameInfoModal.css';

class GameInfoModal extends React.Component {

  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    orders: PropTypes.object
  }

  state = {
    active: 'Orders'
  }

  handleChangeTab = tab => {
    this.setState({ active: tab });
  }

  render() {
    const tabs = ['Game', 'Orders', 'Log'];
    const { active } = this.state;
    const { isOpen, toggle, orders } = this.props;
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
                {tab}
              </li>
            ))}
          </ul>
        </ModalHeader>  
        <ModalBody>
          {Object.values(orders).map(order => (
            <div key={order.unitId} className="order-row">
              <CountryIcon country={order.country} size={25} />
              <span>{stringifyOrderData(order)}</span>
              {order.auxUnitId && (
                <React.Fragment>
                  <CountryIcon country={order.auxCountry} size={25} marginLeft />
                  <span>{stringifyOrderData(order, true)}</span>
                </React.Fragment>
              )}
            </div>
          ))}
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

function stringifyOrderData(order, aux = false) {
  let items = [];
  if (!aux) {
    order.unitType === 'army' ? items.push('A') : items.push('F');
    items.push(order.origin);
    order.orderType === 'move'
      ? items.push(`move to ${order.destination}`)
      : items.push(order.orderType);
  } else if (aux) {
    order.auxUnitType === 'army' ? items.push('A') : items.push('F');
    items.push(order.auxUnitOrigin);
    order.auxOrderType === 'move'
      ? items.push(`move to ${order.auxDestination}`)
      : items.push(order.auxOrderType);
  }
  return items.join(" ");
}