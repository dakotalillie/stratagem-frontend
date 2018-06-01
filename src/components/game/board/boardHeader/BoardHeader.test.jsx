import React from 'react';
import { shallow } from 'enzyme';

import { BoardHeader } from './BoardHeader';

describe('BoardHeader', () => {

  let wrapper;
  let props;
  beforeEach(() => {
    props = {
      phase: 'diplomatic', season: 'spring', year: 1901, mode: 'normal',
      setMode: jest.fn(), toggleGameInfoModal: jest.fn(),
    }
    wrapper = shallow(<BoardHeader {...props} />);
  })

  it('clicking on list icon calls toggleGameInfoModal', () => {
    wrapper.find('.list-icon').simulate('click');
    expect(props.toggleGameInfoModal).toHaveBeenCalled();
  });

  it('clicking on one of the mode buttons calls setMode', () => {
    wrapper.find('#set-support-mode-button').simulate('click');
    expect(props.setMode).toHaveBeenCalledWith('support');
  })
})