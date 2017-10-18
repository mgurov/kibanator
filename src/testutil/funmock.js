/**
 * temporary overrides console.error
 * returns the array of calls to it
 */
export function captureConsoleError(action) {

    let originalConsoleError = console.error
    let capturedErrorReports = []
    console.error = function () {
        capturedErrorReports.push(arguments)
    }
    try {
        action()
    } finally {
        console.error = originalConsoleError
    }
    return capturedErrorReports
}