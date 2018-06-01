import React from 'react';
import PropTypes from 'prop-types';
import FaCheck from 'react-icons/lib/fa/check';

import './countryIcon.css';

export default function CountryIcon({ country, ready, size, marginLeft }) {
  return (
    <div className="country-icon">
      {ready && (
        <div className="overlay">
          <FaCheck className="checkmark" />  
        </div>
      )}  
      <img
        src={require(`../../../img/${country.toLowerCase()}.png`)}
        style={{ height: size, marginLeft: marginLeft ? '15px' : '0px' }}
        alt={country}
      />
    </div>
  )
}

CountryIcon.propTypes = {
  country: PropTypes.string.isRequired,
  ready: PropTypes.bool,
  size: PropTypes.number,
  marginLeft: PropTypes.bool,
}

CountryIcon.defaultProps = {
  ready: false,
  size: 40,
  marginLeft: false,
}