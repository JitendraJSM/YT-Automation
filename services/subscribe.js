/*          Module Description
   1. Waits for channel page banner to load.
   2. Using "checkVisibilityAndClick" function 
        i.    Selects visible subscribe btn.
        ii.   Click on that btn.
        iii.  Returns the textContent of btn as "stateOfSubscribeBTN" (i.e. State of subscribe btn).

   3. If stateOfSubscribeBTN != "Subscribed", Click on drop-down icon else step 2.iii. had already clicked on drop-down.
   4. Click on "🔔 All"
   5. Checks that channel is Subscribed or not * clicks 2 times on subscribe current

   Selectors: 
   - Page Banner selector on channal page : "#page-header-banner";
   - Subscribe btn selector in 2 different state: '[aria-label^="Subscribe"], [aria-label^="Current setting"]';
   - Selector for "🔔 All" : "#radio\\:0";
*/

//  This module is ready and tested (Counts: 1) but not refactored.

const utils = require("../utils/utils.js");

module.exports = async (page) => {
  let selector, elementHandle;

  // 1. Waits for channel page banner to load.
  elementHandle = await page.waitForSelector("#page-header-banner");
  await utils.delay(1000);

  // 2. Check and click on subscribe btn
  selector = '[aria-label^="Subscribe"], [aria-label^="Current setting"]';
  let stateOfSubscribeBTN = await checkVisibilityAndClick(page, selector);
  await utils.delay(1000);

  // 3. Click on drop-down
  if (stateOfSubscribeBTN !== "Subscribed") {
    // 2. Drop Down button
    selector = '[aria-label^="Current setting"]';
    elementHandle = await page.waitForSelector(selector);
    await checkVisibilityAndClick(page, selector);
    await utils.delay(1000);
  }

  // 4. Click on "🔔 All"
  elementHandle = await page.waitForSelector("#radio\\:0");
  await utils.delay(1000);
  await elementHandle.click();
  await utils.delay(1000);

  // 5. Checking Subscribed or not
  await checkVisibilityAndClick(page, selector);
  await utils.delay(1000);
  stateOfSubscribeBTN = await checkVisibilityAndClick(page, selector);
  if (stateOfSubscribeBTN !== "Subscribed") return false;
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
