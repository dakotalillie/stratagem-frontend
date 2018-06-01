import PropTypes from 'prop-types';
import territoryData from './territories.json';

const territories = Object.keys(territoryData);
const countries = [
  'Austria', 'England', 'France', 'Germany', 'Italy', 'Russia', 'Turkey'
]

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
  territory: PropTypes.oneOf(territories).isRequired,
  country: PropTypes.oneOf(countries).isRequired,
  retreatingFrom: PropTypes.oneOf(territories),
  invadedFrom: PropTypes.oneOf(territories)
});

CustomPropTypes.order = PropTypes.shape({
  unitId: PropTypes.string.isRequired,
  unitType: PropTypes.oneOf(['fleet', 'army']).isRequired,
  country: PropTypes.oneOf(countries).isRequired,
  origin: PropTypes.oneOf(territories).isRequired,
  destination: PropTypes.oneOf(territories).isRequired,
  order_type: PropTypes.oneOf(['hold', 'move', 'support', 'convoy']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC']),
  auxUnitId: PropTypes.string,
  auxUnitType: PropTypes.oneOf(['fleet', 'army']),
  auxCountry: PropTypes.oneOf(countries),
  auxOrigin: PropTypes.oneOf(territories),
  auxDestination: PropTypes.oneOf(territories),
  auxOrderType: PropTypes.oneOf(['hold', 'move']),
});

CustomPropTypes.convoyRoute = PropTypes.shape({
  unitId: PropTypes.string.isRequired,
  origin: PropTypes.oneOf(territories).isRequired,
  destination: PropTypes.oneOf(territories).isRequired,
  route: PropTypes.arrayOf(CustomPropTypes.unit).isRequired
});

CustomPropTypes.formField = PropTypes.shape({
  value: PropTypes.string.isRequired,
  validation: PropTypes.string,
  error: PropTypes.string.isRequired
});

export default CustomPropTypes;