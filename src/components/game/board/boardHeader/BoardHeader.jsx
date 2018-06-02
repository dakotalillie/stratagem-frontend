import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, ButtonGroup, Col, Container, Row } from 'reactstrap';
import FaListUl from 'react-icons/lib/fa/list-ul'
import FaCommentsO from 'react-icons/lib/fa/comments-o'

import { capitalize } from '../../../../utils/stringUtils';
import './boardHeader.css';

export function BoardHeader(
  { phase, season, year, mode, setMode, toggleGameInfoModal }
) {
  return (
    <div className="board-header">
      <Container>
        <Row>
          <Col md="4" className="col-left">
            <FaListUl
              className="list-icon"
              color="#6C757C"
              onClick={toggleGameInfoModal}
            />
            <FaCommentsO className="chat-icon" color="#6C757C" />
          </Col>
          <Col md="4" className="col-middle">
            <h4 className="phase">{phase ? capitalize(phase) : ''} Phase</h4>
            <h5 className="date">
              {season ? capitalize(season) : ''} {year}
            </h5>
          </Col>
          <Col md="4" className="col-right">
            <ButtonGroup>
              <Button
                outline
                id="set-normal-mode-button"
                disabled={phase !== 'diplomatic'}
                active={mode === 'normal'}
                onClick={() => setMode('normal')}
              >
                Normal
              </Button>
              <Button
                outline
                id="set-support-mode-button"
                disabled={phase !== 'diplomatic'}
                active={mode === 'support'}
                onClick={() => setMode('support')}
              >
                Support
              </Button>
              <Button
                outline
                id="set-convoy-mode-button"
                disabled={phase !== 'diplomatic'}
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

BoardHeader.propTypes = {
  phase: PropTypes.oneOf(['diplomatic', 'retreat', 'reinforcement']),
  season: PropTypes.oneOf(['spring', 'fall']),
  year: PropTypes.number,
  mode: PropTypes.oneOf(['normal', 'convoy', 'support']).isRequired,
  setMode: PropTypes.func.isRequired,
  toggleGameInfoModal: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {
    phase: state.currentTurn.phase,
    season: state.currentTurn.season,
    year: state.currentTurn.year
  };
}

export default connect(mapStateToProps, null)(BoardHeader);
