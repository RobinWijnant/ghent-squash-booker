export enum DayOfWeek {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

export enum GhentDatePickerMonth {
  jan = 0,
  feb = 1,
  mrt = 2,
  apr = 3,
  mei = 4,
  jun = 5,
  jul = 6,
  aug = 7,
  sep = 8,
  okt = 9,
  nov = 10,
  dec = 11,
}

export function getLastBookingDayInWindow(
  input: Date,
  bookingDayOfWeek: DayOfWeek,
  bookingStartTime: string,
  windowInDays: number = 30
): Date {
  const inputPlus30Days = new Date(
    input.getTime() + windowInDays * 24 * 60 * 60 * 1000
  );

  let iteratorDate = new Date(
    `${inputPlus30Days.toISOString().split("T")[0]}T${bookingStartTime}`
  );
  while (
    iteratorDate.getDay() !== bookingDayOfWeek ||
    iteratorDate > inputPlus30Days
  ) {
    iteratorDate = new Date(iteratorDate.getTime() - 24 * 60 * 60 * 1000);
  }

  return iteratorDate;
}
