const chrome = require("chrome-aws-lambda")
const puppeteer = require("puppeteer-core")

let _page

async function getPage() {
  if (_page) {
    return _page
  }

  let executablePath = await chrome.executablePath
  let headless = chrome.headless
  let args = chrome.args

  if (!executablePath) {
    args = []
    executablePath =
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    headless = true
  }

  const options = {
    args,
    headless,
    executablePath,
  }

  const browser = await puppeteer.launch(options)
  // eslint-disable-next-line
  _page = await browser.newPage()

  await _page.setCookie({
    name: "cookieConsent",
    value: "true",
    domain: "derkonzert.de",
  })

  return _page
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

module.exports.getScreenshot = async function getScreenshot(url, type, isDev) {
  const page = await getPage(isDev)
  await page.setViewport({ width: 800, height: 500 })
  await page.goto(url)
  // TODO: find better way to check if content was loaded
  await sleep(3000)
  const file = await page.screenshot({ type })
  return file
}
