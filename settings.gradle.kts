pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "apps-in-toss-cmp-sdk"
include(":sdk", ":sample:shared-core", ":sample:shared-ui", ":sample:appsInTossApp", ":sample:webApp")
include(":sample:androidApp")
