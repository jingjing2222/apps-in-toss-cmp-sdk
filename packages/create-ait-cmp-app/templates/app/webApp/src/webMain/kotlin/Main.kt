import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import __PACKAGE_NAME__.ServiceApp

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "compose-root") { ServiceApp(storage = androidx.compose.runtime.remember { BrowserDraftStorage() }) }
}
