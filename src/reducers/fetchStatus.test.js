import fetchStatusReducer, { emptyState } from './fetchStatus'
import {receiveData} from '../actions/fetching'

test('set isFetching', () => {
    expect(fetchStatusReducer(emptyState, { type: 'FETCHING_DATA' }))
        .toHaveProperty('isFetching', true)
})

test('Error set upon error', () => {
    let givenState = { ...emptyState, isFetching: true }
    let whenAction = { type: 'FAILED_FETCHING_DATA', error: 'Error' }
    expect(fetchStatusReducer(givenState, whenAction))
        .toEqual({...emptyState,
            isFetching: false,
            error: 'Error',
        })
})

test('should reset isFetching and last sync upon data received', () => {
    let givenState = { ...emptyState, isFetching: true }
    let whenAction = receiveData({hits:{}, config: {}, timestamp: new Date()})
    expect(fetchStatusReducer(givenState, whenAction))
        .toEqual({...emptyState,
            isFetching: false,
            lastSync: expect.any(Date),
        })
})