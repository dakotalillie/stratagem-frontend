import PropTypes from 'prop-types';
import territoryData from './territories.json';
import { COUNTRY_NAMES } from './constants';

const mainAbbreviations = Object.keys(territoryData);
const coastAbbreviations = [
  'Stp_SC', 'Stp_NC', 'Spa_NC', 'Spa_SC', 'Bul_EC', 'Bul_SC'
];
const TERRITORY_ABBREVIATIONS = [...mainAbbreviations, ...coastAbbreviations];
const ORDER_TYPES = ['hold', 'move', 'support', 'convoy', 'create', 'delete'];

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
  id: PropTypes.string,
  unitType: PropTypes.oneOf(['fleet', 'army']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC', '']).isRequired,
  territory: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
  country: PropTypes.oneOf(COUNTRY_NAMES).isRequired,
  retreatingFrom: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
  invadedFrom: PropTypes.oneOf(TERRITORY_ABBREVIATIONS),
});

CustomPropTypes.order = PropTypes.shape({
  unitId: PropTypes.string,
  unitType: PropTypes.oneOf(['fleet', 'army']).isRequired,
  country: PropTypes.oneOf(COUNTRY_NAMES).isRequired,
  origin: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  destination: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  orderType: PropTypes.oneOf(ORDER_TYPES).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC', '']).isRequired,
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
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  abbreviation: PropTypes.oneOf(TERRITORY_ABBREVIATIONS).isRequired,
  owner: PropTypes.oneOf(COUNTRY_NAMES).isRequired,
});

CustomPropTypes.currentUser = PropTypes.shape({
  loading: PropTypes.bool.isRequired,
  id: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
});

CustomPropTypes.countries = PropTypes.objectOf(PropTypes.shape({
  id: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  territories: PropTypes.arrayOf(
    PropTypes.oneOf(TERRITORY_ABBREVIATIONS)
  ).isRequired,
  units: PropTypes.arrayOf(
    PropTypes.oneOf(TERRITORY_ABBREVIATIONS)
  ).isRequired,
  retreatingUnits: PropTypes.arrayOf(
    PropTypes.oneOf(TERRITORY_ABBREVIATIONS)
  ).isRequired,
  ready: PropTypes.bool.isRequired,
}));

CustomPropTypes.currentTurn = PropTypes.shape({
  season: PropTypes.oneOf(['spring', 'fall']),
  year: PropTypes.number,
  phase: PropTypes.oneOf(['diplomatic', 'retreat', 'reinforcement']),
  createdAt: PropTypes.string,
})

export default CustomPropTypes;