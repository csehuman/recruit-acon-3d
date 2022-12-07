const { test, expect, Page } = require('@playwright/test');
require('dotenv').config();

test.describe.serial('1. Simple Flow Test', () => {
    let page;
    let newPage;
    let browserContext;

    test.beforeAll(async ({ browser, contextOptions }) => {
        browserContext = await browser.newContext(contextOptions);
        page = await browserContext.newPage();

        await page.goto('https://www.acon3d.com/ko/toon');
    });

    test('1-1 메인홈에 진입 -> 로그인 성공', async () => {
        await page.getByRole('link', { name: '로그인' }).click();
    
        await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay : 100 }); 
        await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD, { delay : 100 }); 
    
        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('button', { name: '로그인' }).click()
          ]);
    
        await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');
    });

    test('1-2 메인홈 > 상품 페이지로 이동', async () => {
        const gridMenuSelectorClass = '.sc-2e2b475a-2.sc-2e2b475a-5.bsHoFP.dBaFMt.gap-x-9'
        const elem = page.locator(`div${gridMenuSelectorClass}`).first();

        [newPage] = await Promise.all([
            browserContext.waitForEvent('page'),
            elem.locator('div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(1) > div:nth-child(1)').click({ delay : 100 })
        ])

        await newPage.waitForLoadState();
    });

    test('1-3 구매 버튼 클릭 > 주문 페이지로 이동', async () => {
        await Promise.all([
            newPage.waitForNavigation(),
            newPage.locator('button.sc-a695b05b-8.ldjbhb').click()
          ]);
    
        await expect(newPage).toHaveURL('https://www.acon3d.com/ko/toon/order/checkout');
    });
});