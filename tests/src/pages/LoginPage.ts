import { Page } from "@playwright/test";
import 'dotenv/config';

export const loginPageObject = {
    signWithPasswordLink: "a[href='/login/password']",
    emailInp: "input.css-1x5jdmq",
    passwordInp: "input.css-1uvydh2",
    signInBtn: "login-button",
}

export async function login(page: Page) {
    await page.goto('/');
    await page.click(loginPageObject.signWithPasswordLink);
    await page.fill(loginPageObject.emailInp, process.env.username ?? '');
    await page.fill(loginPageObject.passwordInp, process.env.password ?? '');
    await page.getByTestId(loginPageObject.signInBtn).click();
}