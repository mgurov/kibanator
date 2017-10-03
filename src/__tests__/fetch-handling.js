import React from 'react';
import { Provider } from 'react-redux'
import { mount } from 'enzyme';
import fetchMock from 'fetch-mock'

import App from '../App';
import { newStore } from '../store'
import { fetchData } from '../actions'

afterEach(() => {
  fetchMock.restore()
});

test('fetch failure should be printed as an alert', () => {
  let store = newStore({synctimes: {selected: "say sync period selected"}})
  let appTree = mount(<Provider store={store}><App /></Provider>)
  //no alerts yet
  expect(appTree.find('#dataFetchErrorAlert').length).toEqual(0)

  fetchMock.mock('*', 401)

  return store.dispatch(fetchData(new Date(), { index: 'blah' })).then(() => {
    expect(appTree.find('#dataFetchErrorAlert').text())
      .toEqual("Error Unauthorized")
  })
});

test('fetch success should lead to a data row shown', () => {
  let store = newStore({synctimes: {selected: "say sync period selected"}})
  let appTree = mount(<Provider store={store}><App /></Provider>)

  //no alerts, no rows yet
  expect(appTree.find('#dataFetchErrorAlert').length).toEqual(0)
  expect(appTree.find('DataRow').length).toEqual(0)

  fetchMock.mock('*', { hits: { hits: [{ _id: "1" }] } })

  return store.dispatch(fetchData(new Date(), { index: 'blah' })).then(() => {
    expect(appTree.find('#dataFetchErrorAlert').length).toEqual(0) //no alerts
    expect(appTree.find('DataRow').length).toEqual(1) //well row
  })
});
