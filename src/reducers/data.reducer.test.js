import dataReducer, { emptyState } from './data'


describe('data reducer', () => {
    it('intial state is empty state', () => {
        expect(dataReducer(undefined, {}))
            .toEqual(emptyState)
    })
    it('resets back to empty state', () => {
        expect(dataReducer({
            data: { hits: [1, 2, 3] },
            captorPredicates: ['a', 'b', 'c']
        }, { type: 'RESET_DATA' }))
            .toEqual(emptyState)
    })

    it('shall ack all', () => {

        let initialState = {
            ...emptyState,
            timeline: {
                pending: [
                        {id: "1"},
                        {id: "2"},
                        {id: "3"},
                    ]
            },
            acked: {
                "0": true,
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_ALL',
        }))
            .toEqual({
                ...initialState,
                acked: {'0': true, '1': true, '2': true, '3': true,}
            })
    })

    it('shall ack by tag', () => {

        let initialState = {
            ...emptyState,
            timeline: {
                pending: [
                        {id: "1", tags: ["a"]},
                        {id: "2", tags: ["b", "c"]},
                        {id: "3", tags: ["d", "a"]},
                    ],
                'captures.a': [{id: "1"}, {id: "3"}],
    
            },
            acked: {
                "0": true,
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_TAG',
            payload: {tag: 'a'}
        }))
            .toEqual({
                ...initialState,
                acked: {'0': true, '1': true, '3': true,}
            })
    })

    it('shall ack till id', () => {
        let initialState = {
            ...emptyState,
            timeline: {
                pending: [
                        {id: "1"},
                        {id: "2"},
                        {id: "3"},
                    ]
            },
            acked: {
                "0": true,
            }
        }
        expect(dataReducer(initialState, {
            type: 'ACK_TILL_ID',
            id: '2',
        }))
            .toEqual({
                ...initialState,
                acked: {'0': true, '1': true, '2': true}
            })
    })

    it('shall ack id', () => {
        let initialState = {
            ...emptyState,
            acked: {"1": true}
        }
        expect(dataReducer(initialState, {
            type: 'ACK_ID',
            id: '2',
        }))
            .toEqual({
                ...initialState,
                acked: {"1": true, '2': true}
            })
    })
});