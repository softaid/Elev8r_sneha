/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/core/Control","jquery.sap.global","./library","./ClusterRenderer"],function(e,t,r,o){"use strict";var n=e.extend("sap.ui.vbm.Cluster",{metadata:{library:"sap.ui.vbm",properties:{color:{type:"sap.ui.core.CSSColor",group:"Misc",defaultValue:null},icon:{type:"string",group:"Misc",defaultValue:null},text:{type:"string",group:"Misc",defaultValue:null},type:{type:"sap.ui.vbm.SemanticType",group:"Behavior",defaultValue:sap.ui.vbm.SemanticType.None}}},renderer:o});n.prototype.exit=function(){};n.prototype.init=function(){};n.prototype.onAfterRendering=function(){if(this.$oldContent.length>0){this.$().append(this.$oldContent)}if(this.getColor()&&this.getType()===sap.ui.vbm.SemanticType.None){var e=this.getId()+"-"+"backgroundcircle",r=e+"-"+"innercircle";var o=document.getElementById(e),n=document.getElementById(r);var i=t(o).css("border-bottom-color");var a=this.string2rgba(i);a="rgba("+a[0]+","+a[1]+","+a[2]+","+.5+")";o.style.borderColor=a;n.style.borderColor=a}};n.prototype.onBeforeRendering=function(){this.$oldContent=sap.ui.core.RenderManager.findPreservedContent(this.getId())};n.prototype.string2rgba=function(e){var t;if(t=/^rgb\(([\d]+)[,;]\s*([\d]+)[,;]\s*([\d]+)\)/.exec(e)){return[+t[1],+t[2],+t[3],1,0]}else{return[94,105,110]}};return n});