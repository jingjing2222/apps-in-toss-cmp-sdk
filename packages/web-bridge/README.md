# Apps in Toss CMP Bridge

`@l2hyunwoo/apps-in-toss-cmp-bridge`는 공식 앱인토스 웹 SDK를 Kotlin SDK의 연결 계약에 맞추는 ESM 어댑터입니다. 로그인·익명 사용자 키·공유·닫기·호스트 이벤트·안전 영역을 연결합니다.

## 진입점

| import 경로 | 동작 |
| --- | --- |
| 패키지 루트 | 공식 SDK를 가져와 `globalThis.aitCmpBridge` 초기화 |
| `/adapter` | `createBridge(sdk)` 팩터리 제공. 공식 SDK를 직접 가져오지 않음 |
| `/mock` | 개발용 모의 SDK로 전역 브리지 초기화 |

기본 연결은 CMP 진입점보다 먼저 실행합니다.

```js
import '@l2hyunwoo/apps-in-toss-cmp-bridge';
```

SDK 객체를 직접 전달하려면 다음처럼 연결합니다.

```js
import * as sdk from '@apps-in-toss/web-framework';
import { createBridge } from '@l2hyunwoo/apps-in-toss-cmp-bridge/adapter';
globalThis.aitCmpBridge = createBridge(sdk);
```

일반 브라우저 개발에서만 `/mock`을 명시적으로 선택합니다. mock 인가 코드로 서버 인증을 수행하거나 운영 번들에 mock을 포함하면 안 됩니다. 실제 호스트가 없을 때 자동으로 mock으로 전환하지 않습니다.

## 호환 계약

공식 웹 SDK peer 범위는 `>=3.0.1 <4.0.0`입니다. peer 설치는 선택 사항이지만 기본 진입점을 사용하면 공식 패키지가 필요합니다. 직접 주입한 객체도 같은 네임스페이스·인자·응답 계약을 제공해야 합니다.

기능 존재와 공식 지원 확인 함수를 검사해 미지원 기능을 `UNSUPPORTED`로 처리합니다. 취소 뒤 결과 전달을 중단하고 이벤트 구독 해제를 제공합니다. 호스트의 처리 자체를 취소하지는 않습니다. API·프로토콜이 바뀌면 어댑터를 수정해야 합니다.

현재 원격 npm에 배포하지 않았으며, 생성 앱은 포함된 npm 압축 파일을 참조합니다. 전체 연결 구조는 [공유 구조](https://github.com/l2hyunwoo/apps-in-toss-cmp-sdk/blob/main/docs/architecture.md)에 설명했습니다.
