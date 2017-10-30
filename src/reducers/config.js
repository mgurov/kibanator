import update from 'immutability-helper';
import _ from 'lodash'

const defaultConfig = {
  timeField: '@timestamp',
  messageField: '@message',
  serviceField: '@fields.application',
  serviceName: 'yourAppHere',
  levelField: '@fields.level',
  levelValue: 'ERROR',
  index: 'logstash-pro-log4json-*',
  captors: {},
  unitialized: true,
}

const config = (state = defaultConfig, action) => {
  switch (action.type) {
    case 'SET_CONFIG':{
      let newState = Object.assign({}, action, action.newState)
      delete newState.unitialized
      return newState
    }
    case 'ADD_CAPTOR':
      if (_.isEmpty(state.captors)) {
        return Object.assign({}, state, { captors: [action.captor] })
      } else {
        return update(state, { captors: { $push: [action.captor] } })
      }
    case 'REMOVE_CAPTOR':
      let captors = _.filter(state.captors, c => c.key !== action.captorKey)
      return Object.assign({}, state, { captors })
    default:
      return state
  }
}

export default config