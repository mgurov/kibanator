import fetchStatusReducer, { emptyState } from './fetchStatus'

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
    let whenAction = { type: 'RECEIVED_HITS', timestamp: new Date(), }
    expect(fetchStatusReducer(givenState, whenAction))
        .toEqual({...emptyState,
            isFetching: false,
            lastSync: expect.any(Date),
        })
})

test('max fetch reached', () => {

    let givenState = { ...emptyState, isFetching: true }
    let whenAction = { 
        type: 'RECEIVED_HITS', 
        timestamp: new Date(), 
        maxFetchReached : {
            fetchTotal: 10,
            fetchLimit: 5,
        },
    }
    expect(fetchStatusReducer(givenState, whenAction))
        .toEqual({...emptyState,
            isFetching: false,
            lastSync: expect.any(Date),
            error: expect.objectContaining({name: expect.stringMatching(/fetch limit/)}),
        })
})