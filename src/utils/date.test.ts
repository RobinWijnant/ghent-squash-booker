/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert";
import test from "node:test";
import { DayOfWeek, getLastBookingDayInWindow } from "./date";

test("when today is 2024-03-18 09:00 and the booking should be on Wednesday 18:30 then the last Wednesday in 30 days is 2024-04-10", () => {
  const result = getLastBookingDayInWindow(
    new Date("2024-03-18T09:00:00"),
    DayOfWeek.Wednesday,
    "18:30",
    30
  );

  assert.equal(
    result.toLocaleString(),
    new Date("2024-04-10T18:30:00").toLocaleString()
  );
});

test("when today is 2024-03-18 20:00 and the booking should be on Wednesday 18:30 then the last Wednesday in 30 days is 2024-04-17", () => {
  const result = getLastBookingDayInWindow(
    new Date("2024-03-18T20:00:00"),
    DayOfWeek.Wednesday,
    "18:30",
    30
  );

  assert.equal(
    result.toLocaleString(),
    new Date("2024-04-17T18:30:00").toLocaleString()
  );
});

test.only("when today is 2024-03-24 20:00 and the booking should be on Thursday 18:30 then the last Thursday in 30 days is 2024-04-18", () => {
  const result = getLastBookingDayInWindow(
    new Date("2024-03-24T20:00:00"),
    DayOfWeek.Thursday,
    "18:30",
    30
  );

  assert.equal(
    result.toLocaleString(),
    new Date("2024-04-18T18:30:00").toLocaleString()
  );
});
