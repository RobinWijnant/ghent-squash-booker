import * as home from "./pages/home";
import * as history from "./pages/history";
import * as bookings from "./pages/bookings";
import env from "./utils/env";
import { getBrowser, getPage } from "./utils/puppeteer";
import { DayOfWeek, getLastBookingDayInWindow } from "./utils/date";

async function main(): Promise<void> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await home.go(page, env.BASE_URL);
  await home.acceptCookies(page);
  await home.login(page, env.USERNAME, env.PASSWORD);
  console.log("Login successful");

  await history.go(page, env.BASE_URL);
  const lastBookingDate = await history.getLastBookingDate(page);
  console.log("Last booked date:", lastBookingDate?.toLocaleString());

  const nextBookingDate = getLastBookingDayInWindow(
    new Date(),
    DayOfWeek.Thursday,
    "18:30",
    30
  );
  console.log("Next booking date:", nextBookingDate.toLocaleString());

  if (
    lastBookingDate !== undefined &&
    lastBookingDate.getTime() === nextBookingDate.getTime()
  ) {
    console.warn("Already booked");
    return;
  }

  await bookings.overview.go(page, env.BASE_URL);
  await bookings.overview.filterByDate(page, nextBookingDate);
  await bookings.detail.selectTimeSlot(page, nextBookingDate);

  await page.waitForSelector("#loool", { timeout: 60 * 60 * 1000 });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
