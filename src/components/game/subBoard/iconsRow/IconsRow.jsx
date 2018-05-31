import React from 'react';

import CountryIcon from './countryIcon/CountryIcon';
import './iconsRow.css';

export default function IconsRow() {
  const countries = ['austria', 'england', 'france', 'germany', 'italy',
                     'russia', 'turkey']
  return (
    <div className="icons-row">
      {countries.map(country => (
        <CountryIcon
          key={country}  
          country={country}
          ready={false}
        />
      ))}  
    </div>
  )
}