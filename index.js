const db = require("./modules/data.module.js");
const navigateToChannel = require("./services/navigateToChannel.js");
const subscribe = require("./services/subscribe.js");

async function main() {
  // Step 1.---------------
  let { getBrowser } = require("./modules/browser.module.js");
  const { browser, page } = await getBrowser(db.profileTarget);
  getBrowser = null;

  const pageYT = await navigateToChannel(browser, db.url);

  const subFlag = pageYT && (await subscribe(pageYT));

  console.log(`subFlag: ${subFlag}`);

  // Step 2.--- navigate to channel's short's url page
}
main();
