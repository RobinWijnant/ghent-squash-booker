import * as home from "./actions/home";
import * as history from "./actions/history";
import env from "./utils/env";
import { getBrowser, getPage } from "./utils/puppeteer";

async function main(): Promise<void> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await home.go(page, env.BASE_URL);
  await home.acceptCookies(page);
  await home.login(page, env.USERNAME, env.PASSWORD);

  await history.go(page, env.BASE_URL);
  await history.getLastBookingDate(page);

  await page.waitForSelector("#loool", { timeout: 60 * 60 * 1000 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
