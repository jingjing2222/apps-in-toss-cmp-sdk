# 공유 코드와 호스트의 경계

호스트는 공통 UI에 의존하고, 공통 UI는 서비스 로직의 계약에 의존합니다. 공통 UI는 토스 SDK를 가져오지 않습니다. 공통 core는 Compose·토스·TDS·브라우저 타입을 가져오지 않습니다.

토스 전용 화면은 앱인토스 호스트에 둡니다. 공통 화면은 서비스가 소유한 테마와 플랫폼에 종속되지 않는 상태를 사용합니다. 로그인·공유·저장·화면 이동 동작은 콜백으로 주입합니다. 네이티브 앱과 독립 웹은 개별 화면이나 API 클라이언트만 재사용할 수 있습니다.

현재 Kotlin SDK는 JS·Wasm을 대상으로 하며, 계약 테스트를 위한 JVM 타깃도 제공합니다. 네이티브 호스트에는 토스 SDK를 설치하지 않습니다. 공개 통신 계약은 JSON 문자열을 사용하므로 Promise 객체와 JavaScript 타입이 공통 Kotlin 코드로 넘어가지 않습니다. 클라이언트는 UI 스레드에서만 사용하고, 호스트가 해제될 때 각 클라이언트의 `close()`를 호출해야 합니다.

익명 사용자 키는 식별자이며 인증 증명이 아닙니다. 서비스는 접근 권한을 부여하기 전에 백엔드에서 사용자 신원을 확인해야 합니다. `USER_ID` 지원 여부는 공식 SDK의 버전별 지원 확인 기능으로 검사합니다.

로그인은 한 번에 하나의 요청만 처리합니다. 제한 시간은 60초이며, 응답 타입을 검증하고 취소 시 연결을 정리합니다. 취소하거나 제한 시간을 넘으면 이후 결과를 받지 않지만, 호스트의 로그인 창을 닫지는 않습니다. 인식하지 못한 공식 SDK 오류 코드는 `SDK_FAILURE`로 반환합니다. 토큰·인가 코드·원본 호스트 오류·개인정보는 로그에 남기지 않습니다.

호스트 이벤트는 공식 뒤로 가기·홈 이벤트와 `SafeArea` 초기값·변경 구독을 사용합니다. 독립 웹은 별도 진입점을 사용하며 토스 브리지를 초기화하지 않습니다. 개발용 모의 구현(mock)은 명시적으로 선택하고 운영 배포물에서는 제외합니다. mock에서 성공한 흐름으로 실제 WebView 지원을 판단해서는 안 됩니다.

TDS 연동은 구현하지 않았습니다. 서비스에 필요하다면 React/DOM 연결과 사용 권한이 있는 에셋을 앱인토스 호스트에 한정합니다. 화면 구현이 달라져도 서비스 상태와 동작은 공유할 수 있습니다. 독립 호스트에는 재배포 권한이 있는 에셋을 사용해야 합니다.

공식 근거: [웹 SDK](https://www.npmjs.com/package/@apps-in-toss/web-framework/v/3.8.0), [프로젝트 생성 도구](https://github.com/toss/create-ait-app), [UI/UX 가이드](https://developers-apps-in-toss.toss.im/design/consumer-ux-guide.md), [TDS 사용 조건](https://developers-apps-in-toss.toss.im/design/components.md).


## 공식 웹 SDK 버전과의 관계

Kotlin SDK는 자체 JSON 브리지 계약만 사용합니다. 공식 웹 SDK를 업데이트해도 이 계약이 유지되면 Kotlin 라이브러리를 다시 빌드할 필요가 없습니다. 기본 연결 진입점은 공식 패키지를 가져오고, `adapter` 진입점은 호출자가 SDK 객체를 주입받습니다. 후자는 공식 패키지를 직접 import하지 않으며 peer 설치도 선택 사항입니다.

```js
import * as sdk from '@apps-in-toss/web-framework';
import { createBridge } from '@l2hyunwoo/apps-in-toss-cmp-bridge/adapter';
globalThis.aitCmpBridge = createBridge(sdk);
```

기본 어댑터의 peer 범위는 `>=3.0.1 <4.0.0`입니다. 3.0.1과 3.8.0에서 사용하는 공개 함수의 존재를 자동 검사하고, 부분 SDK에서 빠진 기능과 명시적으로 지원하지 않는 기능을 `UNSUPPORTED`로 처리합니다. 이는 실제 토스앱의 모든 기능이나 범위 내 모든 중간 버전을 검증했다는 뜻은 아닙니다. 예제와 생성 앱의 3.8.0 고정은 실행 환경을 재현하기 위한 선택이며 Kotlin SDK의 의존성 제약이 아닙니다.

공식 SDK의 함수 이름·인자·응답 또는 호스트 프로토콜이 바뀌면 JS 어댑터를 수정해야 합니다. 향후 모든 버전과의 무조건적인 호환은 보장할 수 없습니다. 다른 메이저 버전은 호환 여부를 확인한 뒤 지원 범위를 넓히거나, 같은 브리지 계약을 제공하는 별도 어댑터를 주입합니다. 기능 존재 검사만으로 응답 의미의 변경까지 감지할 수는 없습니다.


## JavaScript 개발 도구

저장소와 생성 앱은 `packageManager: yarn@4.18.1`, `yarn.lock`, `.yarnrc.yml`을 사용합니다. 기존 번들 스크립트가 `node_modules` 경로를 사용하므로 `nodeLinker: node-modules`를 선택했습니다. CLI는 Corepack으로 프로젝트의 Yarn 버전을 선택해 `yarn install --immutable`을 실행합니다. Kotlin/JS·Wasm 빌드가 내부적으로 내려받는 패키지 관리 도구는 Gradle 플러그인이 관리하며, 프로젝트 루트의 Yarn 4 설정과 별개입니다.
