import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.window.ComposeViewport
import io.github.l2hyunwoo.ait.sample.ServiceApp

@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport(viewportContainerId = "compose-root") { ServiceApp(storage = androidx.compose.runtime.remember { BrowserDraftStorage() }) }
}
