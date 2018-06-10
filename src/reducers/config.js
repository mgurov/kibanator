import update from 'immutability-helper';
import _ from 'lodash'

export const initialState = {watches: []}

const config = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_CONFIG': {
      let {index, value} = action.payload
      let watches = [...state.watches]
      if (index === undefined) {
        watches.push(value)
      } else {
        watches[index] = value
      }
      return {...state, watches}
    }
    case 'RM_CONFIG': {
      let {watchIndex} = action.payload
      let watches = state.watches.filter((e, i) => i !== watchIndex )
      return {...state, watches}
    }
    case 'ADD_CAPTOR':{
      const watch = state.watches[action.payload.watchIndex]
      let updateAction
      if (_.isEmpty(watch.captors)) {
        updateAction = { $set: [action.payload.captor] }
      } else {
        updateAction = { $push: [action.payload.captor] }
      }
      return update(state, {
        watches: {
          [action.payload.watchIndex]: {
            captors: updateAction
          }
        }
      })
    }
    case 'REMOVE_CAPTOR': {
      const watch = state.watches[action.payload.watchIndex]
      let captors = _.filter(watch.captors, c => c.key !== action.payload.captorKey)
      let updateAction = { $set: captors }
      return update(state, {
        watches: {
          [action.payload.watchIndex]: {
            captors: updateAction
          }
        }
      })

    }
    default:
      return state
  }
}

const v1Key = 'kibanator_config_v1'

export const readConfigFromLocalStore = () => {
  let newConfig = localStorage.getItem(v1Key)
  if (newConfig) {
    const parsed = JSON.parse(newConfig);
    if (!_.isObject(parsed)) {
      console.error("Could not parse configuration", parsed)
    } else {
      return parsed
    }
  }

  let legacyConfig = localStorage.getItem('config')
  if (legacyConfig) {
    legacyConfig = JSON.parse(legacyConfig)
    delete legacyConfig.newState
    delete legacyConfig.type
    delete legacyConfig.watches
    legacyConfig.id = legacyConfig.serviceName
    let migrated = {
      watches: [legacyConfig],
    }
    writeConfigToLocalStore(migrated)
    return migrated
  }
  return undefined
}

export const writeConfigToLocalStore = (config) => {
  localStorage.setItem(v1Key, JSON.stringify(config))
}

export default config