import { type Page } from "puppeteer";
import {
  selectDateFromDatePicker,
  selectFromDropdown,
  waitForOptionInDropdown,
} from "../utils/puppeteer";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Bookings/Overview`);
}

export async function filterByDate(page: Page, startDate: Date): Promise<void> {
  const locationDropdownSelector =
    "select#MainContent_ctlQuickBookingSearch_ddlLocation";
  await page.waitForSelector(locationDropdownSelector);
  await selectFromDropdown(
    page,
    locationDropdownSelector,
    "Blaarmeersen Tennis en Squash indoor"
  );

  const activityDropdownSelector =
    "#MainContent_ctlQuickBookingSearch_ddlActivity";
  await waitForOptionInDropdown(page, activityDropdownSelector, "Squash");
  await selectFromDropdown(page, activityDropdownSelector, "Squash");

  await selectDateFromDatePicker(
    page,
    startDate,
    "#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate"
  );

  const searchButtonSelector =
    "input#MainContent_ctlQuickBookingSearch_btnSearch";
  await page.click(searchButtonSelector);
}

export async function selectTimeSlot(page: Page, date: Date): Promise<void> {
  await page.waitForSelector(`.timeline .timeblock`);

  const startTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  const targetTimeblockIndex = await page.evaluate((startTime) => {
    const startTimeTitles = Array.from(
      document.querySelectorAll(".timeline .timeblock-time")
    );
    return startTimeTitles.findIndex((title) => title.innerHTML === startTime);
  }, startTime);

  for (const fieldIndex of [4, 3, 2, 1]) {
    const startTimeCellSelector = `.calendar > div:nth-child(${fieldIndex + 1}) > .block:nth-child(${targetTimeblockIndex + 1})`;
    const startTimeCellAvailableDiv = await page.$(
      `${startTimeCellSelector} > .available-block`
    );
    if (!startTimeCellAvailableDiv) {
      continue;
    }

    await page.click(startTimeCellSelector);
    return;
  }

  throw new Error(
    `Could not find an available time slot for ${date.toLocaleString()}`
  );
}

export async function confirmBooking(page: Page): Promise<void> {
  const nextButtonSelector = ".flow-navigation > button:nth-child(2)";

  await page.waitForSelector(".flow-navigation");
  await page.click(nextButtonSelector);

  await page.waitForSelector(".info-container table td");
  await page.click(nextButtonSelector);

  await page.waitForSelector(".summary-card");
  await page.click(nextButtonSelector);

  await page.waitForSelector(".btnCart");
  await page.click(".btnCart");
  await page.waitForSelector("#MainContent_rptBasket_lblItemHeader_0");
}
