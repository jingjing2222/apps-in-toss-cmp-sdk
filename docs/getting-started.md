# 시작하기

## 개발 환경

Node 24 이상, Corepack, JDK 17을 준비합니다. 저장소와 생성 앱은 `packageManager`로 Yarn 4 버전을 지정하고 `node-modules` 방식으로 설치합니다. 현재 버전은 [호환성 표](compatibility.md)를 참고하세요.

Android 예제를 빌드하려면 Android SDK 37이 필요합니다. iOS에는 macOS와 Xcode가 추가로 필요합니다. SDK 저장소는 모든 예제 타깃을 구성하므로 Android SDK 경로도 준비합니다. CLI로 생성한 앱인토스 전용 앱은 Android SDK·Xcode 없이 사용할 수 있습니다.

저장소 루트에서 실행합니다.

```sh
corepack enable
yarn install --immutable
```

JDK 기본 버전이 다르면 `JAVA_HOME`을 JDK 17 경로로 설정합니다. Android SDK가 자동으로 검색되지 않으면 `ANDROID_HOME`을 설정하거나 로컬 `local.properties`에 `sdk.dir`을 지정합니다. 로컬 환경 설정 파일은 커밋하지 않습니다.

## 앱인토스 예제

```sh
yarn dev
```

터미널에 표시된 주소를 엽니다. `dev`는 명시적인 mock 브리지를 사용하며 화면에 `MOCK`을 표시합니다. mock 인가 코드는 서버에서 인증에 사용하지 않습니다. 자동 갱신은 구현하지 않아 소스를 수정하면 서버를 다시 시작해야 합니다.

```sh
yarn dev:toss
```

실제 브리지를 로컬 네트워크에 제공하는 명령입니다. 앱인토스 샌드박스 연결과 콘솔 설정은 별도로 준비합니다. 브라우저 미리보기만으로 실제 토스앱 동작을 확인할 수는 없습니다.

```sh
yarn build
```

JS/Wasm 호환 배포물에 실제 브리지를 연결하고 공식 `ait build`로 `cmp-service-sample.ait`를 생성합니다. 자동 업로드하지 않습니다. 콘솔 appName·브랜드·로고 등 서비스 정보를 맞춘 뒤 [출시 준비](release.md)를 진행합니다.

## 다른 호스트 실행

```sh
yarn dev:web
yarn build:web
./gradlew :sample:androidApp:assembleDebug
```

독립 웹에는 토스 브리지와 mock을 넣지 않습니다. iOS는 `sample/iosApp/ServiceSample.xcodeproj`를 엽니다. [네이티브 연동](native.md)에 도구 설정과 화면 연결 방법을 설명했습니다.

## 새 프로젝트 만들기

현재 CLI는 미배포 상태입니다. 저장소에 포함된 템플릿으로 생성합니다.

```sh
node packages/create-ait-cmp-app/cli.js my-app
```

질문에 따라 타깃·Kotlin 패키지·콘솔 appName·표시 이름을 입력합니다. 기본 타깃은 앱인토스만 선택하며, 생성 후 Yarn으로 의존성을 설치합니다. 생성된 앱의 README는 앱과 공유 모듈을, `docs/development.md`는 실행·검사·CI 방법을 설명합니다.

SDK나 예제 코드를 수정한 뒤 생성물에도 반영하려면 먼저 `yarn template`로 템플릿을 갱신합니다. 상세 옵션은 [CLI 사용법](cli.md), 유지보수 절차는 [개발 가이드](development.md)를 참고하세요.
