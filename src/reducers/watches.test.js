import watchesReducer from './watches'
import {setConfig, removeConfig} from '../actions'

test('should add new config', () => {
  
  let event = setConfig({
    value: {'blah': 'fooe'}
  })

  expect(watchesReducer(undefined, event))
    .toMatchObject([{'config': { 'blah': 'fooe' }}])
})

test('should add one more new config', () => {

  let initial = [{config: {"blah": "fooe"}}]

  let event = setConfig({
    value: {'blah': 'fooe2'}
  })

  expect(watchesReducer(initial, event))
    .toMatchObject([{config: { 'blah': 'fooe' }}, {config: { 'blah': 'fooe2' }}])
})

test('editing existing config', () => {

  let initial = [{config: {"blah": "fooe"}}, {config: {"blah": "fooe2"}}]

  let event = setConfig({
    index: 0,
    value: {'blah': 'fooe1'},
  })

  expect(watchesReducer(initial, event))
    .toMatchObject([{config: { 'blah': 'fooe1' }}, {config: { 'blah': 'fooe2' }}])
    
})

test('removing existing config', () => {

  let initial = [{config: {"blah": "fooe"}}, {config: {"blah": "fooe2"}}]

  let event = removeConfig({
    watchIndex: "1",
  })
  
  const actual = watchesReducer(initial, event)
  expect(actual).toMatchObject([{config: {"blah": "fooe"}}])
})

