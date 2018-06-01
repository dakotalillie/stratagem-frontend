import React from 'react';
import PropTypes from 'prop-types';

import CountryIcon from '../../../shared/countryIcon/CountryIcon';
import './iconsRow.css';

export default function IconsRow({ countries }) {
  const countryObs = Object.keys(countries).map(name => countries[name])
  return (
    <div className="icons-row">
      {countryObs.map(country => (
        <CountryIcon
          key={country.id}  
          country={country.name}
          ready={country.ready}
        />
      ))}  
    </div>
  )
}

IconsRow.propTypes = {
  countries: PropTypes.object.isRequired
}