import { type Page } from "puppeteer";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Profile/MyHistory`);
}

const reservationTableSelector =
  "table#ctl00_MainContent_HistoryReservations_gvReservations_ctl00";

export async function getLastBookingDate(
  page: Page
): Promise<Date | undefined> {
  const sportsHallOptionValue = await page.evaluate(() => {
    const dropdown = document.querySelector("select#MainContent_ddlSelect");
    const dropdownOptions = dropdown?.querySelectorAll("option") ?? [];
    const sportsHallOption = [...dropdownOptions].find(
      (option) => option.text === "Mijn Zaalreserveringen"
    );

    if (sportsHallOption === undefined)
      throw new Error("Could not find the 'Mijn Zaalreserveringen' option");

    return sportsHallOption.value;
  });

  await page.select("select#MainContent_ddlSelect", sportsHallOptionValue);
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
