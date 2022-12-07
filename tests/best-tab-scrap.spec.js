const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe.serial('베스트 탭 스크랩 가능 확인', () => {
    let page;
    let browserContext;

    test.beforeAll(async ({ browser, contextOptions }) => {
        browserContext = await browser.newContext(contextOptions);
        page = await browserContext.newPage();

        await page.goto('https://www.acon3d.com/ko/toon');
        await page.locator('div.gnb__best').click();
        await page.waitForURL('https://www.acon3d.com/ko/toon/best');
    });

    test.describe.serial('2-11 목록 아이템 스크랩 기능 확인', () => {
        test('2-11.1 로그인', async ({ browserName }) => {    
            const userName = browserName === 'chromium' ? process.env.VALID_USERNAME_CHROME 
            : browserName === 'firefox' ? process.env.VALID_USERNAME_FIREFOX 
            : browserName === 'webkit' ? process.env.VALID_USERNAME_WEBKIT
            : process.env.VALID_USERNAME;
    
            await page.getByRole('link', { name: '로그인' }).click();
    
            await page.getByPlaceholder('아이디').type(userName, { delay: 200 }); // 글자당 0.2초 딜레이
            await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD_BROWSERS, { delay: 200 }); // 글자당 0.2초 딜레이
        
            await Promise.all([
                page.waitForNavigation(),
                page.getByRole('button', { name: '로그인' }).click()
              ]);
        });
    
        test('2-11.2 일간 탭으로 이동하고 스크랩 누르기', async () => {
            const scrapButtonForItems = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount = await scrapButtonForItems.count();
    
            for (let i = 0; i < scrapButtonForItemsCount; i++) {
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon-v2.png');
                await scrapButtonForItems.nth(i).click({ 'delay' : 200 });
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-active-icon-v2.png');
            }
        });
    
        test('2-11.3 스크랩 탭으로 이동하고 스크랩 취소하기', async () => {
            await page.mouse.wheel(0, -1000);
    
            await page.getByRole('navigation').locator('svg').nth(0).click();
    
            await expect(page.locator('div.gap-x-9 > div')).toHaveCount(10);
            const scrapDeleteForItemsCount = await page.locator('div.gap-x-9 > div').count();
            expect(scrapDeleteForItemsCount).toEqual(10);
    
            await page.getByRole('button', { name: '편집' }).click();
            await page.locator('button.ml-12').click();
    
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain(`선택하신 ${scrapDeleteForItemsCount}개 상품을 스크랩에서 삭제하시겠습니까?`);
                await dialog.accept();
            });
            await page.getByRole('button', { name: '삭제' }).click();
        });
    
        test('2.11.4 다시 베스트 일간 탭으로 이동하여 스크랩 취소되었는지 확인하기', async () => {
            await page.locator('div.gnb__best').click();
    
            const scrapButtonForItems2 = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount2 = await scrapButtonForItems2.count();
    
            for (let i = 0; i < scrapButtonForItemsCount2; i++) {
                await expect(scrapButtonForItems2.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon-v2.png');
            }
        });
    });

    test.describe.serial('3-11 목록 아이템 북마크 기능 확인', () => {
        test('3-11.1 로그인', async ({ browserName }) => {
            await page.locator('.iCyRmu').click();
            await expect(page.locator('.kYGnLX')).toHaveCount(1);

            const userName = browserName === 'chromium' ? process.env.VALID_USERNAME_CHROME 
            : browserName === 'firefox' ? process.env.VALID_USERNAME_FIREFOX 
            : browserName === 'webkit' ? process.env.VALID_USERNAME_WEBKIT
            : process.env.VALID_USERNAME;

            await page.getByRole('link', { name: '로그인' }).click();
    
            await page.getByPlaceholder('아이디').type(userName, { delay: 200 }); // 글자당 0.2초 딜레이
            await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD_BROWSERS, { delay: 200 }); // 글자당 0.2초 딜레이
        
            await Promise.all([
                page.waitForNavigation(),
                page.getByRole('button', { name: '로그인' }).click()
              ]);
        });

        test('3-11.2 주간 탭으로 이동하고 스크랩 누르기', async () => {
            await page.locator('.iCyRmu').click();
            await expect(page.locator('.kYGnLX')).toHaveCount(1);

            const scrapButtonForItems = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount = await scrapButtonForItems.count();
    
            for (let i = 0; i < scrapButtonForItemsCount; i++) {
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
                await scrapButtonForItems.nth(i).click({ 'delay' : 200 });
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-active-icon.png');
            }
        });

        test('3-11.3 스크랩 탭으로 이동하고 스크랩 취소하기', async () => {
            await page.mouse.wheel(0, -1000);

            await page.getByRole('navigation').locator('svg').nth(0).click();
    
            const scrapDeleteForItemsCount = await page.locator('div.gap-x-9 > div').count();
            expect(scrapDeleteForItemsCount).toEqual(30);
    
            await page.getByRole('button', { name: '편집' }).click();
            await page.locator('button.ml-12').click();
    
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain(`선택하신 ${scrapDeleteForItemsCount}개 상품을 스크랩에서 삭제하시겠습니까?`);
                await dialog.accept();
            });
            await page.getByRole('button', { name: '삭제' }).click();
        });

        test('3.11.4 다시 베스트 주간 탭으로 이동하여 스크랩 취소되었는지 확인하기', async () => {
            await page.locator('div.gnb__best').click();
    
            await page.locator('.iCyRmu').click();
            await expect(page.locator('.kYGnLX')).toHaveCount(1);
    
            const scrapButtonForItems2 = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount2 = await scrapButtonForItems2.count();
    
            for (let i = 0; i < scrapButtonForItemsCount2; i++) {
                await expect(scrapButtonForItems2.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
            }
        });
    });

    test.describe.serial('4-11 목록 아이템 스크랩 기능 확인', () => {
        test('4-11.1 로그인', async ({ browserName }) => {
            await page.locator('.dPJpbP').click();
            await expect(page.locator('.jnOnMu')).toHaveCount(1);

            const userName = browserName === 'chromium' ? process.env.VALID_USERNAME_CHROME 
            : browserName === 'firefox' ? process.env.VALID_USERNAME_FIREFOX 
            : browserName === 'webkit' ? process.env.VALID_USERNAME_WEBKIT
            : process.env.VALID_USERNAME;

            await page.getByRole('link', { name: '로그인' }).click();
    
            await page.getByPlaceholder('아이디').type(userName, { delay: 200 }); // 글자당 0.2초 딜레이
            await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD_BROWSERS, { delay: 200 }); // 글자당 0.2초 딜레이
        
            await Promise.all([
                page.waitForNavigation(),
                page.getByRole('button', { name: '로그인' }).click()
              ]);
        });

        test('4-11.2 월간 탭으로 이동하고 스크랩 누르기', async () => {
            await page.locator('.dPJpbP').click();
            await expect(page.locator('.jnOnMu')).toHaveCount(1);

            const scrapButtonForItems = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount = await scrapButtonForItems.count();
    
            for (let i = 0; i < scrapButtonForItemsCount; i++) {
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
                await scrapButtonForItems.nth(i).click({ 'delay' : 200 });
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-active-icon.png');
            }
        });

        test('4-11.3 스크랩 탭으로 이동하고 스크랩 취소하기', async () => {
            await page.mouse.wheel(0, -1000);

            await page.getByRole('navigation').locator('svg').nth(0).click();
    
            const scrapDeleteForItemsCount = await page.locator('div.gap-x-9 > div').count();
            expect(scrapDeleteForItemsCount).toEqual(30);
    
            await page.getByRole('button', { name: '편집' }).click();
            await page.locator('button.ml-12').click();
    
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain(`선택하신 ${scrapDeleteForItemsCount}개 상품을 스크랩에서 삭제하시겠습니까?`);
                await dialog.accept();
            });
            await page.getByRole('button', { name: '삭제' }).click();
        });

        test('4.11.4 다시 베스트 월간 탭으로 이동하여 스크랩 취소되었는지 확인하기', async () => {
            await page.locator('div.gnb__best').click();
    
            await page.locator('.dPJpbP').click();
            await expect(page.locator('.jnOnMu')).toHaveCount(1);
    
            const scrapButtonForItems2 = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount2 = await scrapButtonForItems2.count();
    
            for (let i = 0; i < scrapButtonForItemsCount2; i++) {
                await expect(scrapButtonForItems2.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
            }
        });
    });

    test.describe.serial('5-11 목록 아이템 북마크 기능 확인', () => {
        test('5-11.1 로그인', async ({ browserName }) => {
            await page.locator('.kzwwDw').click();
            await expect(page.locator('.evrnkt')).toHaveCount(1);
            
            const userName = browserName === 'chromium' ? process.env.VALID_USERNAME_CHROME 
            : browserName === 'firefox' ? process.env.VALID_USERNAME_FIREFOX 
            : browserName === 'webkit' ? process.env.VALID_USERNAME_WEBKIT
            : process.env.VALID_USERNAME;

            await page.getByRole('link', { name: '로그인' }).click();
    
            await page.getByPlaceholder('아이디').type(userName, { delay: 200 }); // 글자당 0.2초 딜레이
            await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD_BROWSERS, { delay: 200 }); // 글자당 0.2초 딜레이
        
            await Promise.all([
                page.waitForNavigation(),
                page.getByRole('button', { name: '로그인' }).click()
              ]);
        });

        test('5-11.2 주간 탭으로 이동하고 스크랩 누르기', async () => {
            await page.locator('.kzwwDw').click();
            await expect(page.locator('.evrnkt')).toHaveCount(1);

            const scrapButtonForItems = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount = await scrapButtonForItems.count();
    
            for (let i = 0; i < scrapButtonForItemsCount; i++) {
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
                await scrapButtonForItems.nth(i).click({ 'delay' : 200 });
                await expect(scrapButtonForItems.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-active-icon.png');
            }
        });

        test('5-11.3 스크랩 탭으로 이동하고 스크랩 취소하기', async () => {
            await page.mouse.wheel(0, -2000);

            await page.getByRole('navigation').locator('svg').nth(0).click();
    
            const scrapDeleteForItemsCount = await page.locator('div.gap-x-9 > div').count();
            expect(scrapDeleteForItemsCount).toEqual(100);
    
            await page.getByRole('button', { name: '편집' }).click();
            await page.locator('button.ml-12').click();
    
            page.once('dialog', async dialog => {
                expect(dialog.message()).toContain(`선택하신 ${scrapDeleteForItemsCount}개 상품을 스크랩에서 삭제하시겠습니까?`);
                await dialog.accept();
            });
            await page.getByRole('button', { name: '삭제' }).click();
        });

        test('5.11.4 다시 베스트 주간 탭으로 이동하여 스크랩 취소되었는지 확인하기', async () => {
            await page.locator('div.gnb__best').click();
    
            await page.locator('.kzwwDw').click();
            await expect(page.locator('.evrnkt')).toHaveCount(1);
    
            const scrapButtonForItems2 = await page.locator('button.sc-cff50c49-0.dXJNFi');
            const scrapButtonForItemsCount2 = await scrapButtonForItems2.count();
    
            for (let i = 0; i < scrapButtonForItemsCount2; i++) {
                await expect(scrapButtonForItems2.nth(i).locator('img')).toHaveAttribute('src', '/icons/goods/scrap-icon.png');
            }
        });
    });
});


