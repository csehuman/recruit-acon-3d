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

    await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD, { delay : 100 }); 

    await Promise.all([
        page.waitForNavigation(),
        page.getByRole('button', { name: '로그인' }).click()
      ]);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');
});

test('1-4 유효한 로그인 (키보드만)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay : 100 });
    await page.keyboard.press('Tab');

    await page.keyboard.type(process.env.VALID_PASSWORD, { delay : 100 });

    await Promise.all([
        page.waitForNavigation(),
        page.keyboard.press('Enter')
      ]);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');
});

test('2-1 비정상 로그인 (맞는 아이디, 잘못된 비번)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.VALID_USERNAME, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(process.env.INVALID_PASSWORD, { delay : 100 }); 

    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page.getByRole('button', { name: '로그인' })).toHaveCount(1);

    await expect(page.getByText('아이디 또는 비밀번호를 다시한번 확인해 주시기 바랍니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('2-2 비정상 로그인 (잘못된 아이디, 맞는 비번)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon')

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.INVALID_USERNAME, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(process.env.VALID_PASSWORD, { delay : 100 }); 

    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page.getByRole('button', { name: '로그인' })).toHaveCount(1);

    await expect(page.getByText('회원정보를 찾을 수 없습니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('2-3 비정상 로그인 (잘못된 아이디, 잘못된 비번)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(process.env.INVALID_USERNAME, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(process.env.INVALID_PASSWORD, { delay : 100 }); 

    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page.getByRole('button', { name: '로그인' })).toHaveCount(1);

    await expect(page.getByText('회원정보를 찾을 수 없습니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('2-4 비정상 로그인 (맞는 아이디, 잘못된 비번으로 다회 실행)', async ({ context, page, browserName }) => {
    const userName = browserName === 'chromium' ? process.env.VALID_USERNAME_CHROME_1 
    : browserName === 'firefox' ? process.env.VALID_USERNAME_FIREFOX_1 
    : browserName === 'webkit' ? process.env.VALID_USERNAME_WEBKIT_1
    : process.env.VALID_USERNAME;

    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await page.getByPlaceholder('아이디').type(userName, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(process.env.INVALID_PASSWORD, { delay : 100 }); 

    for(let i = 0; i < 7; i++) {
        await page.getByRole('button', { name: '로그인' }).click();

        const loginButton = page.getByRole('button', { name: '로그인' });
        await loginButton.waitFor({ state : 'visible'}); // 로그인 로딩이 끝날 때까지 대기
    }
    await expect(page.getByText('로그인을 7회 실패하셨습니다. 10회 이상 실패 시 접속이 제한됩니다.')).toHaveCount(1);

    for(let i = 0; i < 3; i++) {
        await page.getByRole('button', { name: '로그인' }).click();

        const loginButton = page.getByRole('button', { name: '로그인' });
        await loginButton.waitFor({ state : 'visible'}); // 로그인 로딩이 끝날 때까지 대기
    }
    await expect(page.getByText('존재하지 않거나 잘못된 정보로 잦은 로그인 시도하였습니다. 정보보호를 위해 15분간 접속이 차단됩니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('3-1 공백 포함 아이디', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    // 앞
    await simpleLoginFromLoginPage(page, ' ' + process.env.VALID_USERNAME, process.env.VALID_PASSWORD, true);
    await simpleLogoutFromMainPage(page);

    // 뒤
    await page.getByRole('link', { name: '로그인' }).click();
    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME + ' ', process.env.VALID_PASSWORD, true);
    await simpleLogoutFromMainPage(page);

    // 중간
    await page.getByRole('link', { name: '로그인' }).click();
    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME.replace('@', ' @'), process.env.VALID_PASSWORD, false);
    await expect(page.getByText('아이디 또는 비밀번호를 다시한번 확인해 주시기 바랍니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('3-2 공백 포함 비밀번호', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    // 앞
    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, ' ' + process.env.VALID_PASSWORD, true);
    await simpleLogoutFromMainPage(page);

    // 뒤
    await page.getByRole('link', { name: '로그인' }).click();
    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, process.env.VALID_PASSWORD + ' ', true);
    await simpleLogoutFromMainPage(page);

    // 중간
    await page.getByRole('link', { name: '로그인' }).click();
    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, process.env.VALID_PASSWORD.slice(0, 1) + ' ' + process.env.VALID_PASSWORD.slice(1), false);
    await expect(page.getByText('아이디 또는 비밀번호를 다시한번 확인해 주시기 바랍니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('3-3 한글 포함 아이디', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await simpleLoginFromLoginPage(page, 'ㅇ' + process.env.VALID_USERNAME, process.env.VALID_PASSWORD, false);

    await expect(page.getByText('아이디 또는 비밀번호를 다시한번 확인해 주시기 바랍니다.')).toHaveCount(1);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('4-1 로그아웃', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();

    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, process.env.VALID_PASSWORD, true);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');

    await page.getByRole('navigation').locator('svg').nth(2).click({ delay : 100 });
    await page.locator('a').filter({ hasText: '로그아웃' }).click({ delay : 100 });

    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');
});

test('5-1 아이디 저장 기능 작동 (활성화 상태)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon');

    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page.locator('.cCZhP')).toHaveCount(1);

    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, process.env.VALID_PASSWORD, true);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');

    await page.getByRole('navigation').locator('svg').nth(2).click({ delay : 100 });
    await page.locator('a').filter({ hasText: '로그아웃' }).click({ delay : 100 });

    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');

    await expect(page.getByPlaceholder('아이디')).toHaveValue(process.env.VALID_USERNAME);
});

test('5-2 아이디 저장 기능 작동 (비활성화 상태)', async ({ context, page }) => {
    await page.goto('https://www.acon3d.com/ko/toon')

    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page.locator('.cCZhP')).toHaveCount(1);

    await page.locator('.cCZhP').click();
    await expect(page.locator('.fPbsVt')).toHaveCount(1);

    await page.getByText('아이디 저장').click();
    await expect(page.locator('.cCZhP')).toHaveCount(1);

    await page.locator('.cCZhP').click();
    await expect(page.locator('.fPbsVt')).toHaveCount(1);

    await simpleLoginFromLoginPage(page, process.env.VALID_USERNAME, process.env.VALID_PASSWORD, true);

    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon');

    await page.getByRole('navigation').locator('svg').nth(2).click({ delay : 100 });
    await page.locator('a').filter({ hasText: '로그아웃' }).click({ delay : 100 });

    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page).toHaveURL('https://www.acon3d.com/ko/toon/users/login');

    await expect(page.getByPlaceholder('아이디')).toHaveValue('');
});

async function simpleLoginFromLoginPage(page, username, password, willLoginPass) {
    await page.getByPlaceholder('아이디').fill('');
    await page.getByPlaceholder('아이디').type(username, { delay : 100 }); 
    await page.getByPlaceholder('비밀번호').type(password, { delay : 100 }); 

    if (willLoginPass) {
        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('button', { name: '로그인' }).click()
        ]);
    } else {
        await page.getByRole('button', { name: '로그인' }).click();
        await expect(page.getByRole('button', { name: '로그인' })).toHaveCount(1);
    }
};

async function simpleLogoutFromMainPage(page) {
    await page.getByRole('navigation').locator('svg').nth(2).click({ delay : 100 });
    await page.locator('a').filter({ hasText: '로그아웃' }).click({ delay : 100 });
};