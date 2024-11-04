Some Extra Notes:

1. Possbile Url given are as below:
   Shorts URL: https://www.youtube.com/shorts/JeRTOLCx6-Q
   Video URL : https://www.youtube.com/watch?v=SF0w2B6DNUE
   Channel URL : https://www.youtube.com/@flashbackfm

   There is one more type of URL which on resolving could be any of 3 given above ❌
   i.e. Unknown URL : https://youtu.be/kNDPSKnNT8g?si=jA1cQh5sftzxgK0B
   This type of URL always resolved to video URL doesn't matter what was that original is. ✅
   This type of URL is from playlist share BTN

2. Don't think that if video is keep loading so you won't get networkidle0, Even on YT shorts page networkIdle0 event will occur.
   <!-- // Wait for network idle and document load state in parallel -->
   <!-- await Promise.all([
            page.waitForNetworkIdle({ idleTime: 500, timeout: 30000 }),
            page.waitForFunction(() => document.readyState === "complete", {
            timeout: 30000,
          }),
        ]); -->

3. Error due to slow connection. Try increasing the timeout value, or catch UnhandledPromiseRejection on process.

   - The Error is as:
     Attempt 1 failed with error: Navigation timeout of 60000 ms exceeded
     node:internal/process/promises:289
     triggerUncaughtException(err, true /_ fromPromise _/);
     ^

     [UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "Function failed after 30 attempts. with Error: Navigation timeout of 60000 ms exceeded".] {
     code: 'ERR_UNHANDLED_REJECTION'
     }
