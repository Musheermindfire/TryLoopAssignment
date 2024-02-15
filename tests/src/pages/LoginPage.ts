import { Page } from "@playwright/test";
import 'dotenv/config';
import { homePageObjects } from "./HomePage";

export const loginPageObject = {
    signWithPasswordLink: "a[href='/login/password']",
    emailInp: "input.css-1x5jdmq",
    passwordInp: "input.css-1uvydh2",
    signInBtn: "login-button",
}

export async function login(page: Page) {
    // This will go to the baseURL given in config, and perform action to login
    await page.goto('/');
    await page.click(loginPageObject.signWithPasswordLink);
    await page.fill(loginPageObject.emailInp, process.env.username ?? '');
    await page.fill(loginPageObject.passwordInp, process.env.password ?? '');
    await page.getByTestId(loginPageObject.signInBtn).click();

    // Skip the mobile linkup
    await page.click(homePageObjects.skipMobileBtn);
}