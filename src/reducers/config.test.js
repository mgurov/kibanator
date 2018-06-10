import configReducer, { initialState } from './config'
import {setConfig, removeConfig} from '../actions'

test('should add new config', () => {
  
  let event = setConfig({
    value: {'blah': 'fooe'}
  })

  expect(configReducer(undefined, event))
    .toEqual({
      watches: [{ 'blah': 'fooe' }]
    })
})

test('should add one more new config', () => {

  let initial = {...initialState, watches: [{"blah": "fooe"}]}

  let event = setConfig({
    value: {'blah': 'fooe2'}
  })

  expect(configReducer(initial, event))
    .toEqual({
      watches: [{ 'blah': 'fooe' }, { 'blah': 'fooe2' }]
    })
})

test('editing existing config', () => {

  let initial = {...initialState, watches: [{"blah": "fooe"}, {"blah": "fooe2"}]}

  let event = setConfig({
    index: 0,
    value: {'blah': 'fooe1'},
  })

  expect(configReducer(initial, event))
    .toEqual({
      watches: [{ 'blah': 'fooe1' }, { 'blah': 'fooe2' }]
    })
})

test('removing existing config', () => {

  let initial = {...initialState, watches: [{"blah": "fooe"}, {"blah": "fooe2"}]}

  let event = removeConfig({
    watchIndex: 1,
  })

  expect(configReducer(initial, event))
    .toEqual({
      watches: [{ 'blah': 'fooe' }]
    })
})

