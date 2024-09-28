Some Extra Notes:

1. Error due to slow connection. Try increasing the timeout value, or catch UnhandledPromiseRejection on process.

   - The Error is as:
     Attempt 1 failed with error: Navigation timeout of 60000 ms exceeded
     node:internal/process/promises:289
     triggerUncaughtException(err, true /_ fromPromise _/);
     ^

     [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Function failed after 30 attempts. with Error: Navigation timeout of 60000 ms exceeded".] {
     code: 'ERR_UNHANDLED_REJECTION'
     }
