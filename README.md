# ACON-3D E2E-TEST

> 개발 기간: 2022.12.05 ~ 2022.12.08

## Pre-requisite

- QA 시작 전에 가정, 의도, 고려한 점은 [Pre-QA](https://www.notion.so/on-happy-holiday/_-3a2106ef4cf1475b92907a80a59f5f88)에서 보실 수 있습니다.
- QA에 사용된 TC(테스트케이스) 정리는 [QA-Spreadsheet](https://docs.google.com/spreadsheets/d/1sOvjewSI10MwGZ_sGA6QmAdWLCNp2b3lIfB3UpmQek0/edit?usp=sharing/)에서 보실 수 있습니다.

## Stack

- Playwright (JavaScript)
- dotenv

## Getting Started

1. 프로젝트 다운로드

```sh
git clone https://github.com/csehuman/recruit-acon-3d.git
```

2. node & npm 설치하기 (이미 설치되어 있다면 다음 단계로 이동)

```sh
brew update
brew install node
```

3. dependecy 설치하기

- 원하는 프로젝트를 VSCode로 열고, 터미널을 통해 아래 커맨드 실행합니다.

```sh
npm install
```

4. .env 파일 만들기

- .env 파일을 [여기](https://www.dropbox.com/s/7mqxhze3n9iqtmq/.env?dl=0)서 다운 받습니다.
- 저장된 파일의 이름을 env에서 .env로 수정합니다. (꼭!!)
  ![N|env](https://www.dropbox.com/s/jd5k9f0w0f2quy8/setting-up-env.png?raw=1)
- .env 파일을 프로젝트 폴더로 옮깁니다.

5. 테스트 실행하기

```sh
npm run test
```

- 테스트는 평균 20분 ~ 30분 안에 실행이 완료됩니다. 아이디 입력, 버튼 클릭 등에 딜레이를 줘서 실행 시간이 깁니다.

6. 테스트 보고서 보기

- 1,, 테스트가 Failure가 있는 상태로 완료되었다면, 로컬호스트로 테스트 보고서가 자동으로 배포됩니다.
  ![N|test-fail](https://www.dropbox.com/s/lr9gi9jtwkwi8iw/test-failed.png?raw=1)
  배포된 HTML로 접속하면 아래와 같은 자세한 테스트 보고서를 볼 수 있습니다.
  ![N|test-fail2](https://www.dropbox.com/s/rlpwd7u6p77ogha/test-report.png?raw=1)
- 2,, 테스트가 Failure 없이 완료되었다면, 별도의 테스트 보고서가 배포되지 않습니다.
  아래와 같이 npx playwright show-report를 실행하면 로컬호스트로 테스트 보고서를 볼 수 있습니다.
  ![N|test-success](https://www.dropbox.com/s/cvcs827a3gwyidf/test-success.png?raw=1)

## Self Review

- 과제 완료 후 진행한 회고 및 후기는 [Assignment Review](https://www.notion.so/on-happy-holiday/_-3a5a8119b58d41cdb11ca5c35e3141ea)에서 보실 수 있습니다.
