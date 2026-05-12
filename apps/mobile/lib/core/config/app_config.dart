/// Application-wide configuration constants.
/// Values read from dart-define or environment at build time.
class AppConfig {
  AppConfig._();

  static String apiBaseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:5000/api', // Android emulator → host localhost
  );

  static String wsUrl = const String.fromEnvironment(
    'WS_URL',
    defaultValue: 'http://10.0.2.2:5000',
  );

  static String appName = 'RakshaAI';
  static String appVersion = '1.0.0';

  /// Called in main() before runApp to perform async setup.
  static Future<void> initialize() async {
    // Phase 2+ will initialize: Firebase, secure storage, etc.
    // Kept minimal for Phase 1.
  }
}
