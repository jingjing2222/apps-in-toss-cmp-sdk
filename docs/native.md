# Android와 iOS에서 공통 화면 사용하기

Android와 iOS 호스트는 `sample/shared-ui`의 같은 `ServiceApp()` 컴포저블을 호출합니다. 네이티브 UI는 Compose Material 3을 사용하며 앱인토스·Granite·TDS를 불러오지 않습니다.

## Android

JDK 17과 Android SDK 37을 설치한 뒤 저장소 루트에서 실행합니다.

```sh
./gradlew :sample:androidApp:assembleDebug
```

Android Studio에서 루트 프로젝트를 열고 Android 7.0(API 24) 이상 기기에서 `sample:androidApp`을 실행합니다. 시작 Activity는 `io.github.l2hyunwoo.ait.sample.android.MainActivity`입니다.

다른 Compose Activity에 화면을 넣으려면 `:sample:shared-ui` 의존성을 추가하고 다음처럼 호출합니다.

```kotlin
import io.github.l2hyunwoo.ait.sample.ServiceApp

setContent { ServiceApp() }
```

## iOS

Xcode에서 `sample/iosApp/ServiceSample.xcodeproj`를 엽니다. `ServiceSample` 스킴과 arm64 iOS 시뮬레이터를 선택한 뒤 실행합니다. 실기기 빌드에는 Xcode의 서명 팀 설정이 필요합니다. 최소 iOS 버전은 16.0으로 설정했으며, Intel 시뮬레이터는 구성하지 않았습니다. 구형 OS의 실행 검증은 [검증 결과](validation.md)에 기록한 제한을 참고하세요.

Xcode는 Swift를 컴파일하기 전에 Gradle의 `:sample:shared-ui:embedAndSignAppleFrameworkForXcode` 작업을 실행해 정적 `SharedUi` 프레임워크를 빌드하고 연결합니다. Xcode가 JDK 17을 사용할 수 있어야 합니다. 기본 Java 버전이 다르면 빌드 환경에 `JAVA_HOME`을 설정합니다. 최초 빌드에는 Gradle·Kotlin/Native·의존성을 내려받기 위한 네트워크 연결이 필요합니다.

저장소의 Xcode 프로젝트는 `sample/iosApp/project.yml`에서 생성했습니다. 이 파일을 수정한 뒤 다시 생성하려면 실행합니다.

```sh
cd sample/iosApp
xcodegen generate
```

다른 UIKit 앱에 화면을 넣으려면 `SharedUi`를 연결하고 `MainViewControllerKt.MainViewController()`를 표시합니다. SwiftUI에서는 `iosApp/ServiceSampleApp.swift`의 `UIViewControllerRepresentable` 구성을 참고합니다. 예제 프로젝트의 프레임워크 빌드 단계와 검색 경로를 유지해야 합니다.

## 네이티브 동작

Android의 상세 화면에서 시스템 뒤로 가기를 누르면 목록으로 돌아갑니다. Activity를 다시 생성해도 선택한 메모를 복원합니다. 목록에서 시스템 뒤로 가기를 누르면 일반적인 Activity 종료 동작을 따릅니다. iOS에서는 공통 화면의 뒤로 가기 버튼을 사용합니다. 별도의 네이티브 내비게이션 스택이나 스와이프 뒤로 가기는 구성하지 않았습니다.

공통 화면에서 공유를 선택하면 Android 공유 선택창이나 iOS 공유 시트에 일반 텍스트를 전달합니다. iOS 공유 시트는 iPad의 팝오버 기준 위치도 설정합니다. 공유 동작은 사용자가 공유 버튼을 누른 뒤에만 실행합니다.

`저장해요`를 누르면 메모 ID별 초안을 Android의 SharedPreferences 또는 iOS의 NSUserDefaults에 저장합니다. 저장한 초안은 일반적인 앱 재시작 후에도 유지됩니다. 저장하지 않은 수정 내용의 영구 보관은 보장하지 않습니다. 예제는 일반 텍스트를 로컬에 저장하며 암호화·동기화·서버 전송은 하지 않습니다. 앱 데이터를 삭제하면 로컬 초안도 삭제됩니다.

## 지원 범위

두 호스트는 앱인토스 밖에서 공통 예제를 사용하는 방법을 보여줍니다. 네이티브 앱 안에서는 토스 런타임이나 토스 mock 브리지를 실행하지 않습니다. Android는 Activity 재생성 시 현재 상세 화면 선택을 복원하고, iOS는 앱 재시작 시 목록을 엽니다. 계정별 저장·클라우드 동기화·충돌 처리는 제공하지 않습니다.
