import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Row } from 'reactstrap';

import IconsRow from './iconsRow/IconsRow';
import './subBoard.css';

export default function SubBoard({ handleSubmitOrders }) {
  return (
    <div className="sub-board">
      <Container>
        <Row>
          <Col className="flex-col">
            <IconsRow />
            <Button
              onClick={handleSubmitOrders}
              size="lg"
              className="submit-button"
            >
              Submit Orders
            </Button>
          </Col>  
        </Row>  
      </Container>  
      
    </div>
  )
}

SubBoard.propTypes = {
  handleSubmitOrders: PropTypes.func.isRequired
}