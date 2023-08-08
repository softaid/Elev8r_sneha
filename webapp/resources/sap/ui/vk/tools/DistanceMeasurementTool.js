/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Fragment","sap/ui/core/IconPool","sap/ui/core/format/NumberFormat","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel","./Tool","./MeasurementToolHandler","./DistanceMeasurementToolGizmo","../measurements/Settings","../getResourceBundle"],function(e,t,i,o,s,a,n,r,l,u){"use strict";var c="vk-icons";var d="vk-icons";t.addIcon("measurement-vertex",c,d,"e965");t.addIcon("measurement-edge",c,d,"e964");t.addIcon("measurement-face",c,d,"e963");t.addIcon("fill-color",c,d,"e92f");var m=a.extend("sap.ui.vk.tools.DistanceMeasurementTool",{metadata:{library:"sap.ui.vk"}});var p=m.getMetadata().getParent().getClass().prototype;m.prototype.init=function(){if(p.init){p.init.call(this)}this._viewport=null;this._handler=new n(this);this.setFootprint(["sap.ui.vk.threejs.Viewport","sap.ui.vk.svg.Viewport"]);this.setGizmo(new r)};m.prototype.exit=function(){p.exit.apply(this,arguments)};m.prototype.setActive=function(e,t,i){p.setActive.call(this,e,t,i);if(this._viewport){if(e){this._gizmo=this.getGizmo();if(this._gizmo){this._gizmo.show(this._viewport,this)}this._addLocoHandler();this._viewport.addStyleClass("sapUiVizKitDistanceCursor")}else{this._viewport.removeStyleClass("sapUiVizKitDistanceCursor");this._removeLocoHandler();if(this._gizmo){this._gizmo.hide();this._gizmo=null}}}return this};m.prototype.showSettingsDialog=function(t){var a=l.load();var n=t.getCamera();var r=t.getMeasurementSurface();var c;e.load({name:"sap.ui.vk.measurements.Settings",id:this.getId()+"-settings-dialog",controller:{formatPrecision:function(e){var t=i.getFloatInstance({minFractionDigits:e,maxFractionDigits:e});return t.format(Math.pow(10,-e))},onClosePressed:function(e){c.close()},onAfterClose:function(e){c.destroy();c=null},onChange:function(e){l.save(a);r.updateSettings(a);r.update(t,n)}}}).then(function(e){c=e;c.setModel(new s({bundle:u()}),"i18n");c.setModel(new o(a),"settings");c.setModel(new o({is2D:t.getScene().getMetadata().getName()==="sap.ui.vk.svg.Scene"}),"extra");c.open()})};return m});