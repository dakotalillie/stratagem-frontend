import React from 'react';
import PropTypes from 'prop-types';
import FaCheck from 'react-icons/lib/fa/check';

import './countryIcon.css';

export default function CountryIcon({ country, ready }) {
  return (
    <div className="country-icon">
      {ready && (
        <div className="overlay">
          <FaCheck className="checkmark" />  
        </div>
      )}  
      <img
        src={require(`../../../../../img/${country.toLowerCase()}.png`)}
        alt={country}
      />
    </div>
  )
}

CountryIcon.propTypes = {
  country: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
}