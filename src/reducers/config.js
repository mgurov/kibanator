const defaultConfig = {
  timeField : '@timestamp',
  appField : '@fields.application',
  index : 'logstash-tst-log4json-*'
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