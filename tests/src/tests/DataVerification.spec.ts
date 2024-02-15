import { test, expect } from '@playwright/test'
import { login } from '../pages/LoginPage';
import { calculateTotal, getTotals, getValuesTotal } from '../pages/HomePage';

test.beforeEach(async ({page}) => {
    await login(page);
});

test('Action steps', async ({page}) => {
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
