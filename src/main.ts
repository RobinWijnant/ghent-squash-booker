import * as home from "./pages/home";
import * as history from "./pages/history";
import * as bookings from "./pages/bookings";
import env from "./utils/env";
import { getBrowser, getPage } from "./utils/puppeteer";
import { getLastBookingDayInWindow } from "./utils/date";

async function main(): Promise<void> {
  const browser = await getBrowser();
  const page = await getPage(browser);

  await home.go(page, env.BASE_URL);
  await home.acceptCookies(page);
  await home.login(page, env.USERNAME, env.PASSWORD);
  console.log("Login successful");

  const nextBookingDate = getLastBookingDayInWindow(
    new Date(),
    env.BOOKING_DAY_OF_WEEK,
    env.BOOKING_TIME,
    30
  );
  console.log("Next booking date:", nextBookingDate.toLocaleString());

  await history.go(page, env.BASE_URL);
  const lastBookingDate = await history.getLastBookingDate(
    page,
    nextBookingDate
  );
  console.log("Last booked date:", lastBookingDate?.toLocaleString());

  if (
    lastBookingDate !== undefined &&
    lastBookingDate.getTime() === nextBookingDate.getTime()
  ) {
    console.warn("Booking already made for next date");
  } else {
    await bookings.go(page, env.BASE_URL);
    await bookings.filterByDate(page, nextBookingDate);
    await bookings.selectTimeSlot(page, nextBookingDate);
    console.log("Timeslot selected");
    await bookings.confirmBooking(page);
    console.log("Booking complete");
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
