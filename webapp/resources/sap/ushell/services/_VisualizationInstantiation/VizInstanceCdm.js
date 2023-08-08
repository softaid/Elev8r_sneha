// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_VisualizationInstantiation/VizInstance","sap/m/library","sap/ui/core/Component","sap/base/util/ObjectPath","sap/base/util/deepExtend","sap/ui/core/ComponentContainer","sap/ushell/UI5ComponentType","sap/ushell/services/_VisualizationInstantiation/VizInstanceRenderer"],function(t,e,n,o,i,a,r,s){"use strict";var p=e.LoadState;var u=t.extend("sap.ushell.ui.launchpad.VizInstanceCdm",{metadata:{library:"sap.ushell"},renderer:s});u.prototype.load=function(t){var e;if(t===true){e=this._loadCustomVizType()}else{e=this._loadStandardVizType()}return e.then(function(t){this._oComponent=t;var e=new a({component:t});t.setParent(this);this.setContent(e);this._setComponentTileVisible(this.getActive());this.setTileEditable(this.getEditable())}.bind(this)).catch(function(t){this.setState(p.Failed);return Promise.reject(t)}.bind(this))};u.prototype._loadStandardVizType=function(){var t=this._getComponentConfiguration();return n.create(t)};u.prototype._loadCustomVizType=function(){var t=this._getCustomComponentConfiguration();var e={};var n=[];return sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function(o){var i=o.createComponent(t,e,n,r.Visualization);return new Promise(function(t,e){i.done(function(e){t(e)})})}).then(function(t){if(t&&t.componentHandle&&t.componentHandle.getInstance){return t.componentHandle.getInstance()}throw new Error("Create component failed: no instance found in the component handle.")})};u.prototype._getComponentConfiguration=function(){var t=this.getInstantiationData().vizType;var e=this.getVizConfig();var n=o.get(["sap.platform.runtime","componentProperties"],t);n=i({},this._getComponentProperties(),n);var a={name:t["sap.ui5"].componentName,componentData:{properties:n},url:o.get(["sap.platform.runtime","componentProperties","url"],t),manifest:o.get(["sap.platform.runtime","componentProperties","manifest"],t),asyncHints:o.get(["sap.platform.runtime","componentProperties","asyncHints"],t)};var r=o.get(["sap.platform.runtime","includeManifest"],t);var s=o.get(["sap.platform.runtime","includeManifest"],e);if(r||s){a.manifest=i({},t,e)}if(typeof a.manifest==="object"){n.manifest=a.manifest}return a};u.prototype._getCustomComponentConfiguration=function(){var t=this._getComponentConfiguration();var e={loadCoreExt:true,loadDefaultDependencies:false,componentData:t.componentData,url:t.url,applicationConfiguration:{},reservedParameters:{},applicationDependencies:t,ui5ComponentName:t.name};return e};u.prototype._getComponentProperties=function(){return{title:this.getTitle(),subtitle:this.getSubtitle(),icon:this.getIcon(),info:this.getInfo(),indicatorDataSource:this.getIndicatorDataSource(),dataSource:this.getDataSource(),contentProviderId:this.getContentProviderId(),targetURL:this.getTargetURL(),displayFormat:this.getDisplayFormat(),numberUnit:this.getNumberUnit()}};u.prototype._setComponentTileVisible=function(t){if(this._oComponent&&typeof this._oComponent.tileSetVisible==="function"){this._oComponent.tileSetVisible(t)}};u.prototype.setActive=function(t,e){this._setComponentTileVisible(t);if(e){this.refresh()}return this.setProperty("active",t,false)};u.prototype.setTileEditable=function(t){if(this._oComponent&&typeof this._oComponent.tileSetEditMode==="function"){this._oComponent.tileSetEditMode(t)}return this};u.prototype.refresh=function(){if(this._oComponent&&typeof this._oComponent.tileRefresh==="function"){this._oComponent.tileRefresh()}};return u});