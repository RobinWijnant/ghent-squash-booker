import * as home from "./pages/home";
import * as history from "./pages/history";
import env from "./utils/env";
import { getBrowser, getPage } from "./utils/puppeteer";

async function main(): Promise<void> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await home.go(page, env.BASE_URL);
  await home.acceptCookies(page);
  await home.login(page, env.USERNAME, env.PASSWORD);
  console.log("Login successful");

  await history.go(page, env.BASE_URL);
  const lastBookingDate = await history.getLastBookingDate(page);
  console.log("Last booking date:", lastBookingDate?.toLocaleString());

  await page.waitForSelector("#loool", { timeout: 60 * 60 * 1000 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
