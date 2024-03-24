import { type Page } from "puppeteer";

export async function selectTimeSlot(page: Page, date: Date): Promise<void> {
  const fields = [4, 3, 2, 1];

  for (const fieldIndex of fields) {
    const startTime = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    const startTimeCellSelector = `table.TimeSheet-table td[data-row="${fieldIndex}"][data-stime="${startTime}"]`;
    const startTimeCell = await page.waitForSelector(startTimeCellSelector);
    const isTimeSlotBooked = await page.$(
      `${startTimeCellSelector} .TimeSheet-cell-booked`
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
