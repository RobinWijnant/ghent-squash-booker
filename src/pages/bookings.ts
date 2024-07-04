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
  const fields = [4, 3, 2, 1];

  for (const fieldIndex of fields) {
    const startTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const startTimeCellSelector = `table.TimeSheet-table td[data-row="${fieldIndex}"][data-stime="${startTime}"]`;
    const startTimeCell = await page.waitForSelector(startTimeCellSelector);
    const isTimeSlotBooked = await page.$(
      `${startTimeCellSelector}.TimeSheet-cell-booked`
    );

    if (isTimeSlotBooked) {
      continue;
    }

    const endSlotDate = new Date(date.getTime() + 30 * 60 * 1000);
    const endSlotTime = `${String(endSlotDate.getHours()).padStart(2, "0")}:${String(endSlotDate.getMinutes()).padStart(2, "0")}`;
    const endTimeSlotCellSelector = `table.TimeSheet-table td[data-row="${fieldIndex}"][data-stime="${endSlotTime}"]`;
    const endTimeSlotCell = await page.waitForSelector(endTimeSlotCellSelector);

    const startTimeSlotCellBoundingBox = await startTimeCell?.boundingBox();
    const endTimeSlotCellBoundingBox = await endTimeSlotCell?.boundingBox();

    if (!startTimeSlotCellBoundingBox || !endTimeSlotCellBoundingBox) {
      throw new Error(
        "Could not find the start or end time cell in time slot table"
      );
    }

    await page.mouse.move(
      startTimeSlotCellBoundingBox.x + startTimeSlotCellBoundingBox.width / 2,
      startTimeSlotCellBoundingBox.y + startTimeSlotCellBoundingBox.height / 2
    );
    await page.mouse.down();
    await page.mouse.move(
      endTimeSlotCellBoundingBox.x + endTimeSlotCellBoundingBox.width / 2,
      endTimeSlotCellBoundingBox.y + endTimeSlotCellBoundingBox.height / 2
    );
    await page.mouse.up();

    return;
  }

  throw new Error(
    `Could not find an available time slot for ${date.toLocaleString()}`
  );
}

export async function confirmBooking(page: Page): Promise<void> {
  const confirmButton1Selector = 'a[onclick="return RedirectToRegister();"]';
  const confirmButton2Selector = "#MainContent_lnkNextStepMakeReservation";

  await Promise.all([
    page.click(confirmButton1Selector),
    page.waitForSelector(confirmButton2Selector),
  ]);

  const confirmButton3Selector = "#MainContent_lnkSave";

  await Promise.all([
    page.click(confirmButton2Selector),
    page.waitForSelector(confirmButton3Selector),
  ]);

  const confirmButton4Selector = "#MainContent_btnNextStep";

  await Promise.all([
    page.click(confirmButton3Selector),
    page.waitForSelector(confirmButton4Selector),
  ]);

  const confirmationMessageSelector = "#MainContent_rptBasket_lblItemContent_0";

  await Promise.all([
    page.click(confirmButton4Selector),
    page.waitForSelector(confirmationMessageSelector),
  ]);
}
