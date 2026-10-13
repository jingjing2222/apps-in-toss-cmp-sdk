import SwiftUI
import SharedUi

@main
struct ServiceSampleApp: App {
    var body: some Scene {
        WindowGroup {
            ServiceView()
                .ignoresSafeArea()
        }
    }
}

struct ServiceView: UIViewControllerRepresentable {
    func makeUIViewController(context: Context) -> UIViewController {
        MainViewControllerKt.MainViewController()
    }

    func updateUIViewController(_ uiViewController: UIViewController, context: Context) {}
}
