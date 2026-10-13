# iOS 메모 앱

[공통 UI](../shared-ui/README.md)의 화면을 SwiftUI 앱에서 표시하는 iOS 호스트입니다. `UIViewControllerRepresentable`로 `SharedUi` 프레임워크의 `MainViewControllerKt.MainViewController()`를 연결합니다.

## iOS 연결

메모 초안을 NSUserDefaults에 저장하고, 공유 버튼은 iOS 공유 시트를 엽니다. iPad에는 팝오버 기준 위치를 지정합니다. 화면 이동은 공통 UI의 목록 복귀 버튼을 사용하며 스와이프 뒤로 가기는 구성하지 않았습니다.

앱 재시작 시 목록을 엽니다. 저장은 메모 ID를 기준으로 하며 계정별 분리·암호화·서버 동기화는 포함하지 않습니다.

## 실행

macOS·Xcode·JDK 17이 필요합니다. [ServiceSample.xcodeproj](ServiceSample.xcodeproj)를 열고 `ServiceSample` 스킴과 arm64 iOS 시뮬레이터를 선택합니다. 실기기에는 서명 팀 설정이 필요합니다.

Xcode의 빌드 단계에서 Gradle로 `SharedUi`를 생성합니다. 최소 iOS 버전은 16.0으로 설정했고 Intel 시뮬레이터는 구성하지 않았습니다. ICU 객체의 빌드 대상과 최소 OS 버전 차이 경고가 있어 iOS 16 실행 지원은 미검증입니다.

Swift 진입점은 [ServiceSampleApp.swift](iosApp/ServiceSampleApp.swift)입니다.
