import { Locator, Page } from "@playwright/test";
export const transactionsObject = {
    selectDrpDwn: 'selectBtn', 
    selectAllCheckBox: 'selectAllCheckbox',
    applyBtn: 'applyBtn',
    downloadBtn: "button >> text=Download",
    tableRow: "table tbody tr",
}

export async function selectLocation(page: Page, locations: string[]| string) {
    // Click on location drop down
    await page.getByTestId(transactionsObject.selectDrpDwn).first().click();

    // Unselect all location
    await page.getByTestId(transactionsObject.selectAllCheckBox).click();

    // Comverting string to array of string if user has given only one location
    if (typeof(locations) == 'string') {
        locations = [locations];
    }

    // Selecting location(s)
    for(let location of locations) {
        await page.locator(`//p[normalize-space() = '${location}']/preceding-sibling::span`).click();
    }

    // Click on apply button
    await page.getByTestId(transactionsObject.applyBtn).click();
    await page.waitForSelector(transactionsObject.downloadBtn, { state: 'visible'});
}

export async function selectMarketplace(page: Page, marketplaces: string[] | string) {
    // Click on marketplace drop down
    await page.getByTestId(transactionsObject.selectDrpDwn).nth(2).click();

    // Unselect all location
    await page.getByTestId(transactionsObject.selectAllCheckBox).click();

    // Comverting string to array of string if user has given only one marketplace
    if (typeof(marketplaces) == 'string') {
        marketplaces = [marketplaces];
    }

    // Selecting marketplace(s)
    for(let marketplace of marketplaces) {
        await page.locator(`//p[normalize-space() = '${marketplace}']/preceding-sibling::span`).click();
    }

    // Click on apply button
    await page.getByTestId(transactionsObject.applyBtn).click();
    await page.waitForSelector(transactionsObject.downloadBtn, { state: 'visible'});
}

export async function getTableContent(page: Page) {
    
}