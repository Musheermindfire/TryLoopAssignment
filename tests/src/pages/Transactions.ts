import { Locator, Page } from "@playwright/test";
import * as fs from "fs";

export const transactionsObject = {
    selectDrpDwn: 'selectBtn', 
    selectAllCheckBox: 'selectAllCheckbox',
    applyBtn: 'applyBtn',
    downloadBtn: "button >> text=Download",
    tableRow: "table tbody tr",
    pageNextBtn: "pagination-next",
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

export async function getTableRowContent(page: Page) {
    await page.waitForSelector('img[alt="Grubhub"]', {state: 'visible'});
    const csvTable:string[][] = [];
    (await cleanTableData(await page.locator(transactionsObject.tableRow).all())).forEach((v) => {
        csvTable.push(v);
    });  
    await page.getByTestId(transactionsObject.pageNextBtn).click();
    (await cleanTableData(await page.locator(transactionsObject.tableRow).all())).forEach((v) => {
        csvTable.push(v);
    }); 
    return (csvTable);
}

async function cleanTableData(loc: Locator[]) {
    let spanrows:string[] = [];
    let rows:string[][] = [];
    for (let i = 0; i < loc.length; i++) {
        let columns = await loc[i].locator('td').allInnerTexts();
        // Will fill the first three element of row that contain the order id, location
        // and order state to those where above three elements are missing
        if (columns.length == 8) {
            spanrows = columns.slice(0,3);
        } else {
            columns = [...spanrows, ...columns];
        }
        rows.push(columns);
    }
    return rows;
}

export async function createCSV(arr: string[][]) {
    const headers = [
        'Order I',
        'Location',
        'Order State',
        'Type',
        'Lost Sale',
        'Net Payout',
        'Payout ID',
        'Payout Date'
    ]
    const csvData = [headers, ...arr].map((row) => {
        return row.join(',');
    }).join('\n');;

    fs.writeFileSync('csv/createdCSV.csv', csvData, 'utf-8');
}

export async function downloadCSV(page: Page) {
    await page.locator(transactionsObject.downloadBtn).click();
    (await page.waitForEvent('download')).saveAs('csv/downloadedCSV.csv');
}