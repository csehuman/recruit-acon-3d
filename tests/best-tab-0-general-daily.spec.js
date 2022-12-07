const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('1. 베스트 탭 확인', () => {
    test('1-1 베스트 탭 기본 정보 확인 (직접 URL 접근)', async ({ context, page }) => {
        await page.goto('https://www.acon3d.com/ko/toon/best');

        await expect(page.locator('.bFOZwX')).toHaveCount(1); // 일간 베스트 탭
        await expect(page.getByText('오늘의 Top 10')).toHaveCount(1);
    });

    test('1-2 베스트 탭 기본 정보 확인 (메인 페이지에서 접근)', async ({ context, page }) => {
        await page.goto('https://www.acon3d.com/ko/toon');
        await page.locator('div.gnb__best').click();

        await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/best');

        await expect(page.locator('.bFOZwX')).toHaveCount(1); // 일간 베스트 탭
        await expect(page.getByText('오늘의 Top 10')).toHaveCount(1);
    });
});

test.describe('2. 일간 베스트 탭 확인', () => {
    let page;
    let browserContext;

    test.beforeAll(async ({ browser, contextOptions }) => {
        browserContext = await browser.newContext(contextOptions);
        page = await browserContext.newPage();

        await page.goto('https://www.acon3d.com/ko/toon');
        await page.locator('div.gnb__best').click();
        await page.waitForURL('https://www.acon3d.com/ko/toon/best');
    });

    test('2-1 일간 베스트탭 기본 정보 확인', async () => {
        await expect(page.locator('.bFOZwX')).toHaveCount(1); // class for selected daily-best

        await expect(page.getByText('오늘의 Top 10')).toHaveCount(1);
        await expect(page.locator('div.mt-3 > div')).toHaveCount(10);
    });

    test('2-2 유료 상품만 보기 (활성화 상태)', async () => {
        await expect(page.locator('div.sc-176436fa-0.hqxdpx > div:nth-child(2) svg > rect')).toHaveAttribute('fill', '#333333');
        await expect(page.locator('div.sc-ccbdafc9-3.etXTmj > div:has-text("Free")')).toHaveCount(0);
    });

    test('2-3 유료 상품만 보기 (비활성화 상태)', async () => {
        await page.locator('div.sc-176436fa-0.hqxdpx > div:nth-child(2) > div').click();
        await expect(page.locator('div.sc-176436fa-0.hqxdpx > div:nth-child(2) svg > rect:nth-child(1)')).toHaveAttribute('fill', 'white');

        await expect(page.getByText('오늘의 Top 10')).toHaveCount(1);
        await expect(page.locator('div.mt-3 > div')).toHaveCount(10);
    });

    test('2-4 목록 아이템 숫자 형식 확인', async () => {
        const numbers = await page.locator('div.sc-a6216f25-0.cHjQQS > div:first-child > div');
        const count = await numbers.count();
        for (let i = 1; i < count + 1; i++) {
            const innerText = await numbers.nth(i - 1).innerText()
            expect(innerText).toEqual(i < 10 ? '0'+i : `${i}`);
        }
    });

    test('2-5 목록 아이템 사진 형식 확인', async () => {
       await expect(page.locator('div.sc-a6216f25-0.cHjQQS > div:nth-child(2) > div:first-child img')).toHaveCount(10);
    });

    test('2-6 목록 아이템 브랜드 형식 확인', async () => {
        const brandListForItems = await page.locator('div.sc-ccbdafc9-6.gorYwP > div:first-child > div > a');
        const brandListForItemsCount = await brandListForItems.count();

        expect(brandListForItemsCount).toEqual(10);

        for (let i = 0; i < brandListForItemsCount; i++) {
            const brandLink = await brandListForItems.nth(i);
            await expect(brandLink).toHaveAttribute('href', new RegExp('/ko/brand/'));

            const brandText = await brandLink.locator('div').innerText();
            expect(brandText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('2-7 목록 아이템 제목 형식 확인', async () => {
        const titleListForItems = await page.locator('div.sc-ccbdafc9-6.gorYwP > div:first-child > a');
        const titleListForItemsCount = await titleListForItems.count();

        expect(titleListForItemsCount).toEqual(10);

        for (let i = 0; i < titleListForItemsCount; i++) {
            const titleLink = await titleListForItems.nth(i);
            await expect(titleLink).toHaveAttribute('href', new RegExp('/ko/product/'));

            const titleText = await titleLink.locator('div').innerText();
            expect(titleText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('2-8 목록 아이템 파일 형식 확인', async () => {
        const filesListForItems = await page.locator('div.sc-ccbdafc9-6.gorYwP > div:nth-child(2)');
        const filesListForItemsCount = await filesListForItems.count();

        expect(filesListForItemsCount).toEqual(10);

        for (let i = 0; i < filesListForItemsCount; i++) {
            const supportedFileList = await filesListForItems.nth(i).locator('div');
            expect(await supportedFileList.count()).toBeGreaterThanOrEqual(1);
        }
    });

    test('2-9 목록 아이템 가격 형식 확인', async () => {
        const priceListForItems = await page.locator('div.sc-ccbdafc9-3.etXTmj');
        const priceListForItemsCount = await priceListForItems.count();

        expect(priceListForItemsCount).toEqual(10);

        for (let i = 0; i < priceListForItemsCount; i++) {
            const priceList = await priceListForItems.nth(i).locator('div');
            expect(await priceList.count()).toBeGreaterThanOrEqual(1);

            if(await priceList.count() == 1) {
                expect(await priceList.first().innerText()).toEqual('Free');
            } else if(await priceList.count() > 1) {
                const price = await priceList.nth(1).locator('div:first-child').innerText();
                expect(parseInt(price.replace(/,/g, ''))).toBeGreaterThanOrEqual(1);
            } else {
                test.fail();
            }
        }
    });

    test('2-10 목록 아이템 조회수 형식 확인', async () => {
        const viewListForItems = await page.locator('div.sc-ccbdafc9-4.euirDZ > div');
        const viewListForItemsCount = await viewListForItems.count();

        expect(viewListForItemsCount).toEqual(10);
        await expect(viewListForItems.locator('svg')).toHaveCount(10);

        for (let i = 0; i < viewListForItemsCount; i++) {
            const viewCountString = await viewListForItems.nth(i).locator('div').innerText();
            expect(parseInt(viewCountString.replace(/,/g, ''))).toBeGreaterThanOrEqual(1);
        }
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
});