# 독립 웹 메모 앱

토스 런타임 없이 공통 메모 화면과 서비스 로직을 사용하는 Compose 웹앱 예제입니다. [공통 UI](../shared-ui/README.md)와 [공통 core](../shared-core/README.md)를 사용합니다.

## 동작

메모 목록·상세·편집·저장을 제공합니다. 초안은 localStorage에 메모 ID별로 저장하며 출처(origin)별로 구분합니다. 토스 로그인, 브리지, mock은 배포물에 포함하지 않습니다. URL·히스토리 기반 화면 이동과 서비스 인증은 별도 구현이 필요합니다.

## 실행

Node 24 이상·Corepack·JDK 17과 Yarn 의존성을 준비하고 프로젝트 루트에서 실행합니다.

```sh
yarn dev:web
yarn build:web
```

배포물은 `dist/web`에 생성됩니다. 저장소 예제의 조회 데이터는 로컬 데모 데이터입니다.
