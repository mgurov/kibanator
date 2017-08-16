import _ from 'lodash'

const data = (state = {isFetching: false, data: {knownIds: {}, hits: []}, error: null}, action) => {
  switch (action.type) {
    case 'FETCHING_DATA':
      return Object.assign({}, state, {isFetching: true})
    case 'RECEIVED_HITS':
      return Object.assign({}, state, {isFetching: false, data: mergeHits(action.data.hits, state.data)})
    case 'FAILED_FETCHING_DATA':
    return Object.assign({}, state, {isFetching: false, error: action.error})
    default:
      return state
  }
}

function mergeHits(hits, originalData) {
  let needClone = true
  let result = originalData
  _.forEach(hits, h => {
    if (result.knownIds[h._id]) {
      return
    }
    if (needClone) {
      result = _.cloneDeep(result)
      needClone = false
    }
    result.knownIds[h._id] = 1
    result.hits.push(h)
  })
  return result
}

export {mergeHits}

export default data