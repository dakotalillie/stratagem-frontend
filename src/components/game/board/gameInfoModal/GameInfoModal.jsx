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
    console.log(orders);
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
            <div key={order.unit_id} className="order-row">
              <CountryIcon country={order.country} size={25} />
              <span>{stringifyOrderData(order)}</span>
              {order.aux_unit_id && (
                <React.Fragment>
                  <CountryIcon country={order.aux_country} size={25} marginLeft />
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
    order.unit_type === 'army' ? items.push('A') : items.push('F');
    items.push(order.origin);
    order.order_type === 'move'
      ? items.push(`move to ${order.destination}`)
      : items.push(order.order_type);
  } else if (aux) {
    order.aux_unit_type === 'army' ? items.push('A') : items.push('F');
    items.push(order.aux_unit_origin);
    order.aux_order_type === 'move'
      ? items.push(`move to ${order.aux_destination}`)
      : items.push(order.aux_order_type);
  }
  return items.join(" ");
}