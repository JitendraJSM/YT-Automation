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

  let page = await browser.newPage();
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
  }

  let flagEL = await page.waitForSelector(
    "#page-header-banner",
    utils.timeout120Sec
  );

  if (flagEL) return page;
  return false;
};
