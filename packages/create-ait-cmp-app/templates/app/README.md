# __DISPLAY_NAME__

Compose Multiplatform으로 생성한 서비스입니다. 앱인토스 appName은 `__APP_NAME__`입니다.

## 실행 준비

Node 24 이상, Corepack, JDK 17이 필요합니다. Yarn 4.18.1을 사용하며 `corepack enable`로 yarn 명령을 활성화합니다. `corepack yarn install --immutable` 후 `yarn dev`로 명시적인 mock 예제를 실행하거나, `yarn build`로 `__APP_NAME__.ait`를 생성합니다. 업로드 전에 앱인토스 콘솔의 appName과 브랜드 정보를 맞춰야 합니다. `yarn dev:toss`는 실제 브리지를 로컬 네트워크에 제공합니다. 콘솔에 자동 업로드하지 않습니다.

## 코드 검사

`yarn lint`로 JS·TS와 Kotlin·Gradle 스크립트를 검사하고, `yarn lint:fix`로 자동 수정합니다. Kotlin 검사에는 JDK 17이 필요합니다.

## GitHub Actions CI

기본 CI는 `.github/workflows/ci.yml`에 포함됩니다. 생성한 앱을 GitHub 저장소에 커밋하고 `main`에 푸시하면 실행되며, `main` 대상 PR에서도 실행됩니다. 별도의 secret 설정은 필요하지 않습니다.

JS·TS 린트와 Kotlin·Gradle 린트, 공통 core JVM 테스트를 실행합니다. Android·iOS·웹 타깃 선택 여부와 관계없이 사용할 수 있습니다. 서비스별 JS 테스트나 Android·iOS 빌드는 필요한 시점에 추가합니다.

## 선택한 플랫폼 실행

독립 웹 타깃을 선택했다면 `yarn dev:web`과 `yarn build:web`을 사용합니다. 독립 웹 배포물에는 토스 브리지와 mock을 포함하지 않습니다.

Android에는 Android SDK 37이 필요하며 `./gradlew :androidApp:assembleDebug`로 빌드합니다. iOS에는 macOS와 Xcode가 필요합니다. `iosApp/ServiceSample.xcodeproj`를 열고 서명 정보를 설정합니다. 선택하지 않은 플랫폼의 디렉터리와 실행 명령은 사용할 수 없습니다.

## 코드 공유

`shared-core`는 데이터 모델과 통신 함수를 주입받는 API 클라이언트를, `shared-ui`는 개별 화면을 제공합니다. `appsInTossApp`은 토스 연동을 담당합니다. TDS는 포함하지 않습니다. 예제에서 `저장해요`를 누른 내용은 기기에 저장하지만, 운영 서비스에는 별도의 데이터 저장소를 연결해야 합니다.

나중에 플랫폼을 추가하려면 이 CLI 버전에 포함된 템플릿에서 필요한 호스트 디렉터리만 가져와 식별자를 바꾸고 Gradle 모듈을 등록합니다. 공통 모듈은 호스트 디렉터리 유무에 따라 Android KMP 플러그인과 iOS 타깃을 활성화합니다. SDK 저장소의 네이티브 가이드에 따라 검증합니다. CLI는 기존 파일을 덮어쓰지 않습니다.
