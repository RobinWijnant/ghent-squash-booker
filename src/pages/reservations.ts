import { type Page } from "puppeteer";
import {
  selectFromDropdown,
  waitForOptionInDropdown,
} from "../utils/puppeteer";
import { GhentDatePickerMonth } from "../utils/date";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Bookings/Overview`);
}

export async function applySquashAndDateFilter(
  page: Page,
  startDate: Date
): Promise<void> {
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

  await page.waitForSelector(monthYearSelector, { visible: false });

  const dayButtonSelector = `#ctl00_MainContent_ctlQuickBookingSearch_rdpReservationDate_calendar_Top `;
}
