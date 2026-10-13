package __PACKAGE_NAME__.android

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.Saver
import androidx.compose.runtime.saveable.rememberSaveable
import __PACKAGE_NAME__.DraftStorage
import __PACKAGE_NAME__.ServiceApp
import __PACKAGE_NAME__.ServiceNavigation

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val state = rememberSaveable(
                saver = Saver<ServiceNavigation, List<String>>(
                    save = { listOfNotNull(it.selectedId) },
                    restore = { ServiceNavigation().apply { selectedId = it.firstOrNull() } },
                ),
            ) { ServiceNavigation() }
            val storage = remember {
                PreferencesDraftStorage(getSharedPreferences("drafts", MODE_PRIVATE))
            }
            BackHandler(enabled = state.selectedId != null) { state.back() }
            ServiceApp(state = state, storage = storage, onShare = { text ->
                val send = Intent(Intent.ACTION_SEND).apply {
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, text)
                }
                startActivity(Intent.createChooser(send, "공유"))
            })
        }
    }
}

private class PreferencesDraftStorage(private val preferences: SharedPreferences) : DraftStorage {
    override fun read(id: String): String? = preferences.getString("draft:$id", null)

    override fun write(id: String, body: String) {
        preferences.edit().putString("draft:$id", body).apply()
    }
}
