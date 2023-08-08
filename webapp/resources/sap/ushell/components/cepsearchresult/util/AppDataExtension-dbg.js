// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

sap.ui.define([
  "sap/ui/integration/Extension",
  "sap/ushell/components/cepsearchresult/util/jsSearch"
], function (Extension, JSSearchFactory) {
  "use strict";
  var AppDataExtension = Extension.extend("sap.ushell.components.cepsearchresult.util.AppDataExtension");

  AppDataExtension.prototype.normalize = function (aApps) {
    if (!Array.isArray(aApps)) {
      aApps = [];
    }
    var aResultApps = [];
    aApps.forEach(function (oApp) {
      oApp.visualizations.forEach(function (oVis) {
        var label = oVis.title;
        if (oVis.subtitle) {
          label = label + " - " + oVis.subtitle;
        }
        aResultApps.push({
          title: oVis.title || "",
          subtitle: oVis.subtitle || "",
          keywords: oVis.keywords ? oVis.keywords.join(" ") : "",
          icon: oVis.icon || "",
          label: label,
          visualization: oVis,
          url: oVis.targetURL
        });
      });
    });
    return aResultApps;
  };

  AppDataExtension.prototype.filter = function (aResult, sSearchTerm, iSkip, iTop) {
    // eslint-disable-next-line new-cap
    this.searchEngine = new JSSearchFactory({
      objects: aResult,
      fields: ["title", "subtitle", "keywords"],
      shouldNormalize: !String.prototype.normalize,
      algorithm: {
        id: "contains-ranked",
        options: [50, 49, 40, 39, 5, 4, 51]
      }
    });
    return this.searchEngine.search({
      searchFor: sSearchTerm,
      top: iTop,
      skip: iSkip
    });
  };

  AppDataExtension.prototype.getData = function (sSearchTerm, iSkip, iTop) {

    var oResult = {
      results: [],
      totalCount: 0
    };

    // embedded in flp
    if (sap.ushell.Container && sap.ushell.Container.getServiceAsync) {
      return sap.ushell.Container.getServiceAsync("SearchableContent")
        .then(function (Service) {
          return Service.getApps()
            .then(function (aResult) {
              aResult = this.normalize(aResult);
              oResult = {
                results: aResult,
                totalCount: aResult.length
              };
              if (sSearchTerm) {
                oResult = this.filter(aResult, sSearchTerm, iSkip, iTop);
              }
              return oResult;
            }.bind(this));
        }.bind(this));
    }
    return Promise.resolve(oResult);
  };

  return AppDataExtension;
});
