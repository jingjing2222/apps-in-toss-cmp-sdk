pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        maven { url = uri("vendor/maven") }
        google()
        mavenCentral()
    }
}
rootProject.name = "__PROJECT_NAME__"
include(":shared-core", ":shared-ui", ":appsInTossApp")
if (file("webApp").isDirectory) include(":webApp")
if (file("androidApp").isDirectory) include(":androidApp")
