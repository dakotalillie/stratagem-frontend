import React from 'react';
import { shallow } from 'enzyme';

import BoardMap from './BoardMap';

describe('BoardMap', () => {

  let props;
  let wrapper;
  beforeEach(() => {
    props = {
      children: null, determineTerrClass: () => 'selected',
      handleClick: jest.fn(), handleMouseEnter: jest.fn(),
      handleMouseLeave: jest.fn(), hovered: null
    }
    wrapper = shallow(<BoardMap {...props} />);
  })

  it('territory classes are determined by invoking determineTerrClass', () => {
    expect(wrapper.find('#Bel').props().className).toEqual('selected');
  });

  it('responds to mouseEnter events', () => {
    wrapper.find('#Bel').simulate('mouseEnter');
    expect(props.handleMouseEnter).toHaveBeenCalled();
  });

  it('responds to mouseLeave events', () => {
    wrapper.find('#Bel').simulate('mouseLeave');
    expect(props.handleMouseLeave).toHaveBeenCalled();
  });

  it('responds to click events', () => {
    wrapper.find('#Bel').simulate('click');
    expect(props.handleClick).toHaveBeenCalled();
  })
})