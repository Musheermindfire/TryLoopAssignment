import { test } from '@playwright/test'
import { login } from '../pages/LoginPage';
import { calculateTotal, getTotals, getValuesTotal } from '../pages/HomePage';

test.beforeEach(async ({page}) => {
    await login(page);
});

test('Assessment', async ({page}) => {
    const rows = await getValuesTotal(page);
    await calculateTotal(rows);
    //console.log(await getTotals(rows));
});
