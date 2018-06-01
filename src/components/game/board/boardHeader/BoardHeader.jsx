import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import FaListUl from 'react-icons/lib/fa/list-ul'
import FaCommentsO from 'react-icons/lib/fa/comments-o'

import { title } from '../boardUtils';
import './boardHeader.css';

const BoardHeader = (
  { mode, setMode, phase, season, year, toggleGameInfoModal }
) => {
  return (
    <div className="board-header">
      <Container>
        <Row>
          <Col md="4" className="col-left">
            <FaListUl
              className="list_icon"
              color="#6C757C"
              onClick={toggleGameInfoModal}
            />
            <FaCommentsO className="chat_icon" color="#6C757C" />
          </Col>
          <Col md="4" className="col-middle">
            <h4 className="phase">{title(phase)} Phase</h4>
            <h5 className="date">
              {title(season)} {year}
            </h5>
          </Col>
          <Col md="4" className="col-right">
            <ButtonGroup>
              <Button
                outline
                active={mode === 'normal'}
                onClick={() => setMode('normal')}
              >
                Normal
              </Button>
              <Button
                outline
                active={mode === 'support'}
                onClick={() => setMode('support')}
              >
                Support
              </Button>
              <Button
                outline
                active={mode === 'convoy'}
                onClick={() => setMode('convoy')}
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
