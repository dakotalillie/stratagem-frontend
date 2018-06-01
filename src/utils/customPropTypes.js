import PropTypes from 'prop-types';
import territoryData from './territories.json';

const territories = Object.keys(territoryData);
const countries = [
  'Austria', 'England', 'France', 'Germany', 'Italy', 'Russia', 'Turkey'
]

const match = PropTypes.shape({
  isExact: PropTypes.bool,
  params: PropTypes.shape({
    game_id: PropTypes.string,
  }),
  path: PropTypes.string,
  url: PropTypes.string,
});

const unit = PropTypes.shape({
  id: PropTypes.string.isRequired,
  unit_type: PropTypes.oneOf(['fleet', 'army']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC']),
  territory: PropTypes.oneOf(territories).isRequired,
  country: PropTypes.oneOf(countries).isRequired,
  retreating_from: PropTypes.oneOf(territories),
  invaded_from: PropTypes.oneOf(territories)
});

const order = PropTypes.shape({
  unit_id: PropTypes.string.isRequired,
  unit_type: PropTypes.oneOf(['fleet', 'army']).isRequired,
  country: PropTypes.oneOf(countries).isRequired,
  origin: PropTypes.oneOf(territories).isRequired,
  destination: PropTypes.oneOf(territories).isRequired,
  order_type: PropTypes.oneOf(['hold', 'move', 'support', 'convoy']).isRequired,
  coast: PropTypes.oneOf(['NC', 'EC', 'SC']),
  aux_unit_id: PropTypes.string,
  aux_unit_type: PropTypes.oneOf(['fleet', 'army']),
  aux_country: PropTypes.oneOf(countries),
  aux_origin: PropTypes.oneOf(territories),
  aux_destination: PropTypes.oneOf(territories),
  aux_order_type: PropTypes.oneOf(['hold', 'move']),
});

const convoyRoute = PropTypes.shape({
  unit_id: PropTypes.string.isRequired,
  origin: PropTypes.oneOf(territories).isRequired,
  destination: PropTypes.oneOf(territories).isRequired,
  route: PropTypes.arrayOf(unit).isRequired
});

export default { match, order, convoyRoute, unit }