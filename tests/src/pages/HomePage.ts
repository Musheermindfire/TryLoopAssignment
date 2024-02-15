import { Locator, Page } from "@playwright/test";

// Locator object
export const homePageObjects = {
    resetBtn: "button >> text=Reset",
    chargeBackPane: "span >> text=3P Chargebacks",
    historyByStoreBtn: "span >> text=History by Store",
    tableRow: "table tbody tr",
    skipMobileBtn: "button >> text=Skip for now",
    pageNextBtn: "pagination-next",
}

export async function getValuesTotal(page: Page) {
    // This function wil extract row wise data for all the pages
    // containing the data
    const allTableTotal = []; // Contains total of all the rows of all pages
    await page.click(homePageObjects.skipMobileBtn);
    await page.click(homePageObjects.chargeBackPane);
    await page.click(homePageObjects.historyByStoreBtn);
    await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});
    while (await page.getByTestId(homePageObjects.pageNextBtn).isEnabled()) {
        await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});
        allTableTotal.push(await calculateTotal(await page.locator(homePageObjects.tableRow).all()));
        await page.getByTestId(homePageObjects.pageNextBtn).click();
    }
    await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});
    allTableTotal.push(await calculateTotal(await page.locator(homePageObjects.tableRow).all()));
    return allTableTotal;
}

export async function calculateTotal(loc: Locator[]) {
    // Calculate total for each column
    const total: Array<number> = Array(await loc[0].locator('td').count() -1).fill(0);
    for (let i = 0; i < loc.length - 2; i++) {
        let columns = await loc[i].locator('td').allInnerTexts();
        columns = columns.filter( ele => ele != '')
        console.log(columns);
        columns.forEach((v, i) => {
            total[i] += +(v.slice(1).replace(',', ''));
        })
        console.log(total);
    }
    return(total); 
}

export async function getTotals(page: Page) {
    // This will return the total values as an array which
    // can be used to assert later on
    const total: number[] = [];
    (await page.locator(homePageObjects.tableRow).last().locator('td').allTextContents()).filter((ele: string) => ele != '').forEach((v, i) => {
        total[i] = parseFloat(v.slice(1).replace(',', ''));
    })
    return total;
}