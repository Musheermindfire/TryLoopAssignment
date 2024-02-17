import { test, expect } from '@playwright/test';
import { login } from '../pages/LoginPage';
import { calculateTotal, getTotals, getValuesTotal, goToPage } from '../pages/HomePage';
import { compareCSVs, createCSV, downloadCSV, getTableRowContent, selectLocation, selectMarketplace } from '../pages/Transactions';

test.beforeEach(async ({page}) => {
    await login(page);
});

test('Part 1: Data Verification', async ({page}) => {
    // Navigate to history by store pane
    await goToPage(page, 'historybystore');

    // Get the indiviual total of columns per pages as rows
    const rows = await getValuesTotal(page);

    // This will calculate the grand total by adding all the rows 
    const result: number[] = Array(rows[0].length).fill(0);
    rows.forEach(rows => {
        rows.forEach((v, i) => {
            result[i] += v;
        })
    });

    // Fetching grand total displayed in the webtable
    const grantTotal = await getTotals(page);

    // Removing the first value of both result and grand total
    // as it contains the NaN(Came from the string values)
    result.shift();
    grantTotal.shift();

    // Trimming the trailling decimal point in result and grand total
    result.forEach((v, i) => {
        result[i] = +result[i].toFixed(2);
        grantTotal[i] = +grantTotal[i].toFixed(2);
    });

    // Displaying calcuated total and fetched grand total for 7 
    console.log(`Grand Total ${grantTotal}`);
    console.log(`Calculated grandtotal${result}`);

    // Asserting the calcuated result is correct
    result.forEach((v, i) => {
        expect(+result[i].toFixed(2)).toBe(grantTotal[i]);
    })
});

test('Part 2: Data Extraction and Validation', async ({page}) => {
    // Navigate to transaction pane
    await goToPage(page, 'transactions');

    // Select locations
    await selectLocation(page, ['Artisan Alchemy', 'Blissful Buffet']);

    // Select marketplace
    await selectMarketplace(page, 'Grubhub');

    // Get the rows of table in form of array
    const row = await getTableRowContent(page);

    // Sort the array with respect to ORDER_ID
    const sortedRows = row.sort((a, b) => {
        return a[0].localeCompare(b[0]);
    });

    // Create a csv out of the sorted array
    await createCSV(sortedRows);

    // Download cdv file(BONUS STEPS)
    await downloadCSV(page);

    // Cmompare csv 1st colum
    await compareCSVs();
});