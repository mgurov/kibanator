import captorPredicatesUpdater from './captorPredicatesUpdater'
import {messageMatchesRegexCaptor} from '../domain/Captor'
import {captureConsoleError} from '../testutil/funmock'

test("captorPredicatesUpdater should simply skip failing (regex) predicates for now", () => {

    let captors = [
        messageMatchesRegexCaptor('bad', 'a('),
        messageMatchesRegexCaptor('good', 'a(b)'),
    ]

    let state = {
        config: {
            watches: [
                {captors}
            ]
        },
        data: {},
        view: {
            watchIndex: 0
        }
    }

    let errorsReported = captureConsoleError(() => {
        let hackedActually = captorPredicatesUpdater(state, {type: 'ON_INIT'});
        
            expect(hackedActually.data.captorPredicates.length)
                .toEqual(1)
    })
    expect(errorsReported.length).toEqual(1)
})
