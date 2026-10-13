# 출시 준비

현재 SDK·CLI는 원격 레지스트리에 배포하지 않았습니다. 예제의 `.ait` 생성과 로컬 바이너리 기반 프로젝트 생성은 확인했으며, 실제 서비스 출시 승인은 별도 절차입니다. 확인한 환경과 미검증 항목은 [검증 결과](validation.md)에 기록했습니다.

## 앱인토스 서비스

1. 콘솔에 서비스를 등록하고 `apps-in-toss.config.ts`의 appName·브랜드·권한·필수 정보를 맞춥니다.
2. 서버의 인가 코드 교환·연결 해제·계정 정리와 인증된 저장소를 연결합니다. 익명 사용자 키는 인증 증명이 아닙니다.
3. `yarn build`로 `.ait`를 생성합니다. 운영 번들에 mock·비밀 키·권한 없는 자산이 없는지 확인합니다.
4. 콘솔에 업로드하고 실제 Android·iOS 토스앱에서 인증·공유·호스트 이벤트·리소스 경로·생명주기를 확인합니다.
5. 지원 기기의 접근성·입력·화면 여백·구형 WebView 대체 실행과 로딩·메모리·스크롤 성능을 확인한 뒤 검수 절차를 진행합니다.

TDS의 기본 포함 여부와 검수 조건은 [TDS 연결](architecture.md#tds-연결)을 참고합니다. 서비스에 TDS가 필요하면 사용 조건을 확인하고 앱인토스 호스트에 한정합니다. 독립 앱·웹에는 재배포 권한이 있는 디자인 자산을 사용합니다. 도구는 콘솔 등록·업로드·검수·운영 서버 연결을 자동으로 수행하지 않습니다.

## SDK·CLI 패키지

패키지의 버전·의존성 좌표·지원 범위를 정하고, [개발 가이드](development.md)에 따라 검사와 템플릿 갱신을 수행합니다. 생성된 npm 압축 패키지에 Wrapper·잠금 파일·워크플로·문서·라이선스가 포함되는지 확인합니다.

기본·전체 타깃 생성 앱에서 설치·린트·테스트·빌드가 통과해야 합니다. Windows 등 미검증 플랫폼을 지원 범위에 추가하려면 해당 환경에서 확인합니다. 공식 웹 SDK 호환 범위와 Kotlin 도구 조합의 제한도 함께 공개합니다.

로컬 개발 템플릿은 JS 리소스를 포함한 로컬 Maven 바이너리를 참조합니다. 정식 npm 배포물은 같은 버전의 Maven Central 좌표를 사용합니다. 아래 CD 설정은 실제 패키지 게시 완료를 의미하지 않습니다.

## 배포 대상

| 레지스트리 | 패키지·좌표 | 배포 내용 |
| --- | --- | --- |
| npm | `create-ait-cmp-app` | 대화형 CLI와 프로젝트 템플릿. 정식 배포물에는 `vendor/`를 포함하지 않음 |
| Maven Central | `io.github.l2hyunwoo:apps-in-toss-sdk` | KMP 공통 메타데이터와 `web-resources` classifier의 내부 JS 브리지 |
| Maven Central | `io.github.l2hyunwoo:apps-in-toss-sdk-js` | Kotlin/JS 산출물 |
| Maven Central | `io.github.l2hyunwoo:apps-in-toss-sdk-wasmjs` | Kotlin/Wasm 산출물 |
| Maven Central | `io.github.l2hyunwoo:apps-in-toss-sdk-jvm` | KMP의 JVM 산출물. JVM은 계약 테스트용이며 토스 호스트 API를 제공하지 않음 |

Maven publication은 소스·Javadoc JAR와 POM·Gradle 메타데이터를 함께 배포하고 서명합니다. 브리지는 독립 npm 패키지로 배포하지 않습니다. 저장소 루트와 예제 앱·공통 core·공통 UI도 이번 배포 대상에서 제외합니다.

## GitHub Actions CD

[Package release](../.github/workflows/release.yml)는 다음처럼 동작합니다.

- 배포 관련 변경의 main 대상 PR: 배포물 생성·검사만 실행합니다.
- 수동 실행: 입력한 `0.1.0` 형태의 정식 버전으로 검사하고 npm·Maven 압축 파일을 보관합니다. 업로드하지 않습니다.
- `v0.1.0` 형태의 태그 푸시: 태그 커밋이 main 이력에 포함되는지 검사한 뒤 Maven Central, npm 순서로 게시합니다.

두 패키지는 태그에서 같은 버전을 사용합니다. prerelease와 SNAPSHOT의 원격 배포는 구성하지 않았습니다. main 일반 푸시에는 기존 CI만 실행됩니다. 배포 도중 새 태그가 들어와도 진행 중 배포를 취소하지 않습니다.

배포물 검사는 린트·테스트, Maven POM 필수 필드·소스·Javadoc·브리지 파일, CLI 압축·프로젝트 생성·immutable 설치·리소스 연결을 확인합니다. 공개 전 SDK는 검사 전용 로컬 저장소로 연결합니다. 실제 npm 배포물에는 이 저장소를 넣지 않습니다.

Maven 게시 후 모든 타깃의 POM·Gradle 메타데이터·바이너리와 브리지 파일을 내려받을 수 있는지 확인해야 npm을 게시합니다. [Central 안내](https://vanniktech.github.io/gradle-maven-publish-plugin/central/)에 따르면 공개 반영에 10~30분이 걸릴 수 있습니다. npm 단계만 실패했다면 같은 실행을 다시 실행할 수 있습니다. 이미 공개된 Maven 버전과 npm 버전은 재게시하지 않습니다. Central에서 아직 처리 중이라면 처리가 끝난 뒤 재실행합니다. 같은 버전의 내용을 바꾸려면 새 버전을 사용합니다.

## 최초 설정

Maven은 [Central Portal](https://central.sonatype.com/)에서 `io.github.l2hyunwoo` 네임스페이스를 등록·검증하고, 게시용 user token과 PGP 키를 준비합니다. 공개 키 배포 등 [Central 요구사항](https://central.sonatype.org/publish/requirements/)도 충족해야 합니다.

GitHub 저장소의 Actions secrets를 설정합니다.

| Secret | 값 |
| --- | --- |
| `MAVEN_CENTRAL_USERNAME` | Portal에서 발급한 게시 토큰의 username |
| `MAVEN_CENTRAL_PASSWORD` | 같은 게시 토큰의 password. Portal 로그인 비밀번호와 다름 |
| `SIGNING_IN_MEMORY_KEY` | ASCII-armored PGP 비밀 키 전체 |
| `SIGNING_IN_MEMORY_KEY_PASSWORD` | 키 암호. 암호 없는 키라면 생략 가능 |
| `NPM_TOKEN` | npm 최초 패키지 생성에 사용할 게시 토큰. Trusted Publisher 설정 후 제거 |

npm 패키지 이름 `create-ait-cmp-app`의 게시 권한을 확보해야 합니다. [Trusted Publishing 설정](https://docs.npmjs.com/trusted-publishers/)에는 기존 패키지가 필요하므로, 첫 게시는 허용된 토큰을 `NPM_TOKEN`에 넣거나 로컬 로그인·2FA로 진행합니다. 토큰은 CI 게시에 필요한 권한과 2FA 조건을 충족해야 합니다.

첫 게시 후 npm 패키지 설정에서 GitHub Actions Trusted Publisher를 등록합니다.

| 항목 | 값 |
| --- | --- |
| Organization or user | `l2hyunwoo` |
| Repository | `apps-in-toss-cmp-sdk` |
| Workflow filename | `release.yml` |
| Environment | 비워 둠. 현재 워크플로에 environment를 지정하지 않음 |

설정 후 `NPM_TOKEN`을 제거하면 Yarn 4.18.1이 OIDC로 인증합니다. private GitHub 저장소도 Trusted Publishing을 사용할 수 있지만 provenance는 생성되지 않으므로 현재 게시 명령에서 비활성화했습니다. 실제 게시 토큰·서명 키·Trusted Publisher 등록은 워크플로 추가와 별도로 설정해야 합니다.

## 로컬에서 배포물 검사

Node 24·Yarn 4·JDK 17 환경에서 실행합니다.

```sh
yarn release:prepare 0.1.0
```

`build/create-ait-cmp-app-0.1.0.tgz`와 `build/template-maven`에 배포물을 만듭니다. 업로드·서명은 하지 않습니다. CLI manifest의 버전은 압축하는 동안만 바꾸고 복원하지만 템플릿은 정식 버전용으로 갱신됩니다. 로컬 개발 템플릿으로 돌아가려면 `yarn template`을 실행합니다.

로컬 개발 템플릿에는 미배포 SDK를 사용하는 `vendor/maven`을 유지합니다. 정식 npm 배포 템플릿은 같은 버전의 원격 Maven 좌표를 사용합니다. 생성 앱 자체에는 Central 게시 토큰이나 서명 키가 필요하지 않습니다.
