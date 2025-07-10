import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import FirebaseCore // ✅ Add this
import UserNotifications
//import RNCPushNotificationIOS
import react_native_ota_hot_update

@main
@MainActor
class AppDelegate: UIResponder, UIApplicationDelegate, UNUserNotificationCenterDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // ✅ Add this property for background task support
  var taskIdentifier: UIBackgroundTaskIdentifier = .invalid

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
     // ✅ Configure Firebase
    FirebaseApp.configure()

    // ✅ Push Notification Setup
   UNUserNotificationCenter.current().delegate = self
   application.registerForRemoteNotifications()

    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "SeebPartner",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }

   // MARK: - Push Notification Handlers

  // 🔹 Device token registration success
//  func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
//    RNCPushNotificationIOS.didRegisterForRemoteNotifications(withDeviceToken: deviceToken)
//  }

  // 🔹 Device token registration failure
//  func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {
//    RNCPushNotificationIOS.didFailToRegisterForRemoteNotificationsWithError(error)
//  }

  // 🔹 Notification received (background/terminated)
//  func application(_ application: UIApplication,
//                   didReceiveRemoteNotification userInfo: [AnyHashable : Any],
//                   fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
//    RNCPushNotificationIOS.didReceiveRemoteNotification(userInfo, fetchCompletionHandler: completionHandler)
//  }

  // 🔹 Foreground notification
  // nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter,
  //                             willPresent notification: UNNotification,
  //                             withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
  //   completionHandler([.alert, .badge, .sound])
  // }

  // 🔹 User taps on notification
//  nonisolated func userNotificationCenter(_ center: UNUserNotificationCenter,
//                              didReceive response: UNNotificationResponse,
//                              withCompletionHandler completionHandler: @escaping () -> Void) {
//    RNCPushNotificationIOS.didReceive(response)
//    completionHandler()
//  }

  // 🔹 Background task handling
  func applicationWillResignActive(_ application: UIApplication) {
    if taskIdentifier != .invalid {
      application.endBackgroundTask(taskIdentifier)
      taskIdentifier = .invalid
    }

    taskIdentifier = application.beginBackgroundTask(withName: nil) { [weak self] in
      if let strongSelf = self {
        application.endBackgroundTask(strongSelf.taskIdentifier)
        strongSelf.taskIdentifier = .invalid
      }
    }
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return self.bundleURL()
  }

  override func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return OtaHotUpdate.getBundle() ?? Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
