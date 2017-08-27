const defaultConfig = {
  timeField : '@timestamp',
  serviceField : '@fields.application',
  serviceName: 'yourAppHere',
  index : 'logstash-tst-log4json-*',
}

const config = (state = defaultConfig, action) => {
  switch (action.type) {
    case 'SET_CONFIG':
      return action.newState
    default:
      return state
  }
}

export default config