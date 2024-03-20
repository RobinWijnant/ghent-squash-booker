import { type Page } from "puppeteer";

export async function selectTimeSlot(page: Page, date: Date): Promise<void> {
  const fields = [4, 3, 2, 1];

  for (const fieldIndex of fields) {
    const startTime = `${date.getHours()}:${date.getMinutes()}`;
    const startTimeCellSelector = `table.TimeSheet-table td[data-row="${fieldIndex}"][data-stime="${startTime}"]`;
    const startTimeCell = await page.waitForSelector(startTimeCellSelector);
    const isTimeSlotBooked = await page.$(
      `${startTimeCellSelector} .TimeSheet-cell-booked`
    );

    if (isTimeSlotBooked) {
      continue;
    }

    const endDate = new Date(date.getTime() + 45 * 60 * 1000);
    const endTime = `${endDate.getHours()}:${endDate.getMinutes()}`;
    const endTimeCellSelector = `table.TimeSheet-table td[data-row="${fieldIndex}"][data-stime="${endTime}"]`;
    const endTimeCell = await page.waitForSelector(endTimeCellSelector);

    const startTimeCellBoundingBox = await startTimeCell?.boundingBox();
    const endTimeCellBoundingBox = await endTimeCell?.boundingBox();

    if (!startTimeCellBoundingBox || !endTimeCellBoundingBox) {
      throw new Error(
        "Could not find the start or end time cell in time slot table"
      );
    }

    // does not work yet
    await page.mouse.dragAndDrop(
      startTimeCellBoundingBox,
      endTimeCellBoundingBox,
      { delay: 10 }
    );
  }

  throw new Error(
    `Could not find an available time slot for ${date.toLocaleString()}`
  );
}
