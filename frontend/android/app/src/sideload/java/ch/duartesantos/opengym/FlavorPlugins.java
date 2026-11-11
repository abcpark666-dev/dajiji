package ch.duartesantos.opengym;


/** The 大肌肌 APK from this fork's GitHub releases installs its own updates (InstallPlugin). */
final class FlavorPlugins {
    private FlavorPlugins() {}

    static void register(MainActivity activity) {
        activity.registerFlavorPlugin(InstallPlugin.class);
    }
}
