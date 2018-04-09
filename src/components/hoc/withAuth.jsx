import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

function withAuth(WrappedComponent, reversed) {
  class authorizedComponent extends React.Component {
    render() {
      if (this.props.loading) {
        return <div />;
      } else if (
        (!reversed && this.props.isLoggedIn) ||
        (reversed && !this.props.isLoggedIn)
      ) {
        return <WrappedComponent />;
      } else {
        return <Redirect to="/" />;
      }
    }
  }

  function mapStateToProps(state) {
    return {
      loading: state.currentUser.loading,
      isLoggedIn: state.isLoggedIn
    };
  }

  return connect(mapStateToProps, {})(authorizedComponent);
}

withAuth.propTypes = {
  WrappedComponent: PropTypes.element.isRequired,
  reversed: PropTypes.bool
};

export default withAuth;
