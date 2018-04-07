import React from 'react';
import { Alert } from 'reactstrap';

const OrderAlert = props => {
  return (
    <div className="order-alert">
      <Alert colo="success">Order successfully created</Alert>
    </div>
  );
};

export default OrderAlert;
