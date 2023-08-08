/*!
 * SAPUI5
 * (c) Copyright 2009-2022 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/base/Object","sap/ui/core/Core","sap/ui/core/IconPool","./HistoryGlobalDataService","./Constants","./Utils","sap/m/Dialog","sap/m/MessageBox","sap/m/FlexBox","sap/m/VBox","sap/m/HBox","sap/m/Switch","sap/m/Button","sap/m/Label"],function(t,e,o,i,s,n,a,r,l,u,_,h,c,y){"use strict";var p;var H=t.extend("sap.ui.comp.historyvalues.HistoryOptOutProvider",{metadata:{library:"sap.ui.comp"},constructor:function(){t.apply(this,arguments);this._initialize()}});H.prototype._initialize=function(){this._oRB=e.getLibraryResourceBundle("sap.ui.comp");this._oHistoryGlobalDataService=i.getInstance();this._oDialog=null;this._oHistoryEnabledSwitch=null;this._oHistoryEnabledLabel=null;this._oDeleteHistoryButton=null;this._oDeleteHistoryLabel=null;this._oSaveButton=null;this._oCancelButton=null;this._oDialogLayout=null;this._oHistoryEnabledLayout=null;this._oDeleteHistoryLayout=null};H.prototype._createOptOutUserProfileEntry=function(){var t=sap.ushell.Container.getRenderer("fiori2"),e={controlType:"sap.m.Button",oControlProperties:{id:s.getHistoryPrefix()+"optOut.trigger",text:this._oRB.getText("HISTORY_SETTING_TITLE"),icon:o.getIconURI("history"),press:function(){this._createDialogContent();this._createLayouts();this._createDialog();this._oHistoryGlobalDataService.getHistoryEnabled().then(function(t){this._oHistoryEnabledSwitch.setState(t);this._oDialog.open()}.bind(this))}.bind(this)},bIsVisible:true,bCurrentState:true};return t.addUserAction(e)};H.prototype._createDialogContent=function(){this._createHistoryEnabledSwitch();this._createHistoryEnabledLabel();this._createDeleteHistoryButton();this._createDeleteHistoryLabel();this._createSaveButton();this._createCancelButton()};H.prototype._createLayouts=function(){this._oHistoryEnabledLayout=new _({alignItems:"Center",items:[this._oHistoryEnabledLabel,this._oHistoryEnabledSwitch]});this._oDeleteHistoryLayout=new l({alignItems:"Center",items:[this._oDeleteHistoryLabel,this._oDeleteHistoryButton]});this._oDialogLayout=new u({items:[this._oHistoryEnabledLayout,this._oDeleteHistoryLayout]}).addStyleClass("sapUiSmallMargin")};H.prototype._createDialog=function(){this._oDialog=new a(s.getHistoryPrefix()+"optOutDialog",{title:this._oRB.getText("HISTORY_SETTING_TITLE"),content:[this._oDialogLayout],buttons:[this._oSaveButton,this._oCancelButton]});this._oDialog.attachAfterClose(this._onOptOutDialogAfterClose,this)};H.prototype._createHistoryEnabledSwitch=function(){this._oHistoryEnabledSwitch=new h};H.prototype._createHistoryEnabledLabel=function(){this._oHistoryEnabledLabel=new y({text:this._oRB.getText("HISTORY_SETTING_ENABLE_TRACKING_DESCRIPTION")}).addStyleClass("sapUiSmallMarginEnd")};H.prototype._createDeleteHistoryButton=function(){this._oDeleteHistoryButton=new c({busyIndicatorDelay:0,text:this._oRB.getText("HISTORY_SETTING_DELETE_BUTTON")});this._oDeleteHistoryButton.attachPress(this._onDeleteHistoryPress,this)};H.prototype._createDeleteHistoryLabel=function(){this._oDeleteHistoryLabel=new y({text:this._oRB.getText("HISTORY_SETTING_DELETE_DESCRIPTION")}).addStyleClass("sapUiSmallMarginEnd")};H.prototype._createSaveButton=function(){this._oSaveButton=new c({text:this._oRB.getText("HISTORY_SETTING_SAVE")});this._oSaveButton.attachPress(this._onSavePress,this)};H.prototype._createCancelButton=function(){this._oCancelButton=new c({text:this._oRB.getText("HISTORY_SETTING_CANCEL")});this._oCancelButton.attachPress(this._onCancelPress,this)};H.prototype._onOptOutDialogAfterClose=function(){this._oDialog.destroy()};H.prototype._onDeleteHistoryPress=function(t){var e=t.getSource();e.setBusy(true);this._oHistoryGlobalDataService.deleteHistory().then(function(){e.setBusy(false)})};H.prototype._onSavePress=function(){r.confirm(this._oRB.getText("HISTORY_SETTING_CONFIRM"),{onClose:function(t){if(t=="CANCEL"){return}this._oHistoryGlobalDataService.setHistoryEnabled(this._oHistoryEnabledSwitch.getState()).then(function(){window.location.reload()})}.bind(this)})};H.prototype._onCancelPress=function(){this._oDialog.close()};H.prototype.exit=function(){if(this._oDialog){this._oDialog.destroy();this._oDialog=null}this._oRB=null;this._oHistoryEnabledSwitch=null;this._oHistoryEnabledLabel=null;this._oDeleteHistoryButton=null;this._oDeleteHistoryLabel=null;this._oSaveButton=null;this._oCancelButton=null;this._oDialogLayout=null;this._oHistoryEnabledLayout=null;this._oDeleteHistoryLayout=null};return{createOptOutSettingPage:function(){if(n.getAppInfo().homePage===true){return}if(!p){p=new H}if(!p._oUserActionPromise){p._oUserActionPromise=p._createOptOutUserProfileEntry()}else{p._oUserActionPromise.then(function(){p._oUserActionPromise=p._createOptOutUserProfileEntry()})}return p}}});