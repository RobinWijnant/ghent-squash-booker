import puppeteer, { type Page, type Browser } from "puppeteer";
import env from "./env";
import { GhentDatePickerMonth } from "../utils/date";

export async function getBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--lang=nl",
    ],
    headless: env.HEADLESS_BROWSER,
    defaultViewport: { height: 720, width: 1280 },
    executablePath: env.PUPPETEER_PATH,
  });
}

export async function getPage(browser: Browser): Promise<Page> {
  const [page] = await browser.pages();

  page.setDefaultTimeout(15 * 1000);

  return page;
}

export async function selectFromDropdown(
  page: Page,
  selector: string,
  textValue: string
): Promise<void> {
  const optionValue = await page.evaluate(
    (selector, textValue) => {
      const dropdown = document.querySelector(selector);
      const dropdownOptions = dropdown?.querySelectorAll("option") ?? [];
      const sportsHallOption = [...dropdownOptions].find(
        (option) => option.text === textValue
      );

      if (sportsHallOption === undefined)
        throw new Error(`Could not find the option ${textValue} in dropdown`);

      return sportsHallOption.value;
    },
    selector,
    textValue
  );

  await page.select(selector, optionValue);
}

export async function waitForOptionInDropdown(
  page: Page,
  selector: string,
  textValue: string
): Promise<void> {
  await page.waitForFunction(
    (selector, textValue) => {
      const dropdown = document.querySelector(selector);
      const dropdownOptions = dropdown?.querySelectorAll("option") ?? [];
      return [...dropdownOptions].some((option) => option.text === textValue);
    },
    {},
    selector,
    textValue
  );
}

export async function selectDateFromDatePicker(
  page: Page,
  date: Date,
  baseId: string
): Promise<void> {
  const datePickerButtonSelector = `${baseId}_popupButton`;
  await page.click(datePickerButtonSelector);

  const datePickerSelector = `${baseId}_calendar`;
  await page.waitForSelector(datePickerSelector, { visible: true });

  const monthYearButtonSelector = `${baseId}_calendar_Title`;
  await page.click(monthYearButtonSelector);

  const monthYearSelector = `${baseId}_calendar_FastNavPopup`;
  await page.waitForSelector(monthYearSelector, { visible: true });

  const yearButtonSelector = `${monthYearSelector} #rcMView_${date.getFullYear()}`;
  await page.click(yearButtonSelector);

  const monthButtonSelector = `${monthYearSelector} #rcMView_${GhentDatePickerMonth[date.getMonth()]}`;
  await page.click(monthButtonSelector);

  const monthYearSubmitButtonSelector = `${monthYearSelector} #rcMView_OK`;
  await page.click(monthYearSubmitButtonSelector);

  const dayButtonSelector = `${baseId}_calendar_Top`;
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
