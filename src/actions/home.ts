import { type Page } from "puppeteer";

export async function go(page: Page, baseUrl: string): Promise<void> {
  await page.goto(`${baseUrl}/Home`);
}

export async function acceptCookies(page: Page): Promise<void> {
  const button = await page.waitForSelector("input[type='submit'].cookieAgree");
  await button?.click();
  await page.waitForSelector("input[type='submit'].cookieAgree", {
    hidden: true,
  });
}

export async function login(page: Page, username: string, password: string): Promise<void> {
  await page.waitForSelector("#MainContent_ctlLoginWidget_txtUsername", {
    visible: true,
  });
  await page.type(
    "#MainContent_ctlLoginWidget_txtUsername",
    username
  );
  await page.type(
    "#MainContent_ctlLoginWidget_txtPassword",
    password
  );
  await Promise.all([
    page.click("input[type='submit'][value='Inloggen']"),
    page.waitForNavigation({ waitUntil: "domcontentloaded" })
  ])
};
