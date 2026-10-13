# Apps in Toss CMP SDK

Compose Multiplatform(CMP)으로 앱인토스 서비스를 만들고, 필요한 화면·서비스 로직·API 클라이언트를 Android·iOS·독립 웹서비스에 재사용하는 SDK입니다.

현재는 외부에 배포하지 않은 비공식 초기 구현입니다. 앱인토스 승인이나 운영 환경의 WebView 호환성을 보장하지 않습니다. TDS 패키지·폰트·에셋은 포함하지 않습니다. 공통 예제는 SIL Open Font License에 따라 Noto Sans KR을 사용하며, 라이선스 원문은 `licenses/`에 있습니다.

## 예제 실행

Node 24 이상, Corepack, JDK 17이 필요합니다. Yarn 4.18.1을 `packageManager`에 고정했습니다. `corepack enable`로 yarn 명령을 활성화합니다. Android 빌드에는 Android SDK 37이, iOS 빌드에는 macOS와 Xcode가 추가로 필요합니다. 저장소의 예제는 모든 타깃을 구성합니다. 생성 CLI로 만든 앱인토스 전용 프로젝트에는 Android SDK나 Xcode가 필요하지 않습니다.

```sh
yarn install --immutable
yarn dev
```

터미널에 표시된 로컬 주소를 엽니다. `dev`는 개발용 모의 구현(mock) 브리지를 사용하며, 화면에 실행 환경을 `MOCK`으로 표시합니다. 모의 인가 코드를 서버와 교환하지 않습니다. 소스를 수정하면 개발 서버를 다시 시작해야 하며, 자동 갱신은 구현하지 않았습니다.

```sh
yarn build
yarn dev:web
yarn build:web
```

`yarn dev:toss`는 샌드박스 테스트용 실제 브리지를 로컬 네트워크에 제공합니다. 브라우저용 mock은 사용하지 않습니다.

`build`는 Wasm과 Kotlin/JS 호환 배포물을 컴파일하고 실제 SDK 브리지를 묶은 뒤, 공식 `ait build`를 실행합니다. `cmp-service-sample.ait`를 로컬에 생성하며 자동 업로드하지 않습니다. 토스앱에서 테스트하려면 업로드 전에 앱인토스 콘솔에 일치하는 appName과 브랜드 정보를 등록해야 합니다.

`dev:web`과 `build:web`은 독립 웹서비스용 명령입니다. 운영 배포물에는 토스 브리지와 mock을 포함하지 않습니다. 웹 예제에서 명시적으로 저장한 초안은 브라우저의 localStorage에 보관하며, 출처(origin)별로 데이터가 구분됩니다. 예제 저장소에는 인증 정보나 개인정보를 저장하지 마세요.

## 프로젝트 생성

검증한 예제와 로컬 SDK 바이너리로 생성 템플릿을 준비합니다.

```sh
yarn template
node packages/create-ait-cmp-app/cli.js my-app
```

생성 CLI는 타깃·패키지 ID·콘솔 appName·표시 이름을 입력받고, 생성 전에 요약을 보여줍니다. 기본 타깃은 앱인토스만 선택합니다. 자동화 환경에서는 다음처럼 값을 지정합니다.

```sh
node packages/create-ait-cmp-app/cli.js my-app --yes \
  --package io.example.myapp --app-name my-app \
  --display-name '내 앱' --targets apps-in-toss,android,ios,web
```

배포 후 사용할 명령은 `yarn dlx create-ait-cmp-app`이며, 아직 npm에 배포하지 않았습니다. 템플릿에는 SDK Maven 바이너리와 npm 브리지 압축 파일을 포함하므로, 생성된 앱이 미배포 원격 패키지에 의존하지 않습니다. SDK 구현 소스는 복사하지 않습니다. 자세한 내용은 [생성 CLI 사용법](docs/cli.md)을 참고하세요.

## 필요한 부분만 공유하기

| 모듈 | 역할 |
| --- | --- |
| `sdk` | Kotlin API와 취소 가능한 JS/Wasm 호스트 브리지 |
| `packages/web-bridge` | 공식 앱인토스 SDK 어댑터와 개발용 mock |
| `sample/shared-core` | 모델·통신 함수를 주입받는 JSON API 클라이언트·데이터 조회 및 저장 계약. Compose·토스 의존성 없음 |
| `sample/shared-ui` | 개별 재사용이 가능한 Compose 목록·상세 화면. 토스·TDS 의존성 없음 |
| `sample/appsInTossApp` | 토스 전용 로그인 화면·호스트 이벤트·안전 영역(safe area)·공유·웹 진입점 |
| `sample/webApp` | 독립 웹 진입점 |
| `sample/androidApp`, `sample/iosApp` | 공통 화면을 실행하는 네이티브 호스트 |
| `packages/create-ait-cmp-app` | 템플릿을 포함한 대화형 생성 CLI |

`NotesApiClient`는 백엔드의 JSON 응답을 반환하는 suspend 통신 함수를 주입받습니다. HTTPS·인증·플랫폼별 네트워크 처리는 주입한 함수가 담당합니다. 예제의 데이터 조회 구현은 로컬 샘플 데이터를 반환하며, 운영 백엔드나 계정 연동은 포함하지 않습니다.

`NotesList`나 `NoteDetail`을 개별적으로 사용하거나 앱에서 함께 구성할 수 있습니다. 토스 로그인·결제·광고 호출은 앱인토스 호스트에 둡니다. 독립 서비스에는 별도 인증과 플랫폼 어댑터를 연결해야 합니다. TDS 연동은 아직 구현하지 않았으며, 공통 모듈에 TDS 의존성을 넣지 않습니다. [공유 구조](docs/architecture.md)와 [네이티브 호스트](docs/native.md)를 참고하세요.

## 검증

```sh
yarn lint
yarn test
./gradlew :sdk:jvmTest :sample:shared-core:jvmTest
./gradlew :sample:androidApp:assembleDebug
```

JS·TS는 ESLint 10과 typescript-eslint로, Kotlin 소스·Gradle 스크립트는 ktlint 1.8.0으로 검사합니다. `yarn lint:js`, `yarn lint:kotlin`로 따로 검사하거나 `yarn lint:fix`로 자동 수정할 수 있습니다. Kotlin 검사에는 JDK 17이 필요합니다. 생성 CLI의 템플릿에도 같은 설정을 포함합니다. 빌드 산출물·외부 바이너리·템플릿 사본은 중복 검사하지 않습니다.

GitHub Actions는 `main` 푸시와 `main` 대상 PR에서 JS·Kotlin 린트와 테스트를 병렬로 실행합니다. JS 브리지·CLI 테스트와 SDK·공통 core JVM 계약 테스트가 대상이며, 같은 PR의 이전 실행은 새 커밋이 올라오면 취소됩니다. 별도의 `Generated app CI`는 배포용 CLI 압축 패키지에서 앱인토스 전용·전체 타깃 앱을 생성해 각 앱의 린트·공통 core 테스트와 CI 파일 복원을 검사합니다. Android·iOS 빌드와 브라우저 실행 검사는 이 CI에 포함하지 않습니다.

2026-10-13 기준 최신 안정 버전인 Kotlin 2.4.21, Compose Multiplatform 1.12.1, Gradle 9.8.1, AGP 9.4.1을 사용합니다. Material3는 별도 버전인 1.9.0입니다. 버전은 `gradle/libs.versions.toml`과 Gradle Wrapper에서 관리합니다.

Kotlin SDK는 공식 웹 SDK 패키지에 의존하지 않습니다. 기본 JS 어댑터의 peer 범위는 `>=3.0.1 <4.0.0`이며, 예제와 생성 앱은 재현 가능한 빌드를 위해 3.8.0과 잠금 파일을 사용합니다. 직접 주입하는 방법과 호환 범위는 [설계 문서](docs/architecture.md)를 참고합니다.

Gradle 9.8.1과 AGP 9.4.1은 [Kotlin의 공식 완전 지원 범위](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)를 넘습니다. 현재 프로젝트의 빌드 결과와 도구 공급자의 지원 범위는 구분해야 합니다. Xcode 시뮬레이터 빌드와 CLI가 생성한 프로젝트의 빌드는 별도로 검증합니다. 웹 검증에는 Aside를 사용하며, Chrome/CDP 자동화로 대체하지 않습니다.

실제로 확인한 범위는 [검증 결과와 남은 작업](docs/validation.md)에 기록했습니다. 출시 전에는 실제 호스트 로그인·콘솔 업로드·앱 심사·기기 접근성·구형 WebView의 대체 실행·로딩 성능을 추가로 검증해야 합니다.
