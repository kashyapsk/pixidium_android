package com.pyxidium.app;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
//   protected List<ReactPackage> getPackages() {
//  return Arrays.asList(
//    new MainReactPackage(),
//    new ReactNativeFirebaseMessagingPackage(),
//  )
//}
  @Override
  protected String getMainComponentName() {
    return "test";
  }
}
