import PropTypes from 'prop-types';
import territoryData from './territories.json';
import { COUNTRY_NAMES } from './constants';

const TERRITORY_ABBREVIATIONS = Object.keys(territoryData);

const CustomPropTypes = {}

CustomPropTypes.match = PropTypes.shape({
  isExact: PropTypes.bool,
  params: PropTypes.shape({
    gameId: PropTypes.string,
  }),
  path: PropTypes.string,
  url: PropTypes.string,
});

CustomPropTypes.unit = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unitType: PropTypes.oneOf(['fleet', 'army']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC']),
  territory: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  country: PropTypes.oneOf(COUNTRY_NAMES).isRequired,
  retreatingFrom: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
  invadedFrom: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
});

CustomPropTypes.order = PropTypes.shape({
  unitId: PropTypes.string.isRequired,
  unitType: PropTypes.oneOf(['fleet', 'army']).isRequired,
  country: PropTypes.oneOf(COUNTRY_NAMES).isRequired,
  origin: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  destination: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  order_type: PropTypes.oneOf(['hold', 'move', 'support', 'convoy']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC']),
  auxUnitId: PropTypes.string,
  auxUnitType: PropTypes.oneOf(['fleet', 'army']),
  auxCountry: PropTypes.oneOf(COUNTRY_NAMES),
  auxOrigin: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
  auxDestination: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
  auxOrderType: PropTypes.oneOf(['hold', 'move']),
});

CustomPropTypes.convoyRoute = PropTypes.shape({
  unitId: PropTypes.string.isRequired,
  origin: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  destination: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  route: PropTypes.arrayOf(CustomPropTypes.unit).isRequired,
});

CustomPropTypes.formField = PropTypes.shape({
  value: PropTypes.string.isRequired,
  validation: PropTypes.string,
  error: PropTypes.string.isRequired,
});

CustomPropTypes.territory = PropTypes.shape({
  abbreviation: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  coordinates: PropTypes.objectOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  })).isRequired,
  landNeighbors: PropTypes.arrayOf(
    PropTypes.oneOf(TERRITORY_ABBREVIATIONS)
  ).isRequired,
  name: PropTypes.string.isRequired,
  seaNeighbors: PropTypes.objectOf(
    PropTypes.arrayOf(PropTypes.oneOf(TERRITORY_ABBREVIATIONS))
  ).isRequired,
  supplyCenter: PropTypes.bool.isRequired,
  type: PropTypes.oneOf(['water', 'coastal', 'inland']),
});

export default CustomPropTypes;