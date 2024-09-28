//  This module is ready and tested (Counts: 1) but not refactored.
const utils = require("../utils/utils.js");

// 1. Opens a new page in browser for subscription. (as last page have some cache)
// 2. url could be channel url or shorts url
module.exports = async (page) => {
  let selector, elementHandle;

  // 1. Subscribe button
  elementHandle = await page.waitForSelector("#page-header-banner");
  await utils.delay(1000);
  selector = '[aria-label^="Subscribe"], [aria-label^="Current setting"]';
  let subState = await checkVisibilityAndClick(page, selector);
  await utils.delay(1000);

  if (subState !== "Subscribed") {
    // 2. Drop Down button
    selector = '[aria-label^="Current setting"]';
    elementHandle = await page.waitForSelector(selector);
    await checkVisibilityAndClick(page, selector);
    await utils.delay(1000);
  }

  // 3. Radio button (Bell-icon)
  elementHandle = await page.waitForSelector("#radio\\:0");
  await utils.delay(1000);
  await elementHandle.click();

  // 4. Checking Subscribed or not
  await utils.delay(1000);
  await checkVisibilityAndClick(page, selector);
  await utils.delay(1000);
  subState = await checkVisibilityAndClick(page, selector);
  if (subState !== "Subscribed") return false;
  return true;
};

// ---- Utilities ----

async function checkVisibilityAndClick(page, selector) {
  return await page.evaluate((selector) => {
    const subBTN = Array.from(document.querySelectorAll(selector)).find((el) =>
      el.checkVisibility()
    );
    subBTN.click();
    return subBTN.textContent;
  }, selector);
}
