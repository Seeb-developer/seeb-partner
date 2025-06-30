package com.seebpartner
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultReactNativeHost
import com.otahotupdate.OtaHotUpdate

class CustomReactNativeHost(app: Application) : DefaultReactNativeHost(app) {
  private val application = app

  override fun getUseDeveloperSupport(): Boolean {
    return BuildConfig.DEBUG
  }

  override fun getPackages(): List<ReactPackage> {
    return PackageList(this).packages
  }

  override fun getJSMainModuleName(): String {
    return "index"
  }

  override fun getJSBundleFile(): String {
    return OtaHotUpdate.bundleJS(application)
  }

  // ✅ REMOVE these methods if you see "overrides nothing" error
  // override fun isNewArchEnabled(): Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
  // override fun isHermesEnabled(): Boolean = BuildConfig.IS_HERMES_ENABLED
}
