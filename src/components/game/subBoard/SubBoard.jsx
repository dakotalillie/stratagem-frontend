import React from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Container, Row } from 'reactstrap';
import Spinner from 'react-spinkit';

import IconsRow from './iconsRow/IconsRow';
import './subBoard.css';

export default function SubBoard({ handleSubmitOrders, loading, countries }) {
  return (
    <div className="sub-board">
      <Container>
        <Row>
          <Col className="flex-col">
            <IconsRow countries={countries} />
            <Button
              onClick={handleSubmitOrders}
              size="lg"
              className="submit-button"
            > 
              {loading ? (
                <Spinner name='ball-clip-rotate' fadeIn='none' />
              ) : 'Ready'}  
            </Button>
          </Col>  
        </Row>  
      </Container>  
      
    </div>
  )
}

SubBoard.propTypes = {
  handleSubmitOrders: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  countries: PropTypes.object.isRequired,
}