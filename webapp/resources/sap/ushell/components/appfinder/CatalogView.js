// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/core/mvc/View","sap/ui/core/library","sap/ushell/ui/appfinder/AppBox","sap/ushell/ui/appfinder/PinButton","sap/ushell/ui/launchpad/CatalogEntryContainer","sap/ushell/ui/launchpad/CatalogsContainer","sap/ushell/ui/launchpad/Tile","sap/ui/thirdparty/jquery","sap/ui/performance/Measurement","sap/ushell/resources","sap/ushell/ui/launchpad/AccessibilityCustomData","sap/m/List","sap/m/StandardListItem","sap/ui/Device","sap/m/MessagePage","sap/m/Page","sap/m/PageAccessibleLandmarkInfo","sap/m/BusyIndicator","sap/m/SplitApp","sap/ushell/Config","sap/ushell/components/appfinder/VisualizationOrganizerHelper"],function(e,t,a,o,i,s,n,l,r,p,u,g,c,d,h,f,C,m,v,b,P){"use strict";var y=t.AccessibleLandmarkRole;return e.extend("sap.ushell.components.appfinder.CatalogView",{oController:null,oVisualizationOrganizerHelper:P.getInstance(),formatPinButtonTooltip:function(e,t){var a;if(t.path){var o=e?Array.prototype.indexOf.call(e,t.id):-1;a=o!==-1?"removeAssociatedTileFromContextGroup":"addAssociatedTileToContextGroup";return p.i18n.getText(a,t.title)}a=e&&e.length?"EasyAccessMenu_PinButton_Toggled_Tooltip":"EasyAccessMenu_PinButton_UnToggled_Tooltip";return p.i18n.getText(a)},formatPinButtonSelectState:function(e,t,a,o){if(a){var i=e?Array.prototype.indexOf.call(e,o):-1;return i!==-1}return!!t},createContent:function(e){var t=this;this.oViewData=this.getViewData();this.parentComponent=this.oViewData.parentComponent;var b=this.parentComponent.getModel();this.setModel(b);this.setModel(this.oViewData.subHeaderModel,"subHeaderModel");this.oVisualizationOrganizerHelper.setModel(b);this.oController=e;function P(e){return e!==null&&(e==="1x2"||e==="2x2")||false}var T=new o({icon:{path:"id",formatter:this.oVisualizationOrganizerHelper.formatPinButtonIcon},type:{path:"id",formatter:this.oVisualizationOrganizerHelper.formatPinButtonType},selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:this.oVisualizationOrganizerHelper.formatPinButtonSelectState.bind(this)},tooltip:{parts:["associatedGroups","/groupContext","id"],formatter:this.oVisualizationOrganizerHelper.formatPinButtonTooltip.bind(this)},press:[this.oVisualizationOrganizerHelper.onTilePinButtonClick,this],visible:false});var S=new o({icon:{path:"id",formatter:this.oVisualizationOrganizerHelper.formatPinButtonIcon},type:{path:"id",formatter:this.oVisualizationOrganizerHelper.formatPinButtonType},selected:{parts:["associatedGroups","associatedGroups/length","/groupContext/path","/groupContext/id"],formatter:this.oVisualizationOrganizerHelper.formatPinButtonSelectState.bind(this)},tooltip:{parts:["associatedGroups","/groupContext","id"],formatter:this.oVisualizationOrganizerHelper.formatPinButtonTooltip.bind(this)},press:[this.oVisualizationOrganizerHelper.onTilePinButtonClick,this],visible:false});this.oAppBoxesTemplate=new a({title:"{title}",icon:"{icon}",subtitle:"{subtitle}",url:"{url}",navigationMode:"{navigationMode}",pinButton:S,press:[e.onAppBoxPressed,e]});this.oVisualizationOrganizerHelper.shouldPinButtonBeVisible().then(function(e){S.setVisible(e);T.setVisible(e)});S.addCustomData(new u({key:"tabindex",value:"-1",writeToDom:true}));S.addStyleClass("sapUshellPinButton");T.addCustomData(new u({key:"tabindex",value:"-1",writeToDom:true}));T.addStyleClass("sapUshellPinButton");this.oTileTemplate=new n({tileViews:{path:"content",factory:function(e,t){return t.getObject()}},long:{path:"size",formatter:P},tileCatalogId:"{id}",pinButton:T,press:[e.catalogTilePress,e],afterRendering:e.onTileAfterRendering});this.oCatalogSelect=new g("catalogSelect",{visible:"{/enableCatalogSelection}",rememberSelections:true,mode:"SingleSelectMaster",items:{path:"/masterCatalogs",template:new c({type:"Active",title:"{title}"})},showNoData:false,itemPress:[e._handleCatalogListItemPress,e],selectionChange:[e._handleCatalogListItemPress,e]});this.getCatalogSelect=function(){return this.oCatalogSelect};var B=this.oCatalogSelect.onAfterRendering;if(d.system.desktop){sap.ui.require(["sap/ushell/components/ComponentKeysHandler","sap/ushell/renderers/fiori2/AccessKeysHandler"],function(e,t){e.getInstance().then(function(e){this.oCatalogSelect.addEventDelegate({onsaptabnext:function(a){try{a.preventDefault();t.setIsFocusHandledByAnotherHandler(true);e.setFocusOnCatalogTile()}catch(e){}},onsapskipforward:function(a){try{a.preventDefault();t.setIsFocusHandledByAnotherHandler(true);e.setFocusOnCatalogTile()}catch(e){}},onsapskipback:function(a){try{a.preventDefault();t.setIsFocusHandledByAnotherHandler(true);var o=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(o.getVisible()){o.focus()}else{e.appFinderFocusMenuButtons(a)}}catch(e){}}})}.bind(this))}.bind(this))}if(b.getProperty("/enableHelp")){this.oCatalogSelect.addStyleClass("help-id-catalogCategorySelect")}this.setCategoryFilterSelection=function(e,a){var o=t.getCatalogSelect();var i=o.getItems();var s=e;var n=0;if(!s||s===""){s=p.i18n.getText("all")}i.forEach(function(e,t){if(e.getTitle()===s){n=t;o.setSelectedItem(e)}});if(i.length!==0&&a){i[n].focus()}};this.oCatalogSelect.onAfterRendering=function(){var e=t.oController.categoryFilter||p.i18n.getText("all");t.setCategoryFilterSelection(e);if(B){B.apply(this,arguments)}if(!this.getSelectedItem()){this.setSelectedItem(this.getItems()[0])}setTimeout(function(){var e=l("#catalog-button, #userMenu-button, #sapMenu-button").filter("[tabindex=0]");if(e.length){e.eq(0).focus()}else{l("#catalog-button").focus()}},0)};var M=this.oCatalogSelect._onAfterRenderingPopover;this.oCatalogSelect._onAfterRenderingPopover=function(){if(this._oPopover){this._oPopover.setFollowOf(false)}if(M){M.apply(this,arguments)}};var A=sap.ui.getCore().getEventBus();var w;var x=function(){this.splitApp.toMaster("catalogSelect","show");if(!d.system.phone){w=this._calculateDetailPageId();if(w!==this.splitApp.getCurrentDetailPage().getId()){this.splitApp.toDetail(w)}}}.bind(this);A.subscribe("launchpad","catalogContentLoaded",function(){setTimeout(x,500)},this);A.subscribe("launchpad","afterCatalogSegment",x,this);var D=new i({header:"{title}",customTilesContainer:{path:"customTiles",template:this.oTileTemplate,templateShareable:true},appBoxesContainer:{path:"appBoxes",template:this.oAppBoxesTemplate,templateShareable:true}});this.oMessagePage=new h({visible:true,showHeader:false,text:p.i18n.getText("EasyAccessMenu_NoAppsToDisplayMessagePage_Text"),description:""}).addEventDelegate({onAfterRendering:function(){var e=this.oMessagePage.getDomRef();if(e){var t=e.getElementsByClassName("sapMMessagePageMainText");if(t.length){t[0].setAttribute("tabindex","0")}}}.bind(this),onBeforeRendering:function(){var e=this.oMessagePage.getDomRef();if(e){var t=e.getElementsByClassName("sapMMessagePageMainText");if(t.length){t[0].removeAttribute()}}}.bind(this)});this.oCatalogsContainer=new s("catalogTiles",{categoryFilter:"{/categoryFilter}",catalogs:{path:"/catalogs",templateShareable:true,template:D},busy:true}).addStyleClass("sapUiTinyMarginTop");this.oCatalogsContainer.addStyleClass("sapUshellCatalogTileContainer");this.oCatalogsContainer.addEventDelegate({onsaptabprevious:function(e){var t=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");var a=l(e.srcControl.getDomRef());if(t.getVisible()&&!t.getPressed()&&!a.hasClass("sapUshellPinButton")){e.preventDefault();var o=sap.ui.getCore().byId("appFinderSearch");o.focus()}},onsapskipback:function(e){var t=sap.ui.getCore().byId("openCloseButtonAppFinderSubheader");if(t.getVisible()&&!t.getPressed()){e.preventDefault();t.focus()}}});this.oCatalogsContainer.onAfterRendering=function(){var e=sap.ui.getCore().byId("catalogTilesDetailedPage");if(!this.getBusy()){e.setBusy(false);r.end("FLP:AppFinderLoadingStartToEnd")}else{e.setBusy(true)}l("#catalogTilesDetailedPage-cont").scroll(function(){var e=sap.ui.getCore().byId("catalogTilesDetailedPage");var a=e.getScrollDelegate();var o=a.getScrollTop();var i=a.getMaxScrollTop();if(i-o<=30+3*t.oController.PagingManager.getTileHeight()&&t.oController.bIsInProcess===false){t.oController.bIsInProcess=true;t.oController.allocateNextPage();setTimeout(function(){t.oController.bIsInProcess=false},0)}})};var I=new f("catalogTilesDetailedPage",{showHeader:false,showFooter:false,showNavButton:false,content:[this.oCatalogsContainer.addStyleClass("sapUshellCatalogPage")],landmarkInfo:new C({contentLabel:p.i18n.getText("appFinderCatalogTitle"),contentRole:y.None,rootRole:y.None})});var H=new f("catalogMessagePage",{showHeader:false,showFooter:false,showNavButton:false,content:[this.oMessagePage]});var z=new m("catalogSelectBusyIndicator",{size:"1rem"});this.splitApp=new v("catalogViewMasterDetail",{masterPages:[z,this.oCatalogSelect],detailPages:[I,H],mode:"{= ${/isPhoneWidth} ? 'HideMode' : 'ShowHideMode'}"});return this.splitApp},_calculateDetailPageId:function(){var e=this.getModel("subHeaderModel");var t=e.getProperty("/search/searchMode");var a=e.getProperty("/tag/tagMode");var o=!!this.getModel().getProperty("/catalogsNoDataText");var i;if(t||a){i=this.getController().bSearchResults?"catalogTilesDetailedPage":"catalogMessagePage"}else if(o){i="catalogMessagePage"}else{i="catalogTilesDetailedPage"}return i},getControllerName:function(){return"sap.ushell.components.appfinder.Catalog"}})});