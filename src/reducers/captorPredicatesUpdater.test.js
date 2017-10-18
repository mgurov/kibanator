import captorPredicatesUpdater from './captorPredicatesUpdater'
import {messageMatchesRegexCaptor} from '../domain/Captor'
import {captureConsoleError} from '../testutil/funmock'

test("captorPredicatesUpdater should simply skip failing (regex) predicates for now", () => {

    let captors = [
        messageMatchesRegexCaptor('bad', 'a('),
        messageMatchesRegexCaptor('good', 'a(b)'),
    ]

    let errorsReported = captureConsoleError(() => {
        let hackedActually = captorPredicatesUpdater({config: {captors}, data: {}}, {type: 'ON_INIT'});
        
            expect(hackedActually.data.captorPredicates.length)
                .toEqual(1)
    })
    expect(errorsReported.length).toEqual(1)
})
