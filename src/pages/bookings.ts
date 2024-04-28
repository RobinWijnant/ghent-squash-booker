import { type Page } from "puppeteer";
import {
  selectFromDropdown,
  waitForOptionInDropdown,
} from "../utils/puppeteer";
import { GhentDatePickerMonth } from "../utils/date";

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

  const datePickerButtonSelector =
    "#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_popupButton";
  await page.click(datePickerButtonSelector);
  const datePickerSelector =
    "#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_calendar";
  await page.waitForSelector(datePickerSelector, { visible: true });

  await selectDateFromDatePicker(page, startDate);

  const searchButtonSelector =
    "input#MainContent_ctlQuickBookingSearch_btnSearch";
  await page.click(searchButtonSelector);
}

async function selectDateFromDatePicker(page: Page, date: Date): Promise<void> {
  const monthYearButtonSelector =
    "#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_calendar_Title";
  await page.click(monthYearButtonSelector);

  const monthYearSelector =
    "#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_calendar_FastNavPopup";
  await page.waitForSelector(monthYearSelector, { visible: true });

  const yearButtonSelector = `${monthYearSelector} #rcMView_${date.getFullYear()}`;
  await page.click(yearButtonSelector);

  const monthButtonSelector = `${monthYearSelector} #rcMView_${GhentDatePickerMonth[date.getMonth()]}`;
  await page.click(monthButtonSelector);

  const monthYearSubmitButtonSelector = `${monthYearSelector} #rcMView_OK`;
  await page.click(monthYearSubmitButtonSelector);

  const dayButtonSelector = `#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_calendar_Top`;
  await page.waitForSelector(dayButtonSelector, { visible: true });
  await page.evaluate(
    (dayButtonSelector, date) => {
      const dayButton = Array.from(
        document.querySelectorAll(
          `${dayButtonSelector} td:not(.rcOtherMonth) a`
        )
      ).find((element) => element.innerHTML.includes(date.toString())) as
        | HTMLAnchorElement
        | undefined;

      if (!dayButton) {
        throw new Error(`Could not find day ${date} in date picker`);
      }

      dayButton.click();
    },
    dayButtonSelector,
    date.getDate()
  );
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
