/*          Module Description
   1. Checks the url to decides url is channel url / shorts url / video url.
   2. Clicks on like button.
   3. Click to channel name to navigate to that channel.
   4. Waits for channel page banner to load retuns true if loaded else return false.

   Selectors: 
   - Channel name selector on shorts page : "ytd-channel-name#channel-name.style-scope.reel-player-header-renderer";
   - Channel name selector on channel page : "ytd-channel-name#channel-name.style-scope.ytd-video-owner-renderer";
   - Page Banner selector on channal page : "#page-header-banner";
   - Like button selector on shorts & video page : "button[aria-pressed='false'][aria-label^='like']";
*/
const utils = require("../utils/utils.js");

const hitLikeBTN = async (page) => {
  await page.evaluate(() => {
    let el = document.querySelector(
      'button[aria-pressed="false"][aria-label^="like"]'
    );
    if (el) el.click();
  });
};

module.exports = async (browser, url) => {
  console.log("navigateToChannel Started......");

  let pages = await browser.pages();
  let page = pages.find((p) => p.url().includes("youtube.com"));

  /* if u want to always open url in new page then uncomment below line and comment above 2 lines*/
  // let page = await browser.newPage();

  pages.forEach((p) => (p === page ? null : p.close())); // Close all other pages

  await page.bringToFront();
  await page.goto(url);

  await page.waitForSelector("#logo-icon", utils.timeout120Sec);
  url = page.url();

  let selector, elementHandle;

  // 1. if url is not a channel url
  if (!url.includes("@")) {
    let waitLikeAndClickOnChannelName = async (
      selector,
      minWatchSec,
      maxWatchSec
    ) => {
      elementHandle = await page.waitForSelector(selector, utils.timeout30Sec);

      // 1. Wait for random between2-5 seconds and like the short or video
      await utils.randomDelay(minWatchSec, maxWatchSec);
      await hitLikeBTN(page);

      await utils.delay(1000);

      // 2.  Go to Channel Page
      await elementHandle?.click();
    };

    // 1.1 if url is shorts url
    if (url.includes("shorts")) {
      console.log(`url is a short url: ${url}`);

      selector =
        "ytd-channel-name#channel-name.style-scope.reel-player-header-renderer"; // channel name Selector
      await waitLikeAndClickOnChannelName(selector, 2, 5);
    }
    // 1.2 if url is video url
    if (url.includes("watch")) {
      console.log(`url is a video url: ${url}`);

      selector =
        "ytd-channel-name#channel-name.style-scope.ytd-video-owner-renderer"; // channel name Selector
      await waitLikeAndClickOnChannelName(selector, 8, 12);
    }
  } else {
    console.log(
      `Url does not contain @ or shorts or watch. So the url is unrecognized: ${url}`
    );
  }

  let flagEL = await page.waitForSelector(
    "#page-header-banner",
    utils.timeout120Sec
  );

  if (flagEL) return page;
  return false;
};
