import { type Page } from "puppeteer";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Profile/MyHistory`);
}

export async function getLastBookingDate(page: Page): Promise<Date> {
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

  return new Date();
}
