import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, } from 'reactstrap';

import './gameInfoModal.css';

export default class GameInfoModal extends React.Component {

  state = {
    active: 'Orders'
  }

  handleChangeTab = tab => {
    this.setState({ active: tab });
  }

  render() {
    const tabs = ['Game', 'Orders', 'Log'];
    const { active } = this.state;
    return (
      <Modal isOpen={true} className="game-info-modal">
        <ModalHeader>
          <ul>
            {tabs.map(tab => (
              <li
                className={active === tab ? 'active' : ''}
                onClick={() => this.handleChangeTab(tab)}
              >
                {tab}
              </li>
            ))}
          </ul>
        </ModalHeader>  
        <ModalBody>
          Hi
        </ModalBody>
      </Modal>
    )
  }
}