import puppeteer, { type Page, type Browser } from "puppeteer";

export async function getBrowser(): Promise<Browser> {
  return await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--lang=nl",
    ],
    headless: true,
    defaultViewport: { height: 720, width: 1280 },
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
