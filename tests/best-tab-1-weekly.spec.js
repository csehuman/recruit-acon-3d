const { test, expect } = require('@playwright/test');
require('dotenv').config();

test.describe('3. 주간 베스트 탭 확인', () => {
    let page;
    let browserContext;

    test.beforeAll(async ({ browser, contextOptions }) => {
        browserContext = await browser.newContext(contextOptions);
        page = await browserContext.newPage();

        await page.goto('https://www.acon3d.com/ko/toon');
        await page.locator('div.gnb__best').click();
        await page.waitForURL('https://www.acon3d.com/ko/toon/best');

        await page.locator('.iCyRmu').click();
        await expect(page.locator('.kYGnLX')).toHaveCount(1);
    });

    test('3-1 주간 베스트탭 기본 정보 확인', async () => {
        await expect(page.getByText('이번주 Top 30')).toHaveCount(1);
        await expect(page.locator('div.mt-3 > div > div')).toHaveCount(30);

        await expect(page.locator('div.cursor-pointer:has-text("전체")')).toHaveCSS('color', 'rgb(0, 0, 0)')
    });

    test('3-2 카테고리별 주간 탭 정보 확인', async () => {
        const tabList = ['전체', '판타지/중세', '동양/사극/무협', 'SF/아포칼립스', '느와르/범죄/재벌', '일상/현대물', '무료'];

        for (const tab of tabList) {
            await page.locator(`div.cursor-pointer:has-text("${tab}")`).click();
            await expect(page.locator(`div.cursor-pointer:has-text("${tab}")`)).toHaveCSS('color', 'rgb(0, 0, 0)')
    
            await expect(page.locator('div.mt-3 > div > div')).toHaveCount(30);
        }
    });

    test('3-3 무료 카테고리 확인', async () => {
        await page.locator('div.cursor-pointer:has-text("무료")').click();

        await expect(page.locator('span.sc-9fb6eb33-13.cFlCeC')).toHaveCount(30);

        const priceListForItems = await page.locator('span.sc-9fb6eb33-13.cFlCeC');
        const priceListForItemsCount = await priceListForItems.count();

        expect(priceListForItemsCount).toEqual(30);

        for (let i = 0; i < priceListForItemsCount; i++) {
            const priceText = await priceListForItems.nth(i).innerText();
            expect(priceText).toEqual('FREE');
        }
    });

    test('3-4 목록 아이템 숫자 형식 확인', async () => {
        const numbers = await page.locator('div.sc-a6216f25-3.kANYhH > div');
        const count = await numbers.count();
        for (let i = 1; i < count + 1; i++) {
            const innerText = await numbers.nth(i - 1).innerText()
            expect(innerText).toEqual(i < 10 ? '0'+i : `${i}`);
        }
    });

    test('3-5 목록 아이템 사진 형식 확인', async () => {
        await expect(page.locator('div.sc-c1d401f7-1.eFqSHf img')).toHaveCount(30);
     });

     test('3-6 목록 아이템 브랜드 형식 확인', async () => {
        const brandListForItems = await page.locator('p.sc-9fb6eb33-5.dPfhQF > a');
        const brandListForItemsCount = await brandListForItems.count();

        expect(brandListForItemsCount).toEqual(30);

        for (let i = 0; i < brandListForItemsCount; i++) {
            const brandLink = await brandListForItems.nth(i);
            await expect(brandLink).toHaveAttribute('href', new RegExp('/ko/brand/'));

            const brandText = await brandLink.innerText();
            expect(brandText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('3-7 목록 아이템 제목 형식 확인', async () => {
        const titleListForItems = await page.locator('div.sc-9fb6eb33-6.hYqCaj > a');
        const titleListForItemsCount = await titleListForItems.count();

        expect(titleListForItemsCount).toEqual(30);

        for (let i = 0; i < titleListForItemsCount; i++) {
            const titleLink = await titleListForItems.nth(i);
            await expect(titleLink).toHaveAttribute('href', new RegExp('/ko/product/'));

            const titleText = await titleLink.locator('div').innerText();
            expect(titleText.length).toBeGreaterThanOrEqual(1);
        }
    });

    test('3-8 목록 아이템 파일 형식 확인', async () => {
        const filesListForItems = await page.locator('span.sc-9fb6eb33-15.fhWxhL');
        const filesListForItemsCount = await filesListForItems.count();

        expect(filesListForItemsCount).toEqual(30);

        for (let i = 0; i < filesListForItemsCount; i++) {
            const supportedFileList = await filesListForItems.nth(i).locator('a');
            expect(await supportedFileList.count()).toBeGreaterThanOrEqual(1);
        }
    });

    test('3-9 목록 아이템 가격 형식 확인', async () => {
        const priceListForItems = await page.locator('span.sc-9fb6eb33-13.cFlCeC');
        const priceListForItemsCount = await priceListForItems.count();

        expect(priceListForItemsCount).toEqual(30);

        for (let i = 0; i < priceListForItemsCount; i++) {
            const price = await priceListForItems.nth(i).innerText();
            const priceNumber = await price === 'FREE' ? 0 : parseInt(price.replace(/,/g, ''))
            expect(priceNumber).toBeGreaterThanOrEqual(0);
        }
    });

    test('3-10 목록 아이템 조회수 형식 확인', async () => {
        const viewListForItems = await page.locator('div.sc-9fb6eb33-22.hJGuFz > div');
        const viewListForItemsCount = await viewListForItems.count();

        expect(viewListForItemsCount).toEqual(30);
        await expect(viewListForItems.locator('svg')).toHaveCount(30);

        for (let i = 0; i < viewListForItemsCount; i++) {
            const viewCountString = await viewListForItems.nth(i).locator('div').innerText();
            expect(parseInt(viewCountString.replace(/,/g, ''))).toBeGreaterThanOrEqual(1);
        }
    });

    test.describe.serial('3-11 목록 아이템 북마크 기능 확인', () => {
        test('3-11.1 로그인', async ({ browserName }) => {
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
});