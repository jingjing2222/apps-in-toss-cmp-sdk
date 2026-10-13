# 검증 결과와 남은 작업

2026-10-13에 Node 24.21.0, JDK 17, Android SDK 37, Xcode 27 환경에서 확인했습니다. 초기 구현과 의존성 갱신의 검증 기록이며 출시 요건 통과를 의미하지 않습니다.

| 검사 | 결과 |
| --- | --- |
| Kotlin SDK JVM 계약 테스트 | 6개 통과. 미지원 호스트, 로그인·사용자 키 응답 검증, 로그인 중복 요청, 취소·제한 시간·종료, 이벤트 정리 |
| 공통 API 클라이언트 JVM 테스트 | 2개 통과. 정상 응답과 잘못된 서버 데이터 |
| JavaScript 브리지 테스트 | 10개 통과. 공식 API 연결, 호스트 부재, 취소, 구독·해제, 기능 부재 처리, 어댑터 주입, 공식 SDK 3.0.1·3.8.0 공개 함수 형태 확인 |
| 생성 CLI 테스트 | 16개 통과. 대화형·기본값·옵션, 취소, 메타데이터 이스케이프, 기존 파일·심볼릭 링크 보호, 설치 실패, Wrapper·잠금 파일 보존 |
| 공유 의존성 경계 | 통과. 공통 core·UI와 독립 웹에 토스·TDS import 없음 |
| Wasm·JS 빌드 | 두 타깃 컴파일과 호환 배포물 생성 통과 |
| 공식 패키징 | `ait build`로 로컬 `.ait` 생성. 업로드하지 않음 |
| Android | 저장소 예제와 전체 타깃 생성 앱의 debug APK 빌드 통과 |
| iOS | 저장소 예제와 전체 타깃 생성 앱을 Xcode에서 서명 없이 arm64 시뮬레이터용으로 빌드 |
| 생성 CLI 대화형 실행 | 실제 터미널에서 질문·기본 타깃·유니코드 표시 이름·확인 과정을 거쳐 프로젝트 생성 |
| 앱인토스 전용 생성 앱 | Android SDK 환경 변수 없이 JS/Wasm 컴파일과 `.ait` 패키징 통과 |
| 전체 타깃 생성 앱 | Android 빌드, 앱인토스·독립 웹 컴파일, iOS 빌드 통과. 표시 이름의 따옴표·달러 기호가 최종 Xcode 메타데이터에 유지됨 |
| 기존 JavaScript에서 API 사용 | Compose·토스 없이 내보낸 core API로 정상 JSON을 해석하고 잘못된 JSON을 거부함 |
| 브라우저 미리보기(초기 구현) | Aside에서 한글 표시, 목록·상세 이동, 한글 입력, 명시적 저장, 재진입 복원, mock 로그인 결과 전달 확인 |

번들에 한글 폰트를 포함해 브라우저 Canvas에서 한글이 깨지는 문제를 수정했습니다. 그만큼 전송량과 번들 크기는 증가합니다. 시작 시간이나 프레임 시간은 측정하지 않았습니다. 호환 배포물에는 JS·Wasm 실행 경로를 모두 포함하지만, 구형 엔진의 대체 실행은 검증하지 않았습니다.

이 환경에서 Aside의 스냅샷은 Canvas만 보여주고 전체 Compose 시맨틱 트리는 보여주지 않았습니다. 화면·좌표 검사로 렌더링과 동작을 확인했으며, 이 결과로 스크린 리더 접근성을 판단할 수는 없습니다.

iOS 링크 단계에서 ICU 데이터 객체는 시뮬레이터 18.5용으로 빌드됐지만 앱 타깃은 iOS 16이라는 경고가 발생했습니다. 빌드는 통과했으나 iOS 16 실행 지원을 확인한 결과는 아닙니다. 네이티브 실기기나 시뮬레이터에서 화면을 조작하는 검사는 수행하지 않았습니다.

## 최신 버전 조합

Gradle 9.8.1, Kotlin 2.4.21, Compose Multiplatform 1.12.1, AGP 9.4.1, coroutines 1.11.0, serialization 1.11.0, Activity 1.13.0, Material3 1.9.0, esbuild 0.28.2를 사용합니다. Android 라이브러리는 `com.android.kotlin.multiplatform.library`로 전환했고 Android 앱은 AGP 내장 Kotlin을 사용합니다.

최신 조합으로 Kotlin 테스트 8개, Node 테스트 26개, 샘플 Android·iOS 시뮬레이터 빌드, 앱인토스 JS/Wasm 호환 배포와 `.ait` 패키징, 독립 웹 배포를 확인했습니다. 갱신한 템플릿에서 생성한 기본 앱의 JS/Wasm 컴파일은 Android SDK 환경 변수 없이 통과했고, 전체 타깃 생성 앱의 Android 빌드와 독립 웹 Wasm 컴파일도 통과했습니다. 브라우저 화면 조작과 전체 타깃 생성 앱의 iOS 빌드는 초기 버전에서 수행한 기록이며 이번 갱신 후 반복하지 않았습니다.

[Kotlin의 공식 표](https://kotlinlang.org/docs/multiplatform/multiplatform-compatibility-guide.html)에서 Kotlin 2.4.20–2.4.21의 완전 지원 범위는 Gradle 9.7.0, AGP 9.3.1, Xcode 26.4까지입니다. 요청에 따라 최신 안정 버전을 선택했으며, 아래 빌드 성공은 공급자의 공식 지원 범위가 확대됐다는 뜻은 아닙니다.

## 운영 출시 전 필요한 작업

- 서비스를 등록하고 `.ait`를 업로드해 실제 Android·iOS 토스앱에서 CSP와 리소스 경로를 포함한 호스트 동작을 검증합니다.
- 서버에서 인가 코드 교환·연결 해제 및 계정 정리·인증된 서비스 저장소를 연결합니다. 익명 식별자는 인증 증명이 아닙니다.
- 화면 이동·딥링크·호스트 생명주기를 검증합니다. 독립 웹의 URL·히스토리 연결과 iOS 스와이프 이동은 추가 구현이 필요합니다.
- 지원 기기 조합에서 TalkBack·VoiceOver·큰 글씨·키보드·화면 여백·구형 WebView의 대체 실행을 검증합니다.
- 로딩 시간·전송량·메모리·스크롤 성능을 측정합니다. 결과에 따라 전체 한글 폰트와 번들 크기를 줄입니다.
- 서비스에 TDS 연동이 필요한지 결정합니다. 현재는 포함하지 않으며, 연동하더라도 앱인토스 호스트에 한정해야 합니다.
- Windows 지원을 표시하기 전에 빌드·설치 동작을 검증합니다.
- 위 검증을 마친 뒤 SDK·브리지·생성 CLI를 배포합니다. npm 패키지와 Maven 라이브러리는 아직 배포하지 않았습니다.

mock 로그인이나 정적 패키징 성공은 실제 호스트 인증·검수 승인·스토어 출시 준비 완료를 의미하지 않습니다.


## Yarn 4 전환 검증

Yarn 4.18.1로 저장소의 `install --immutable`과 Node 테스트 26개를 통과했습니다. Yarn으로 템플릿 생성·브리지 압축·생성 CLI 압축을 수행하고, 압축 패키지에서 생성한 앱의 자동 설치가 잠금 파일 수정 없이 통과하는 것을 확인했습니다. 압축 파일에 Yarn 설정·잠금 파일이 포함되고 Gradle Wrapper의 실행 권한이 유지됩니다. 생성 앱을 Android SDK 환경 변수 없이 `yarn build`로 빌드해 JS/Wasm 호환 배포와 공식 `.ait` 패키징도 통과했습니다. Windows 설치 경로는 검증하지 않았습니다.


## JS·Kotlin 린터 검증

ESLint 10.12.0, typescript-eslint 8.71.1, ktlint 1.8.0을 적용했습니다. typescript-eslint 8.71.2는 설치 당시 Yarn의 24시간 패키지 유예 정책에 걸려 직전 안정 버전을 선택했습니다. TypeScript는 해당 린터의 지원 범위에 맞춘 6.0.3입니다.

`yarn lint`로 저장소의 JS·TS와 모든 Kotlin·Gradle 스크립트를 검사했습니다. Android 내장 Kotlin 플러그인 여부와 관계없이 소스 파일을 검사하며, 루트 Gradle `check`에도 Kotlin 검사를 연결했습니다. 기존 위반은 수정했고, Compose 함수명·기존 와일드카드 import를 허용합니다. Kotlin import는 사전순으로 정렬합니다.

미사용 JS 변수와 Kotlin 공백 위반을 임시로 넣어 두 검사 모두 0이 아닌 종료 코드로 실패하는 것을 확인하고 임시 파일을 제거했습니다. Node 테스트 26개, Kotlin 테스트 8개, Android debug 빌드, 앱인토스 JS/Wasm 컴파일이 통과했습니다. 실제 CLI 압축 패키지에서 생성한 앱인토스 전용 앱과 전체 타깃 앱도 첫 `yarn lint`를 통과했습니다. 기본 생성 앱은 Android SDK 환경 변수 없이 검사했습니다. 패키지명 치환 후 import 순서를 유지하는 회귀 검사를 CLI 테스트에 포함했습니다. Windows·기기 실행·iOS 빌드는 이번 린터 작업에서 반복하지 않았습니다.


## GitHub Actions CI

`.github/workflows/ci.yml`은 `main` 푸시와 `main` 대상 PR에서 JS·Kotlin 작업을 병렬 실행합니다. JS는 Node 24·Yarn 4의 immutable 설치 후 린트와 브리지·CLI 테스트를 실행합니다. Kotlin은 JDK 17·저장소의 Gradle Wrapper로 ktlint와 SDK·공통 core JVM 테스트를 실행합니다. Ubuntu 24.04 러너의 Android SDK는 프로젝트 구성에 사용하며, Android·iOS 빌드와 브라우저 테스트는 실행하지 않습니다.

작업 제한 시간, 같은 ref의 중복 실행 취소, 읽기 전용 저장소 권한, 액션 SHA 고정, PR의 Gradle 캐시 읽기 전용 사용을 설정했습니다. Gradle 캐시는 basic 제공자를 사용합니다. 생성 앱에는 JS 린트와 공통 core JVM 테스트에 맞춘 워크플로를 포함합니다.

`actionlint`로 저장소·템플릿·실제 생성 앱 워크플로를 검사했습니다. 로컬에서 CI의 JS 린트·Node 테스트 26개와 Kotlin 린트·JVM 테스트 8개를 확인했고, 압축 CLI에서 `.github/workflows/ci.yml`이 복원되는 것을 확인했습니다. 실제 실행 상태는 저장소의 Actions 탭에서 확인할 수 있습니다.
