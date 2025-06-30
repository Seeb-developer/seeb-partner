import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import react_native_ota_hot_update

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?
  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  // ✅ Add this property for background task support
  var taskIdentifier: UIBackgroundTaskIdentifier = .invalid

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
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

  // ✅ Correct placement: this must be inside AppDelegate class
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
