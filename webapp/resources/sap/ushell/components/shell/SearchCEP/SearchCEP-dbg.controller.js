// Copyright (c) 2009-2022 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ushell/components/shell/SearchCEP/SearchProviders/SearchProvider",
    "sap/ushell/components/shell/SearchCEP/SearchProviders/NavigationSvcSearchProvider",
    "sap/ushell/components/shell/SearchCEP/SearchProviders/RecentAppsProvider",
    "sap/ushell/components/shell/SearchCEP/SearchProviders/RecentSearchProvider",
    "sap/base/Log",
    "sap/ushell/utils/WindowUtils",
    "sap/ui/thirdparty/jquery",
    "sap/ushell/resources",
    "sap/ushell/utils/UrlParsing",
    "sap/ui/Device",
    "sap/ui/core/Configuration",
    "sap/base/util/UriParameters"
], function (
    Controller,
    JSONModel,
    Fragment,
    SearchProvider,
    NavigationSvcSearchProvider,
    RecentAppsProvider,
    RecentSearchProvider,
    Log,
    WindowUtils,
    jQuery,
    resources,
    UrlParsing,
    Device,
    Configuration,
    UriParameters
) {
    "use strict";
    return Controller.extend("sap.ushell.components.shell.SearchCEP.SearchCEP", {

        onInit: function () {
            this._toggleSearchPopover(false);
            this._oPlaceHolderSF = sap.ui.getCore().byId("PlaceHolderSearchField");
            this._bIsMyHome = false;
            var sPlatform = sap.ushell.Container.getFLPPlatform(true),
                urlParams = new UriParameters(document.URL);
            this._bOnInit = true;
            this.bNavigateToNewResultPage = urlParams.get("cep-search-result-app") === "true";
            if (sPlatform === "MYHOME") {
                this._bIsMyHome = true;
            }
        },

        onSuggest: function (event) {
            var sUrl = sap.ushell.Container.getFLPUrl(true);
            var sHash = UrlParsing.getHash(sUrl),
                sIntent = sHash.split("&/")[0];

            if (this.bOnNavigationToResultPage === true && (sIntent === "Action-search" || sIntent === "WorkZoneSearchResult-display")) {
                if (this._oPopover.isOpen()) {
                    this._oPopover.close();
                }
                return;
            }
            this.bOnNavigationToResultPage = false;
            var sValue = event.getParameter("suggestValue");
            this.oSF.focus();
            if (this._recentSearchTermSelected === true) {
                this._recentSearchTermSelected = false;
                return;
            }
            if (this.bOpeningPopOver === true && this._oPopover.isOpen() ===  true) {
                this.bOpeningPopOver = false;
                return;
            }
            this.testProviders(sValue);
        },

        getScreenSize: function () {
            var oScreenSize = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD_EXTENDED);
            if (oScreenSize.from >= 1440) {
                return "XL";
            } else if (oScreenSize.from >= 1024) {
                return "L";
            } else if (oScreenSize.from >= 600) {
                return "M";
            } else if (oScreenSize.from >= 0) {
                return "S";
            }
        },

        onSearch: function (event) {
            var sSearchTerm = event.getParameter("query"),
                bClearButtonPressed = event.getParameter("clearButtonPressed");
            if (bClearButtonPressed === true) {
                this.oSF.setValue("");
                this._oPlaceHolderSF.setValue("");
                this.bOpeningPopOver = false;
                this.testProviders();
                if (this._oSearchHistoryList.getItems().length === 0 && this._oFrequentlyUsedAppsList.getItems().length === 0) {
                    this._oPopover.close();
                }
                return;
            }
            if (sSearchTerm) {
                this._saveSearchTerm(sSearchTerm);
                if (this._bIsMyHome === true) {
                    if (this._oSearchResultList.getItems().length > 0) {
                        this._oSearchResultList.getItems()[0].focus();
                        if (this._bIsMyHome === true) {
                            var url = this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().url;
                            if (url !== undefined && url !== null) {
                                this._navigateURL(url);
                                return;
                            }
                        }
                        var semanticObject = this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().semanticObject;
                        var action = this._oSearchResultList.getItems()[0].getBindingContext("searchResults").getObject().semanticObjectAction;
                        this._navigateApp(semanticObject, action);
                    }
                } else {
                    this._navigateToResultPage(sSearchTerm);
                }
            }
        },

        onBeforeOpen: function () {
            this._oPopover.addStyleClass("sapUshellCEPSearchFieldPopover");
            var sSearchState = sap.ui.getCore().byId("shell-header").getSearchState();
            var bCollapse = false;
            if (sSearchState === "COL") {
                bCollapse = true;
            }
            sap.ui.getCore().byId("shell-header").setSearchState("EXP", 35, false); // intermediate state to force shell to show overlay
            sap.ui.getCore().byId("shell-header").setSearchState("EXP_S", 35, true);
            if (bCollapse === true) {
                sap.ui.getCore().byId("shell-header").setSearchState("COL", 35, false);
            }
        },

        onAfterOpen: function () {
            if (sap.ui.getCore().byId("SearchHistoryList-trigger")) {
                sap.ui.getCore().byId("SearchHistoryList-trigger").addEventDelegate({
                    onkeydown: this._keyDownSearchHistoryListMoreTrigger.bind(this),
                    onmousedown: this._mouseDownSearchHistoryListMoreTrigger.bind(this)
                });
            }
            if (sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger")) {
                sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger").addEventDelegate({
                    onkeydown: this._keyDownFrequentlyUsedAppsListMoreTrigger.bind(this)
                });
            }
            var nPlaceHolderSFHeight = document.getElementById("PlaceHolderSearchField").clientHeight;
            document.getElementById("CEPSearchField").style.height = nPlaceHolderSFHeight + "px";
        },

        onAfterClose: function () {
            this._oPlaceHolderSF.setValue(this.oSF.getValue());
            var sScreenSize = this.getScreenSize();
            if (sScreenSize !== "XL" && this.oSF.getValue() === "") {
                sap.ui.getCore().byId("shell-header").setSearchState("COL", 35, false);
                sap.ui.getCore().byId("sf").setVisible();
            } else {
                sap.ui.getCore().byId("shell-header").setSearchState("EXP", 35, false); // intermediate state to force shell to disable overlay
                sap.ui.getCore().byId("shell-header").setSearchState("EXP_S", 35, false);
            }
        },

        onGrowingStarted: function (event) {
            var nActualItems = event.getParameter("actual");
            if (nActualItems > 0) {
                this._oSearchHistoryList.setGrowingThreshold(8);
            }
        },

        onGrowingFinishedResults: function () {
            this._boldResults(this.oSF.getValue());
        },

        onExit: function () {
        },

        testProviders: function (sQuery) {
            var arrProviders,
                idx,
                that = this,
                bIsSearch = false,
                bRecentActivity = false;
            if (sQuery !== undefined && sQuery !== "") {
                this._setListsVisible(false, this._oSearchHistoryList);
                this._setListsVisible(false, this._oFrequentlyUsedAppsList);
                arrProviders = [NavigationSvcSearchProvider];
                bIsSearch = true;
            } else {
                this._setListsVisible(false, this._oSearchResultList);
                this._setListsVisible(false, this._oExternalSearchResultList);
                if (this._bOnInit !== true) {
                    arrProviders = [RecentAppsProvider, RecentSearchProvider];
                } else {
                    arrProviders = [NavigationSvcSearchProvider, RecentAppsProvider, RecentSearchProvider];
                    this._bOnInit = false;
                }
            }
            for (idx = 0; idx < arrProviders.length; idx++) {
                (function (oProvider) {
                    oProvider.execSearch(sQuery).then(function (oResult) {
                        for (var groupId in SearchProvider.GROUP_TYPE) {
                            var sGroupName = SearchProvider.GROUP_TYPE[groupId];
                            if (Array.isArray(oResult[sGroupName]) && oResult[sGroupName].length > 0) {
                                if (sGroupName === "recentSearches") {
                                    bRecentActivity = true;
                                    that._setListsVisible(true, that._oSearchHistoryList);
                                    that._oSearchHistoryList.setGrowingThreshold(2);
                                    that._oSearchHistoryList.setModel(new JSONModel(oResult[sGroupName].slice(0, 10)), "searchTerms");
                                } else if (sGroupName === "recentApplications") {
                                    bRecentActivity = true;
                                    that._setListsVisible(true, that._oFrequentlyUsedAppsList);
                                    that._oFrequentlyUsedAppsList.setModel(new JSONModel(oResult[sGroupName].slice(0, 12)), "freqUsedApps");
                                } else if (bIsSearch === true && sGroupName === "applications") {
                                    that._setListsVisible(true, that._oSearchResultList);
                                    that._oSearchResultList.setModel(new JSONModel(oResult[sGroupName]), "searchResults");
                                    that._applyResultsAcc(oResult[sGroupName].length);
                                    window.setTimeout(function () {
                                        that._boldResults(sQuery);
                                        if (sap.ui.getCore().byId("SearchResultList-trigger")) {
                                            sap.ui.getCore().byId("SearchResultList-trigger").addEventDelegate({
                                                onkeydown: that._keyDownSearchResultListMoreTrigger.bind(that)
                                            });
                                        }
                                    }, 50);
                                } else if (bIsSearch === true && sGroupName === "externalSearchApplications") {
                                    that._setListsVisible(true, that._oExternalSearchResultList);
                                    that._oExternalSearchResultList.setModel(new JSONModel(oResult[sGroupName]), "externalSearchResults");
                                }
                                if (!that._oPopover.isOpen() && (bRecentActivity === true || bIsSearch === true)) {
                                    that._toggleSearchPopover(true);
                                }
                                that.oSF.focus();
                            } else if (bIsSearch === true && sGroupName === "applications") {
                                if (!oResult[sGroupName] || oResult[sGroupName].length === 0) {
                                    that._setListsVisible(true, that._oSearchResultList);
                                    that._oSearchResultList.setModel(new JSONModel({}), "searchResults");
                                    that._applyResultsAcc(0);
                                    var sNoResults = resources.i18n.getText("no_apps_found", [sQuery]);
                                    that._oSearchResultList.setNoDataText(sNoResults);
                                    if (!that._oPopover.isOpen()) {
                                        that._toggleSearchPopover(true);
                                    }
                                }
                            }
                        }
                    });
                })(arrProviders[idx]);
            }
        },

        _applyResultsAcc: function (iNumOfItems) {
            var sAriaText = "";
            // add items to list
            if (iNumOfItems === 1) {
                sAriaText = resources.i18n.getText("one_result_search_aria", iNumOfItems);
            } else if (iNumOfItems > 1) {
                sAriaText = resources.i18n.getText("multiple_results_search_aria", iNumOfItems);
            } else {
                sAriaText = resources.i18n.getText("no_results_search_aria");
            }
            // update Accessibility text for suggestion
            this.oSF.$("SuggDescr").text(sAriaText);
        },

        _boldResults: function (sQuery) {
            var oList = this._oSearchResultList,
                oItems = oList.getItems(),
                inputText = oList.$().find(".sapMSLITitleOnly");
            jQuery.each(inputText, function (i) {
                var sTitle = oItems[i].getTitle(),
                    reg = new RegExp(sQuery, 'gi');
                var sBoldTitle = sTitle;
                sBoldTitle = sBoldTitle.replace(reg, function (str) {
                    return '</b>' + str + '<b>';
                });
                sBoldTitle = '<b>' + sBoldTitle + '</b>';
                inputText[i].innerHTML = sBoldTitle;
            });
        },

        _toggleSearchPopover: function (bOpen) {
            if (!this._oPopover) {
                Fragment.load({
                    name: "sap.ushell.components.shell.SearchCEP.SearchFieldFragment",
                    type: "XML",
                    controller: this
                }).then(function (popover) {
                    this._oPopover = popover;
                    var sScreenSize = this.getScreenSize();
                    var nPlaceHolderSFWidth = document.getElementById("PlaceHolderSearchField").clientWidth;
                    if (sScreenSize === "S") {
                        nPlaceHolderSFWidth = 1.1 * nPlaceHolderSFWidth;
                    } else {
                        nPlaceHolderSFWidth = 1.05 * nPlaceHolderSFWidth;
                    }
                    this._oPopover.setContentWidth(nPlaceHolderSFWidth + "px");
                    if (Configuration.getRTL() === true) {
                        var nOffsetX = this._oPopover.getOffsetX();
                        this._oPopover.setOffsetX(-1 * nOffsetX);
                    }
                    this._initializeSearchField();
                    this._initializeSearchHistoryList();
                    this._initializeFrequentlyUsedAppsList();
                    this._initializeSearchResultList();
                    this._initializeExternalSearchResultList();
                    this.testProviders();
                    this._toggleSearchPopover(bOpen);
                }.bind(this));
            } else if (bOpen) {
                this._oPopover.openBy(this._oPlaceHolderSF);
                this.bOpeningPopOver = true;
                if (this._oPlaceHolderSF.getValue() !== "") {
                    this.oSF.setValue(this._oPlaceHolderSF.getValue());
                }
            }
        },

        _keyDownSearchField: function (event) {
            if (event.code === 40 || event.code === "ArrowDown") {
                this.oSF.focus();
                if (!this._oPopover.isOpen()) {
                    this._toggleSearchPopover(true);
                }
                if (this._oSearchHistoryList.getVisible() === true && this._oSearchHistoryList.getItems().length > 0) {
                    this._oSearchHistoryList.getItems()[0].focus();
                } else if (this._oFrequentlyUsedAppsList.getVisible() === true && this._oFrequentlyUsedAppsList.getItems().length > 0) {
                    this._oFrequentlyUsedAppsList.getItems()[0].focus();
                } else if (this._oSearchResultList.getVisible() === true && this._oSearchResultList.getItems().length > 0) {
                    this._oSearchResultList.getItems()[0].focus();
                } else if (this._oExternalSearchResultList.getVisible() === true && this._oExternalSearchResultList.getItems().length > 0) {
                    this._oExternalSearchResultList.getItems()[0].focus();
                }
            } else if (event.code === 116 || event.code === "F5") {
                window.location.reload();
            } else if (event.code === 9 || event.code === "Tab") {
                var element;
                if (event.shiftKey) {
                    element = this._oPlaceHolderSF.oParent.getDomRef().firstChild.firstChild;
                } else {
                    element = this._oPlaceHolderSF.oParent.getDomRef().lastChild.firstChild;
                    if (element && getComputedStyle(element).display === "none") {
                        element = this._oPlaceHolderSF.oParent.getDomRef().lastChild.firstChild.nextSibling;
                    }
                }
                window.setTimeout(function () {
                    if (this.getScreenSize() === "S" || this.getScreenSize() === "M") {
                        sap.ui.getCore().byId("shell-header").setSearchState("COL", 35, false);
                        sap.ui.getCore().byId("sf").setVisible(true);
                    }
                    if (element !== null) {
                        element.focus();
                    }
                }.bind(this), 0);
            }
        },

        _keyDownSearchHistoryList: function (event) {
            var nNumOfItems = this._oSearchHistoryList.getItems().length;
            if (event.code === 40 || event.code === "ArrowDown") {
                if (nNumOfItems > 0 && this._oSearchHistoryList.getItems()[nNumOfItems - 1] === event.srcControl) {
                    var searchHistoryStyle = window.getComputedStyle(document.getElementById("SearchHistoryList-triggerList"), "");
                    if (searchHistoryStyle.display === "none") {
                        if (this._oFrequentlyUsedAppsList.getVisible() && this._oFrequentlyUsedAppsList.getItems().length > 0) {
                            this._oFrequentlyUsedAppsList.getItems()[0].focus();
                        }
                    } else {
                        sap.ui.getCore().byId("SearchHistoryList-trigger").focus();
                    }
                }
            } else if (event.code === 38 || event.code === "ArrowUp") {
                if (nNumOfItems > 0 && this._oSearchHistoryList.getItems()[0] === event.srcControl) {
                    this.oSF.focus();
                }
            }
        },

        _keyDownFrequentlyUsedAppsList: function (event) {
            var style,
                nNumOfItems = this._oFrequentlyUsedAppsList.getItems().length;
            if (event.code === 40 || event.code === "ArrowDown") {
                if (nNumOfItems > 0 && this._oFrequentlyUsedAppsList.getItems()[nNumOfItems - 1] === event.srcControl) {
                    style = window.getComputedStyle(document.getElementById("FrequentlyUsedAppsList-triggerList"), "");
                    if (style.display !== "none") {
                        sap.ui.getCore().byId("FrequentlyUsedAppsList-trigger").focus();
                    }
                }
            } else if (event.code === 38 || event.code === "ArrowUp") {
                if (nNumOfItems > 0 && this._oFrequentlyUsedAppsList.getItems()[0] === event.srcControl) {
                    var nNumOfItemsHistoryList = this._oSearchHistoryList.getItems().length;
                    if (this._oSearchHistoryList.getVisible() && nNumOfItemsHistoryList > 0) {
                        style = window.getComputedStyle(document.getElementById("SearchHistoryList-triggerList"), "");
                        if (style.display === "none") {
                            if (nNumOfItemsHistoryList > 0) {
                                this._oSearchHistoryList.getItems()[nNumOfItemsHistoryList-1].focus();
                            }
                        } else {
                            sap.ui.getCore().byId("SearchHistoryList-trigger").focus();
                        }
                    } else {
                        this.oSF.focus();
                    }
                }
            } else if (event.code === 13 || event.code === "Enter") {
                var sAppId = event.srcControl.getBindingContext("freqUsedApps").getObject().appId;
                var sSemanticObj = sAppId.split("-")[0];
                sSemanticObj = sSemanticObj.split("#")[1];
                var sAction = sAppId.split("-")[1];
                this._navigateApp(sSemanticObj, sAction);
            }
        },

        _keyDownSearchHistoryListMoreTrigger: function (event) {
            if (event.code === 40 || event.code === "ArrowDown") {
                if (this._oFrequentlyUsedAppsList.getVisible() && this._oFrequentlyUsedAppsList.getItems().length > 0) {
                    this._oFrequentlyUsedAppsList.getItems()[0].focus();
                }
            } else if (event.code === 38 || event.code === "ArrowUp") {
                var numOfItems = this._oSearchHistoryList.getItems().length;
                if (numOfItems > 0) {
                    this._oSearchHistoryList.getItems()[numOfItems-1].focus();
                }
            } else if (event.code === 13 || event.code === "Enter") {
                this._oSearchHistoryList.setGrowingThreshold(8);
            }
        },

        _mouseDownSearchHistoryListMoreTrigger: function (event) {
            this._oSearchHistoryList.setGrowingThreshold(8);
        },

        _keyDownFrequentlyUsedAppsListMoreTrigger: function (event) {
            if (event.code === 38 || event.code === "ArrowUp") {
                var nNumOfItems = this._oFrequentlyUsedAppsList.getItems().length;
                if (nNumOfItems > 0) {
                    this._oFrequentlyUsedAppsList.getItems()[nNumOfItems - 1].focus();
                }
            }
        },

        _keyDownSearchResultListMoreTrigger: function (event) {
            if (event.code === 38 || event.code === "ArrowUp") {
                var nNumOfItems = this._oSearchResultList.getItems().length;
                if (nNumOfItems > 0) {
                    this._oSearchResultList.getItems()[nNumOfItems - 1].focus();
                }
            } else if (event.code === 40 || event.code === "ArrowDown") {
                if (this._oExternalSearchResultList.getVisible() && this._oExternalSearchResultList.getItems().length > 0) {
                    this._oExternalSearchResultList.getItems()[0].focus();
                }
            }
        },

        _keyDownSearchResultList: function (event) {
            var nNumOfItems = this._oSearchResultList.getItems().length;
            if (event.code === 40 || event.code === "ArrowDown") {
                if (nNumOfItems > 0 && this._oSearchResultList.getItems()[nNumOfItems - 1] === event.srcControl) {
                    var style = window.getComputedStyle(document.getElementById("SearchResultList-triggerList"), "");
                    if (style.display !== "none") {
                        sap.ui.getCore().byId("SearchResultList-trigger").focus();
                    } else if (this._oExternalSearchResultList.getVisible() && this._oExternalSearchResultList.getItems().length > 0) {
                        this._oExternalSearchResultList.getItems()[0].focus();
                    }
                }
            } else if (event.code === 38 || event.code === "ArrowUp") {
                if (nNumOfItems > 0 && this._oSearchResultList.getItems()[0] === event.srcControl) {
                    this.oSF.focus();
                }
            }
        },

        _keyDownExternalSearchResultList: function (event) {
            var nNumOfItemsExternal = this._oExternalSearchResultList.getItems().length;
            if (event.code === 38 || event.code === "ArrowUp") {
                if (nNumOfItemsExternal > 0 && this._oExternalSearchResultList.getItems()[0] === event.srcControl) {
                    var nNumOfItemsResultList = this._oSearchResultList.getItems().length;
                    if (this._oSearchResultList.getVisible() && nNumOfItemsResultList > 0) {
                        var style = window.getComputedStyle(document.getElementById("SearchResultList-triggerList"), "");
                        if (style.display === "none") {
                            this._oSearchResultList.getItems()[nNumOfItemsResultList - 1].focus();
                        } else {
                            sap.ui.getCore().byId("SearchResultList-trigger").focus();
                        }
                    } else {
                        this.oSF.focus();
                    }
                }
            }
        },

        _initializeSearchField: function () {
            this.oSF = sap.ui.getCore().byId("CEPSearchField");
            var nPlaceHolderSFWidth = document.getElementById("PlaceHolderSearchField").clientWidth;
            this.oSF.setWidth(nPlaceHolderSFWidth + "px");
            this.oSF.addEventDelegate({
                onkeydown: this._keyDownSearchField.bind(this)
            });
        },

        _initializeSearchHistoryList: function () {
            this._oSearchHistoryList = sap.ui.getCore().byId("SearchHistoryList");
            this._oSearchHistoryList.addEventDelegate({
                onkeydown: this._keyDownSearchHistoryList.bind(this),
                onsapdown: this._keyDownSearchHistoryList.bind(this)
            });
        },

        _initializeFrequentlyUsedAppsList: function () {
            this._oFrequentlyUsedAppsList = sap.ui.getCore().byId("FrequentlyUsedAppsList");
            this._oFrequentlyUsedAppsList.setHeaderText(resources.i18n.getText("frequentAppsCEPSearch"));
            this._oFrequentlyUsedAppsList.addEventDelegate({
                onkeydown: this._keyDownFrequentlyUsedAppsList.bind(this)
            });
        },

        _initializeSearchResultList: function () {
            this._oSearchResultList = sap.ui.getCore().byId("SearchResultList");
            this._oSearchResultList.addEventDelegate({
                onkeydown: this._keyDownSearchResultList.bind(this),
                onsapdown: this._keyDownSearchResultList.bind(this)
            });
        },

        _initializeExternalSearchResultList: function () {
            this._oExternalSearchResultList = sap.ui.getCore().byId("ExternalSearchAppsList");
            this._oExternalSearchResultList.setHeaderText(resources.i18n.getText("searchWithin"));
            this._oExternalSearchResultList.addEventDelegate({
                onkeydown: this._keyDownExternalSearchResultList.bind(this)
            });
        },

        _saveSearchTerm: function (sTerm) {
            if (sTerm) {
                sap.ushell.Container.getServiceAsync("UserRecents")
                    .then(function (UserRecentsService) {
                        UserRecentsService.addSearchActivity({
                            sTerm: sTerm
                        }).then(function () {
                            return;
                        });
                    });
            }
        },

        onRecentSearchPress: function (event) {
            var searchTerm = event.getParameter("listItem").getProperty("title");
            this._recentSearchTermSelected = true;
            this.oSF.setValue(searchTerm);
            this.testProviders(searchTerm);
        },

        onSearchResultPress: function (event) {
            var sSearchTerm = this.oSF.getValue();
            this._saveSearchTerm(sSearchTerm);
            var sBindingContext = "searchResults";
            // In SAP Start - navigates ex-place with URL
            if (this._bIsMyHome === true) {
                var sUrl = event.getParameter("listItem").getBindingContext(sBindingContext).getObject().url;
                if (sUrl !== undefined && sUrl !== null) {
                    this._navigateURL(sUrl);
                    return;
                }
            } else {
                var sSemanticObject = event.getParameter("listItem").getBindingContext(sBindingContext).getObject().semanticObject;
                var sAction = event.getParameter("listItem").getBindingContext(sBindingContext).getObject().semanticObjectAction;
                this._navigateApp(sSemanticObject, sAction);
            }
        },

        onExternalSearchResultPress: function (event) {
            var sSearchTerm = this.oSF.getValue();
            this._saveSearchTerm(sSearchTerm);
            // Navigate to ES from search within list
            if (event.getParameter("listItem").getBindingContext("externalSearchResults").getObject().isEnterpriseSearch === true) {
                this._navigateToResultPage(sSearchTerm, true);
            } else {
                var sUrl = event.getParameter("listItem").getBindingContext("externalSearchResults").getObject().url;
                if (sUrl !== undefined && sUrl !== null) {
                    this._navigateURL(sUrl);
                }
            }
        },

        onFreqUsedAppsPress: function (event) {
            var sAppId = event.getParameter("listItem").getBindingContext("freqUsedApps").getObject().appId;
            var sSemanticObj = sAppId.split("-")[0];
            sSemanticObj = sSemanticObj.split("#")[1];
            var sAction = sAppId.split("-")[1];
            this._navigateApp(sSemanticObj, sAction);
            if (this._oPopover.isOpen()) {
                this._oPopover.close();
            }
        },

        _setListsVisible: function (bVisible, oList) {
            oList.setVisible(bVisible);
        },

        _navigateURL: function (sUrl) {
            WindowUtils.openURL(sUrl);
            this.oSF.setValue("");
            window.setTimeout(function () {
                if (this._oPopover.isOpen()) {
                    this._oPopover.close();
                }
            }.bind(this), 500);
        },

        _navigateApp: function (sSemanticObject, sAction) {
            var oParams = {};
            if (this._bIsMyHome === true ) {
                oParams = {
                    "sap-ushell-navmode": "explace"
                };
            }
            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppNavService) {
                oCrossAppNavService.toExternal({
                    target: {
                        semanticObject: sSemanticObject,
                        action: sAction
                    },
                    params: oParams
                });
            });
            if (this.oSF.getValue() !== "") {
                this.oSF.setValue("");
            }
            window.setTimeout(function () {
                if (this._oPopover.isOpen()) {
                    this._oPopover.close();
                }
            }.bind(this), 500);
        },

        _navigateToResultPage: function (sTerm, bAll) {
            var sHash;
            if (sTerm === "") {
                return;
            }
            if (bAll === true) {
                sHash = "#Action-search&/top=20&filter={\"dataSource\":{\"type\":\"Category\",\"id\":\"All\",\"label\":\"All\",\"labelPlural\":\"All\"},\"searchTerm\":\"" +
                    sTerm + "\",\"rootCondition\":{\"type\":\"Complex\",\"operator\":\"And\",\"conditions\":[]}}";
            } else if (this.bNavigateToNewResultPage === true) {
                sHash = "#WorkZoneSearchResult-display?searchTerm=" + sTerm + "&category=app";
            } else {
                sHash = "#Action-search&/top=20&filter={\"dataSource\":{\"type\":\"Category\",\"id\":\"$$APPS$$\",\"label\":\"Apps\",\"labelPlural\":\"Apps\"},\"searchTerm\":\"" +
                    sTerm + "\",\"rootCondition\":{\"type\":\"Complex\",\"operator\":\"And\",\"conditions\":[]}}";
            }
            this.bOnNavigationToResultPage = true;
            sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function (oCrossAppNavService) {
                oCrossAppNavService.toExternal({
                    target: {
                        shellHash: sHash
                    }
                });
            });
            window.setTimeout(function () {
                this.bOnNavigationToResultPage = false;
            }.bind(this), 3000);
        }
    });
});
