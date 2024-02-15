import { test, expect } from '@playwright/test'
import { login } from '../pages/LoginPage';
import { calculateTotal, getTotals, getValuesTotal } from '../pages/HomePage';

test.beforeEach(async ({page}) => {
    await login(page);
});

test('Action steps', async ({page}) => {
    const rows = await getValuesTotal(page);
    const result: number[] = Array(rows[0].length).fill(0);
    rows.forEach(rows => {
        rows.forEach((v, i) => {
            result[i] += v;
        })
    });
    const grantTotal = await getTotals(page);

    // Asserting the calcuated result is correct
    result.forEach((v, i) => {
        expect(+result[i].toFixed(2)).toBe(grantTotal[i]);
    })
});
