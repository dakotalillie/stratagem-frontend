import React from 'react';
import {
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  NavbarToggler
} from 'reactstrap';
import { Link } from 'react-router-dom';

class SiteHeader extends React.Component {
  state = {
    isOpen: false
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div className="site-header">
        <Navbar color="light" light expand="md">
          <Container>
            <Link to="/" className="navbar-brand">
              Stratagem
            </Link>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
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
            </Collapse>
          </Container>
        </Navbar>
      </div>
    );
  }
}

export default SiteHeader;
