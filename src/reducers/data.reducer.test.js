import dataReducer, { emptyState } from './data'
import _ from 'lodash'
import LogHit from '../domain/LogHit'
import {messageContainsCaptor, captorToPredicate, messageMatchesRegexCaptor, messageExtractor, keepPending } from '../domain/Captor'
import {captureConsoleError} from '../testutil/funmock'

const testConfig = {
    timeField: 'timestamp',
    messageField: 'message'
}

const toLogHit = (h) => LogHit(h, testConfig)

const captorForMessage = (key, messageSub) => captorToPredicate(messageContainsCaptor(key, messageSub))

describe('data reducer', () => {
    it('intial state is empty state', () => {
        expect(dataReducer(undefined, {}))
            .toEqual(emptyState)
    })
    it('resets back to empty state, except for the captors hack', () => {
        expect(dataReducer({
            data: { hits: [1, 2, 3] },
            captorPredicates: ['a', 'b', 'c']
        }, { type: 'FETCH_STOP_TIMER' }))
            .toEqual({
                ...emptyState,
                captorPredicates: ['a', 'b', 'c'],
            })
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
        const hits = [
            { _id: "1", _source: { timestamp: 1 } },
            { _id: "2", _source: { timestamp: 2 } },
            { _id: "3", _source: { timestamp: 3 } },
        ]

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