import React from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../shared/siteHeader/SiteHeader';
import './welcome.css';

const Welcome = props => {
  return (
    <div className="welcome">
      <SiteHeader />
      <h1>Stratagem</h1>
      <h5>Online Diplomacy</h5>
      <Link to="/login" className="btn btn-secondary btn-lg">
        Login
      </Link>
      <Link to="/signup" className="btn btn-secondary btn-lg">
        Signup
      </Link>
    </div>
  );
};

export default Welcome;
