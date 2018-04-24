import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Welcome from './Welcome';

describe('Welcome', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Welcome />);
  });

  it('Should contain an h1 displaying the word "Stratagem"', () => {
    expect(wrapper.containsMatchingElement(<h1>Stratagem</h1>)).toBe(true);
  })

  it('Should contain an h5 displaying the words "Online Diplomacy"', () => {
    expect(wrapper.containsMatchingElement(
      <h5>Online Diplomacy</h5>
    )).toBe(true);
  })

  it('Should contain a button that links to the login page', () => {
    expect(wrapper.containsMatchingElement(
      <Link to="/login">Login</Link>
    )).toBe(true);
  })

  it('Should contain a button that links to the signup page', () => {
    expect(wrapper.containsMatchingElement(
      <Link to="/signup">Signup</Link>
    )).toBe(true);
  })
})