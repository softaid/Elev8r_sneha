// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

sap.ui.define([
  "sap/ui/core/theming/Parameters"
], function (ThemeParameters) {

  "use strict";

  function appendThemeVars (aVars) {
    var mParams = ThemeParameters.get({
      name: aVars,
      callback: function (_params) {
        // this will only be called if params weren’t available synchronously
      }
    });
    if (typeof mParams === "object") {
      for (var n in mParams) {
        document.body.style.setProperty("--" + n, mParams[n]);
      }
    } else if (typeof mParams === "object") {
      document.body.style.setProperty("--" + aVars[0], mParams);
    }
  }
  return appendThemeVars;
});
