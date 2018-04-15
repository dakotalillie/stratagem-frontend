import React from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  NavbarToggler
} from 'reactstrap';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../../actions';
import './siteHeader.css';

class SiteHeader extends React.Component {
  state = {
    isOpen: false,
    loggedOut: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  logout = () => {
    this.props.logout();
    this.setState({ loggedOut: true });
  };

  render() {
    let loggedOutContent = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </NavItem>
        <NavItem>
          <Link className="nav-link" to="/signup">
            Signup
          </Link>
        </NavItem>
      </Nav>
    );

    let loggedInContent = (
      <Nav className="ml-auto" navbar>
        <NavItem>
          <Link className="nav-link" to="/games">
            Games
          </Link>
        </NavItem>
        <NavItem>
          <NavLink onClick={this.logout}>Logout</NavLink>
        </NavItem>
      </Nav>
    );

    return !this.state.loggedOut ? (
      <div className="site-header">
        <Navbar color="light" light expand="md">
          <Container>
            <Link to="/" className="navbar-brand">
              Stratagem
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              {this.props.isLoggedIn ? loggedInContent : loggedOutContent}
            </Collapse>
          </Container>
        </Navbar>
      </div>
    ) : (
      <Redirect push to="/" />
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.isLoggedIn
  };
}

SiteHeader.propTypes = {
  isLoggedIn: PropTypes.bool
};

export default connect(mapStateToProps, { logout })(SiteHeader);
