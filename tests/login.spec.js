const { test, expect } = require('@playwright/test');
require('dotenv').config();

test('1-1 로그인 탭 기본정보 확인 (직접 URL 접근)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon/users/login');
    await expect(page.locator('.cCZhP')).toHaveCount(1); // 자동 로그인 체크박스 클래스 확인
});

test('1-2 로그인 탭 기본정보 확인 (메인 페이지에서 접근)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
    await expect(page.locator('.cCZhP')).toHaveCount(1); // 자동 로그인 체크박스 클래스 확인
});

test('1-3 유효한 로그인 (키보드 + 클릭)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay: 200 }); // 글자당 0.2초 딜레이
    await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD, { delay: 200 }); // 글자당 0.2초 딜레이

    await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: '로그인' }).click()
      ]);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');
});

test('1-4 유효한 로그인 (키보드만)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay: 200 });
    await page.keyboard.press('Tab');

    await page.keyboard.type(process.env.VALID_PASSWORD, { delay : 200 });

    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Enter')
      ]);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');
});