import _ from 'lodash'

export const initialState = {}

const config = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_CAPTOR':{
      let captors = [...(state.captors || []), action.payload.captor]
      return {...state, captors}
    }
    case 'REMOVE_CAPTOR': {
      let captors = _.filter(state.captors, c => c.key !== action.payload.captorKey)
      return {...state, captors}
    }
    default:
      return state
  }
}

const v1Key = 'kibanator_config_v1'

export const readConfigFromLocalStore = () => {
  let newConfig = localStorage.getItem(v1Key)
  if (newConfig) {
    const parsed = jsonParse(newConfig);
    if (!_.isObject(parsed)) {
      console.error("Could not parse configuration", parsed)
    } else {
      return parsed
    }
  }

  let legacyConfig = localStorage.getItem('config')
  if (legacyConfig) {
    legacyConfig = jsonParse(legacyConfig)
    delete legacyConfig.newState
    delete legacyConfig.type
    delete legacyConfig.watches
    let migrated = {
      watches: [legacyConfig],
    }
    writeConfigToLocalStore(migrated)
    return migrated
  }
  return undefined
}

function jsonParse(jsonString) {
  try {
    return JSON.parse(jsonString)
  } catch (e) {
    console.log('error parsing json', jsonString, e)
  }
}

const writeConfigToLocalStore = (config) => {
  localStorage.setItem(v1Key, JSON.stringify(config))
}

export const persistConfigChangesMiddleware = store => {
  return next => action => {

      let r = next(action)

      if (
        action.type === 'ADD_CAPTOR' ||
        action.type === 'REMOVE_CAPTOR' ||
        action.type === 'SET_CONFIG' ||
        action.type === 'RM_CONFIG'
      ) {
        let newConfig = {watches: _.map(store.getState().watches, w => w.config)}
        writeConfigToLocalStore(newConfig)
    }
      return r
  }
}

export default config