const { test, expect } = require('@playwright/test');

test.describe('5. 전체 베스트 탭 확인', () => {
    let page;
    let browserContext;

    test.beforeAll(async ({ browser, contextOptions }) => {
        browserContext = await browser.newContext(contextOptions);
        page = await browserContext.newPage();

        await page.goto('https://www.acon3d.com/ko/toon');
        await page.locator('div.gnb__best').click();
        await page.waitForURL('https://www.acon3d.com/ko/toon/best');

        await page.locator('.kzwwDw').click();
        await expect(page.locator('.evrnkt')).toHaveCount(1);
    });

    test('5-1 기본 정보 확인 (전체 탭)', async () => {
        await expect(page.getByText('역대 가장 사랑받은 Top 100')).toHaveCount(1);
        await expect(page.locator('div.mt-3 > div > div')).toHaveCount(100);

        await expect(page.locator('div.cursor-pointer:has-text("전체")')).toHaveCSS('color', 'rgb(0, 0, 0)')
    });

    test('5-2 탭 별 정보 확인 (전체 탭)', async () => {
        const tabList = ['전체', '판타지/중세', '동양/사극/무협', 'SF/아포칼립스', '느와르/범죄/재벌', '일상/현대물', '무료'];

        for (const tab of tabList) {
            await page.locator(`div.cursor-pointer:has-text("${tab}")`).click();
            await expect(page.locator(`div.cursor-pointer:has-text("${tab}")`)).toHaveCSS('color', 'rgb(0, 0, 0)')
    
            await expect(page.locator('div.mt-3 > div > div')).toHaveCount(100);
        }
    });

    test('5-3 무료 탭 확인', async () => {
        await page.locator('div.cursor-pointer:has-text("무료")').click();

        await expect(page.locator('span.sc-9fb6eb33-13.cFlCeC')).toHaveCount(100);

        const priceListForItems = await page.locator('span.sc-9fb6eb33-13.cFlCeC');
        const priceListForItemsCount = await priceListForItems.count();

        expect(priceListForItemsCount).toEqual(100);

        for (let i = 0; i < priceListForItemsCount; i++) {
            const priceText = await priceListForItems.nth(i).innerText();
            expect(priceText).toEqual('FREE');
        }
    });

    test('5-4 목록 아이템 숫자 형식 확인', async () => {
        const numbers = await page.locator('div.sc-a6216f25-3.kANYhH > div');
        const count = await numbers.count();
        for (let i = 1; i < count + 1; i++) {
            const innerText = await numbers.nth(i - 1).innerText()
            expect(innerText).toEqual(i < 10 ? '0'+i : `${i}`);
        }
    });

    test('5-5 목록 아이템 사진 형식 확인', async () => {
        await expect(page.locator('div.sc-c1d401f7-1.eFqSHf img')).toHaveCount(100);
     });

     test('5-6 목록 아이템 브랜드 형식 확인', async () => {
        const brandListForItems = await page.locator('p.sc-9fb6eb33-5.dPfhQF > a');
        const brandListForItemsCount = await brandListForItems.count();

        expect(brandListForItemsCount).toEqual(100);

        for (let i = 0; i < brandListForItemsCount; i++) {
            const brandLink = await brandListForItems.nth(i);
            await expect(brandLink).toHaveAttribute('href', new RegExp('/ko/brand/'));

            const brandText = await brandLink.innerText();
            expect(brandText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('5-7 목록 아이템 제목 형식 확인', async () => {
        const titleListForItems = await page.locator('div.sc-9fb6eb33-6.hYqCaj > a');
        const titleListForItemsCount = await titleListForItems.count();

        expect(titleListForItemsCount).toEqual(100);

        for (let i = 0; i < titleListForItemsCount; i++) {
            const titleLink = await titleListForItems.nth(i);
            await expect(titleLink).toHaveAttribute('href', new RegExp('/ko/product/'));

            const titleText = await titleLink.locator('div').innerText();
            expect(titleText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('5-8 목록 아이템 파일 형식 확인', async () => {
        const filesListForItems = await page.locator('span.sc-9fb6eb33-15.fhWxhL');
        const filesListForItemsCount = await filesListForItems.count();

        expect(filesListForItemsCount).toEqual(100);

        for (let i = 0; i < filesListForItemsCount; i++) {
            const supportedFileList = await filesListForItems.nth(i).locator('a');
            expect(await supportedFileList.count()).toBeGreaterThanOrEqual(1);
        }
    });

    test('5-9 목록 아이템 가격 형식 확인', async () => {
        const priceListForItems = await page.locator('span.sc-9fb6eb33-13.cFlCeC');
        const priceListForItemsCount = await priceListForItems.count();

        expect(priceListForItemsCount).toEqual(100);

        for (let i = 0; i < priceListForItemsCount; i++) {
            const price = await priceListForItems.nth(i).innerText();
            const priceNumber = await price === 'FREE' ? 0 : parseInt(price.replace(/,/g, ''))
            expect(await priceNumber).toBeGreaterThanOrEqual(0);
        }
    });

    test('5-10 목록 아이템 조회수 형식 확인', async () => {
        const viewListForItems = await page.locator('div.sc-9fb6eb33-22.hJGuFz > div');
        const viewListForItemsCount = await viewListForItems.count();

        expect(viewListForItemsCount).toEqual(100);
        await expect(viewListForItems.locator('svg')).toHaveCount(100);

        for (let i = 0; i < viewListForItemsCount; i++) {
            const viewCountString = await viewListForItems.nth(i).locator('div').innerText();
            expect(parseInt(viewCountString.replace(/,/g, ''))).toBeGreaterThanOrEqual(1);
        }
    });
    
});