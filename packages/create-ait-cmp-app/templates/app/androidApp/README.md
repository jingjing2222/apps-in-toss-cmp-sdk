# Android 메모 앱

[공통 UI](../shared-ui/README.md)의 `ServiceApp()`을 Android Activity에서 실행하는 앱입니다. 토스 SDK·TDS·토스 mock을 설치하지 않습니다.

## Android 연결

메모 초안을 SharedPreferences에 저장하고, 공유 버튼은 Android 공유 선택창을 엽니다. 상세 화면의 시스템 뒤로 가기는 목록으로 돌아가며 목록의 뒤로 가기는 Activity 종료 동작을 따릅니다. Activity 재생성 시 선택한 메모를 복원합니다.

저장은 메모 ID를 기준으로 하며 계정별 분리·암호화·서버 동기화는 포함하지 않습니다. 앱 데이터를 삭제하면 저장한 초안도 삭제됩니다.

## 실행

JDK 17과 Android SDK 37을 준비하고 프로젝트 루트에서 빌드합니다.

```sh
./gradlew :androidApp:assembleDebug
```

Android Studio에서 프로젝트 루트를 열고 Android 7.0(API 24) 이상 기기에 실행합니다. 시작점은 [MainActivity](src/main/kotlin/io/github/l2hyunwoo/ait/sample/android/MainActivity.kt)입니다.
