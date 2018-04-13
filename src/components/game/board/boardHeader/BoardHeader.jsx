import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import { title } from '../boardUtils';
import './boardHeader.css';

const BoardHeader = props => {
  return (
    <div className="board-header">
      <Container>
        <Row>
          <Col md="4" className="col-left">
            <h5 className="date">
              {title(props.season)} {props.year}
            </h5>
          </Col>
          <Col md="4" className="col-middle">
            <h4 className="phase">{title(props.phase)} Phase</h4>
          </Col>
          <Col md="4" className="col-right">
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

function mapStateToProps(state) {
  return {
    phase: state.currentTurn.phase,
    season: state.currentTurn.season,
    year: state.currentTurn.year
  };
}

export default connect(mapStateToProps, null)(BoardHeader);

BoardHeader.propTypes = {
  mode: PropTypes.string.isRequired,
  setMode: PropTypes.func.isRequired,
  phase: PropTypes.oneOf(['diplomatic', 'retreat', 'reinforcement']),
  season: PropTypes.oneOf(['spring', 'fall']),
  year: PropTypes.number
};
