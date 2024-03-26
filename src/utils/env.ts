import { bool, cleanEnv, email, makeValidator, num, str } from "envalid";
import { DayOfWeek } from "./date";

const timeValidator = makeValidator<string>((timeString) => {
  const bookingStartTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM
  if (!bookingStartTimeRegex.test(timeString)) {
    throw new Error("Invalid bookingStartTime format");
  }
  return timeString;
});

const env = cleanEnv(process.env, {
  USERNAME: email(),
  PASSWORD: str(),
  BASE_URL: str({ default: "https://sportterreinen.stad.gent" }),
  BOOKING_DAY_OF_WEEK: num({
    choices: Object.keys(DayOfWeek).map((key) => Number(key) as DayOfWeek),
  }),
  BOOKING_TIME: timeValidator(),

  TZ: str({ default: "Europe/Brussels" }),
  PUPPETEER_PATH: str({ default: "/usr/bin/chromium-browser" }),
  HEADLESS_BROWSER: bool({ default: true }),
});

export default env;
