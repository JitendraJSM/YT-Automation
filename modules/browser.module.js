const utlis = require("../utils/utils.js");

// ---- Part-1 Imports ----
const { promisify } = require("util");
const { exec, spawn } = require("child_process");
const promisifiedExec = promisify(exec);

// ---- Part-2 Imports ----
const puppeteer = require("puppeteer-extra");
const stealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(stealth());

// ---- Variables ----
// const port = process.env.CHROME_DEBUG_PORT;
const port = 9222;
// const chatURL = process.env.CHAT_URL;
const chatURL = "https://www.youtube.com/";

// ============ Main GetBrowser Function ============
exports.getBrowser = async (profileTarget) => {
  profileTarget ||= process.env.CHORME_TARGET_PROFILE;

  const wsUrl = await getDebuggerUrl(profileTarget);

  await writeWSinFile(wsUrl); // Only for testing purpose

  // console.log(wsUrl);

  const { browser, page } = await utlis.robustPolling(
    pptrConnect,
    // { timeoutMs: 120000 },
    {},
    wsUrl
  );
  return { browser, page };
};

// ---- Part 1 Open & Get Debugger Url ----
// 1.1 Get webSocketDebuggerUrl
async function getDebuggerUrl(profileTarget) {
  try {
    let data;
    try {
      data = await getUrl();
    } catch (err) {
      null;
    }
    if (data) return JSON.parse(data).webSocketDebuggerUrl;

    await openChromeInstance(profileTarget);

    // Polling the function: Get webSocketDebuggerUrl
    data = JSON.parse(
      await utlis.robustPolling(getUrl, {}, port)
    ).webSocketDebuggerUrl;
    return data;
  } catch (error) {
    console.log(`Error in getDebuggerUrl function : `, error.message);
    console.log(error);
  }
}

// 1.2 Get webSocketDebuggerUrl
async function getUrl() {
  const urlCommand = `curl http://127.0.0.1:${port}/json/version`;
  const { stdout } = await promisifiedExec(urlCommand);
  return stdout;
}

// 1.3 Open Chrome Instance
async function openChromeInstance(profileTarget) {
  console.log(
    `In openChromeInstance, Profile to be opened has target: ${profileTarget}`
  );

  const chromePath = `C:/Program Files/Google/Chrome/Application/chrome.exe`;
  const openCommand = `"${chromePath}"  --profile-directory="Profile ${profileTarget}" --remote-debugging-port=${port} --window-size=516,952`;

  const chromeProcess = spawn(openCommand, [], {
    shell: true,
    detached: true,
    stdio: "ignore",
  });

  await utlis.delay(3000);

  // Close the child process if it still running
  if (chromeProcess && !chromeProcess.killed) {
    chromeProcess.kill("SIGKILL"); // Terminate the Chrome process
  }
}

// ---- Part 2 Connect Chorme instance to  PPTR ----
async function pptrConnect(wsUrl) {
  if (!wsUrl) {
    wsUrl = await readWSfromFile();
  }
  // try {
  const browser = await puppeteer.connect({
    browserWSEndpoint: wsUrl,
    defaultViewport: false,
  });

  const pages = await browser.pages();
  let page = pages.find(
    (p) =>
      p.url().includes(chatURL) ||
      p.url() === "about:blank" ||
      p.url() === "chrome://new-tab-page/"
  );
  if (!page) {
    console.log("No blank page found");
    page = await browser.newPage();
    pages.forEach((p) => p.close()); // Close all other pages
  }

  if (!page.url().includes(chatURL))
    await page.goto(chatURL, {
      waitUntil: ["load", "domcontentloaded", "networkidle0"],
      timeout: 60000,
    });

  //   require("../Utlis/pageUtils.js")(page); //hookMethodsOnPage(page);

  console.log("Puppeteer Connected.");
  return { browser, page };
  // } catch (error) {
  //   console.log(`Error in pptrConnect function : `, error.message);
  //   console.log(error);
  // }
}

// only for testing purppose
exports.pptrConnect = pptrConnect;

const writeWSinFile = async (ws) => {
  const fs = require("fs");
  fs.writeFileSync("currentWS.txt", ws);
};
async function readWSfromFile() {
  const fs = require("fs");
  return fs.readFileSync("currentWS.txt", "utf8");
}
