import { type Page } from "puppeteer";
import { selectFromDropdown } from "../utils/puppeteer";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Profile/MyHistory`);
}

const reservationTableSelector =
  "table#ctl00_MainContent_HistoryReservations_gvReservations_ctl00";

export async function getLastBookingDate(
  page: Page
): Promise<Date | undefined> {
  await selectFromDropdown(
    page,
    "select#MainContent_ddlSelect",
    "Mijn Zaalreserveringen"
  );

  await page.waitForSelector(reservationTableSelector, { visible: true });

  const reservationDateCellStrings = await page.evaluate((selector) => {
    const reservationTable = document.querySelector(selector);

    if (reservationTable === null)
      throw new Error("Could not find the reservation table");

    const dateCells = Array.from(
      reservationTable.querySelectorAll("tr td:nth-child(3)")
    );
    const reservationDateCellStrings = dateCells.map((element) => {
      return element.innerHTML;
    });
    return reservationDateCellStrings;
  }, reservationTableSelector);

  const reservationDates = reservationDateCellStrings.map(parseReservationDate);

  reservationDates.sort((a, b) => b.getTime() - a.getTime());

  return reservationDates[0];
}

// Example string: '2-4-2024<br>18:30 - 19:15'
function parseReservationDate(dateString: string): Date {
  const [date, time] = dateString.split("<br>");
  const [day, month, year] = date.split("-").map((part) => parseInt(part));
  const [startTime] = time.split(" - ").map((part) => part.split(":"));
  return new Date(
    year,
    month - 1,
    day,
    parseInt(startTime[0]),
    parseInt(startTime[1])
  );
}
