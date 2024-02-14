import { Locator, Page } from "@playwright/test";

export const homePageObjects = {
    resetBtn: "button >> text=Reset",
    chargeBackPane: "span >> text=3P Chargebacks",
    historyByStoreBtn: "span >> text=History by Store",
    tableRow: "table tbody tr",
    skipMobileBtn: "button >> text=Skip for now",
    pageNextBtn: "pagination-next",
}

export async function getValuesTotal(page: Page) {
    const loc: Locator[] = [];
    await page.click(homePageObjects.skipMobileBtn);
    await page.click(homePageObjects.chargeBackPane);
    await page.click(homePageObjects.historyByStoreBtn);
    await page.waitForSelector("h6 >> text=Store name", { state: 'visible'});
    while (await page.getByTestId(homePageObjects.pageNextBtn).isEnabled()) {
        await page.waitForSelector("h6 >> text=Store name", { state: 'visible'});
        (await page.locator(homePageObjects.tableRow).all()).forEach((row) => {
            loc.push(row);
        })
        await page.getByTestId(homePageObjects.pageNextBtn).click();
    }
    return loc;
}

export async function calculateTotal(loc: Locator[]) {
    // Calculate total for each colum
    const total: Array<number> = Array(loc.length).fill(0);
    for (let i = 0; i < loc.length - 2; i++) {
        const columns = await loc[i].locator('td').allInnerTexts();
        console.log(columns);
        for (let j = 1; j < columns.length; j++) {
            total[j] = total[j] + +(columns[j].slice(1).replace(',', ''));
        }
    }
    console.log(total); 
}

export async function getTotals(loc: Locator[]) {
    // This will return the total values as an array which
    // can be used to assert later on
    return await loc[loc.length - 1].locator('td').allTextContents();
}