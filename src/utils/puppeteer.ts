import puppeteer, { type Page, type Browser } from "puppeteer";

export async function getBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--lang=nl",
    ],
    headless: false,
    defaultViewport: { height: 720, width: 1280 },
  });
}

export async function getPage(browser: Browser): Promise<Page> {
  const [page] = await browser.pages();

  page.setDefaultTimeout(15 * 1000);

  return page;
}
