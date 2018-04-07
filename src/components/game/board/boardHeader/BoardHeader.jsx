import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import './boardHeader.css';

const BoardHeader = props => {
  return (
    <div className="board-header">
      <Container>
        <Row>
          <Col sm="4" className="col-left">
            <h5 className="date">Spring 1901</h5>
          </Col>
          <Col sm="4" className="col-middle">
            <h3 className="phase">Diplomatic Phase</h3>
          </Col>
          <Col sm="4" className="col-right">
            <ButtonGroup>
              <Button
                outline
                active={props.mode === 'normal'}
                onClick={() => props.setMode('normal')}
              >
                Normal
              </Button>
              <Button
                outline
                active={props.mode === 'support'}
                onClick={() => props.setMode('support')}
              >
                Support
              </Button>
              <Button
                outline
                active={props.mode === 'convoy'}
                onClick={() => props.setMode('convoy')}
              >
                Convoy
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default BoardHeader;

BoardHeader.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired
};
