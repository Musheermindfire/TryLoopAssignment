import { page, test } from '@playwright/test'
import { login } from '../pages/LoginPage';

test.beforeEach(async ({page}) => {
    await login(page);
    await page.waitForTimeout(5000);
});

test('demo', async ({page}) => {
    console.log('demo');
});