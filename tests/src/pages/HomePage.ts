import { Locator, Page } from "@playwright/test";
import { transactionsObject } from "./Transactions";

// Locator object
export const homePageObjects = {
    resetBtn: "button >> text=Reset",
    chargeBackPane: "span >> text=3P Chargebacks",
    historyByStoreBtn: "span >> text=History by Store",
    transactionBtn: "span >> text=Transactions",
    tableRow: "table tbody tr",
    skipMobileBtn: "button >> text=Skip for now",
    pageNextBtn: "pagination-next",
}

export async function goToPage(page: Page, pageName: string) {
    await page.click(homePageObjects.chargeBackPane);
    if (pageName.toLowerCase() == "historybystore") {
        // Navigate to the correct page to fetch the data from web table
        await page.click(homePageObjects.historyByStoreBtn);
        await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});
    } else if (pageName.toLowerCase() == "transactions") {
        // Navigate to transaction page
        await page.click(homePageObjects.transactionBtn);
        await page.waitForSelector(transactionsObject.downloadBtn, { state: 'visible'});
    } else {
        console.log("No match found");
    }
}

export async function getValuesTotal(page: Page) {
    // This function wil extract row wise data for all the pages
    // containing the data
    const allTableTotal = []; // Contains total of all the rows of all pages

    // This code will keep extracting the data from all the pages until the last page
    // is reached and store it in the allTableTotal variable
    while (await page.getByTestId(homePageObjects.pageNextBtn).isEnabled()) {
        await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});

        allTableTotal.push(await calculateTotal(await page.locator(homePageObjects.tableRow).all()));
        await page.getByTestId(homePageObjects.pageNextBtn).click();
    }
    await page.waitForSelector("h6 >> text=Grand Total", { state: 'visible'});
    allTableTotal.push(await calculateTotal(await page.locator(homePageObjects.tableRow).all()));

    // return the calculated value of each page in form of 3d number array
    // where each row represents the total of the pages displayed
    return allTableTotal;
}

export async function calculateTotal(loc: Locator[]) {
    // This method will get all the row of a single page and then calculate the total
    // of all the columns and save it in total variable
    // Calculate total for each column
    const total: Array<number> = Array(await loc[0].locator('td').count() -1).fill(0);
    for (let i = 0; i < loc.length - 2; i++) {
        let columns = await loc[i].locator('td').allInnerTexts();
        columns = columns.filter( ele => ele != '')
        columns.forEach((v, i) => {
            total[i] += +(v.slice(1).replace(',', ''));
        });
    }

    // This will return a 2d number array with the total of all the columns as its element
    // which will further create a single row of 3d array which is returned by getValuesTotal()
    return(total); 
}

export async function getTotals(page: Page) {
    // This will return the grand total displayed at the last row of the web table
    const total: number[] = [];
    (await page.locator(homePageObjects.tableRow).last().locator('td').allTextContents()).filter((ele: string) => ele != '').forEach((v, i) => {
        total[i] = parseFloat(v.slice(1).replace(',', ''));
    })
    return total;
}