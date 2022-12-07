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
});