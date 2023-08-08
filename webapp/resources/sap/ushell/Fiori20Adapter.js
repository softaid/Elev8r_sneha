// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ui/base/Object","sap/ui/core/Component","sap/ui/core/UIComponent","sap/ui/model/resource/ResourceModel","sap/m/Fiori20Adapter","sap/ui/thirdparty/hasher","sap/base/util/extend"],function(e,t,i,n,r,o,a){"use strict";var s;i._fnOnInstanceDestroy=function(e){if(e._fioriAdapter){e._fioriAdapter.destroy()}};var f=e.extend("AppInfo",{constructor:function(t){e.call(this);this._oComponent=t},getDefaultTitle:function(){var e,t,i=this._oComponent.getMetadata();var n=i.getManifestEntry("sap.app");if(n&&n.title){e=n.title;if(this._isLocalizationKey(e)){t=n.i18n||"i18n/i18n.properties";return this._getLocalized(e,t)}return e}var r=i.getManifestEntry("sap.ui5");if(r&&r.config&&r.config.resourceBundle&&r.config.titleResource){e=r.config.titleResource;t=r.config.resourceBundle;return this._getLocalized(e,t)}return},_getLocalized:function(e,t){var i=new n({bundleUrl:sap.ui.require.toUrl(this._oComponent.getMetadata().getComponentName())+"/"+t});return i.getResourceBundle().getText(e.replace(/^{{/,"").replace(/}}$/,""))},_isLocalizationKey:function(e){return e.indexOf("{{")===0&&e.indexOf("}}")>0}});var u=e.extend("HeaderInfo",{constructor:function(t,i,n){e.call(this);this._oConfig=i;this._oAppInfo=n;this._aHierarchy=[];this._defaultTitle=this._oAppInfo.getDefaultTitle();this._oCurrentViewInfo={oTitleInfo:{text:this._defaultTitle}}},registerView:function(e){if(this._oConfig.bMoveTitle===true){if(!e.oTitleInfo&&e.oSubTitleInfo){e.oTitleInfo=e.oSubTitleInfo}this._oCurrentViewInfo=e;var t=this._oCurrentViewInfo.oTitleInfo?this._oCurrentViewInfo.oTitleInfo.text:undefined;if(t!==s.getTitle()){s.setTitle(t)}this._updateHierarchy()}this._setBackNavigation(e.oBackButton,e.oAdaptOptions)},_setBackNavigation:function(e,t){if(t&&t.bHideBackButton===false){return}var i;if(e){i=e.firePress.bind(e)}s.setBackNavigation(i)},_updateHierarchy:function(){if(this._oConfig.bHierarchy===false){return}if(!this._oCurrentViewInfo){return}var e=true,t="#"+o.getHash();for(var i=this._aHierarchy.length-1;i>=0;i--){var n=this._aHierarchy[i],r=n.id===this._oCurrentViewInfo.sViewId,a=n.intent===t;if(r||a){e=false;n=this._updateHierarchyEntry(n);this._aHierarchy[i]=n;this._aHierarchy=this._aHierarchy.slice(0,i+1);if(r){n.intent=t}break}}if(e){this._aHierarchy.push(this._createHierarchyEntry())}var f=[];for(var u=this._aHierarchy.length-2;u>=0;u--){f.push(this._aHierarchy[u])}s.setHierarchy(this._deleteUndefinedProperties(f))},_createHierarchyEntry:function(){var e="#"+o.getHash(),t={id:this._oCurrentViewInfo.sViewId,title:this._oCurrentViewInfo.oTitleInfo?this._oCurrentViewInfo.oTitleInfo.text:this._defaultTitle,subtitle:this._oCurrentViewInfo.oSubTitleInfo?this._oCurrentViewInfo.oSubTitleInfo.text:undefined,intent:e};return t},_updateHierarchyEntry:function(e){e.id=this._oCurrentViewInfo.sViewId;e.title=this._oCurrentViewInfo.oTitleInfo?this._oCurrentViewInfo.oTitleInfo.text:this._defaultTitle;e.subtitle=this._oCurrentViewInfo.oSubTitleInfo?this._oCurrentViewInfo.oSubTitleInfo.text:undefined;return e},_deleteUndefinedProperties:function(e){e.forEach(function(e){for(var t in e){if(e.hasOwnProperty(t)&&!e[t]&&t!=="title"){delete e[t]}}});return e}});var h=e.extend("sap.ushell.Fiori20Adapter",{constructor:function(t,i){e.call(this);this._oComponent=t;this._oConfig=i;this._oHeaderInfo=new u(t,i,new f(t));if(r){r.attachViewChange(this._onViewChange,this)}},init:function(){if(!r){return}var e=a({},this._oConfig);r.traverse(this._oComponent.getAggregation("rootControl"),e)},destroy:function(){if(r){r.detachViewChange(this._onViewChange,this)}},_onViewChange:function(e){this._oHeaderInfo.registerView(e.getParameters())}});h.applyTo=function(e,n,r,o){var a=e instanceof i?e:t.getOwnerComponentFor(e);if(!a){a=n}if(a&&!a._fioriAdapter){s=o;a._fioriAdapter=new h(a,r);a._fioriAdapter.init()}};return h});