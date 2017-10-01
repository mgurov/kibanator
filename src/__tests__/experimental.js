import React from 'react';
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock'

import App from '../App';
import {newStore} from '../store'

afterEach(() => {
  fetchMock.restore()
});

xtest('snapshot testing example', () => {
  const rendered = <Provider store={newStore()}><App /></Provider>
  const component = renderer.create(rendered);
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});


test('clicking at the first fetch option changes the controls shown', () => {

  const rendered = <Provider store={newStore()}><App /></Provider>
  const wrapper = mount(rendered);

  expect(wrapper.find('SyncTimeControl').length).toEqual(0)
  expect(wrapper.find('SelectTimeRange').length).toEqual(1)

  fetchMock.mock('*', 401)
  let firstTimerangeButton = wrapper.find('button.preselected-time-range').first()
  firstTimerangeButton.simulate('click')

  expect(wrapper.find('SyncTimeControl').length).toEqual(1)
  expect(wrapper.find('SelectTimeRange').length).toEqual(0)
});