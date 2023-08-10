/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */
sap.ui.define(["./GeoMap","./VoBase","sap/ui/core/theming/Parameters","jquery.sap.global","sap/base/Log","./library","./AnalyticMapRenderer"],function(e,t,i,o,r,n,a){"use strict";var s=e.extend("sap.ui.vbm.AnalyticMap",{metadata:{library:"sap.ui.vbm",properties:{},aggregations:{regions:{type:"sap.ui.vbm.Region",multiple:true,singularName:"region"}},events:{regionClick:{parameters:{code:{type:"string"}}},regionContextMenu:{parameters:{code:{type:"string"}}},regionSelect:{},regionDeselect:{}}},renderer:a});s.DefaultABAPGeoJSONURL="/sap/bc/vbi/geojson/L0.json";s.DefaultGeoJSONURL="media/analyticmap/L0.json";s.DefaultRegionColor=i&&i.get("_sap_ui_vbm_shared_ChoroplethRegionBG")?i.get("_sap_ui_vbm_shared_ChoroplethRegionBG"):"rgb(213,218,221)";s.DefaultRegionColorBorder=i&&i.get("_sap_ui_vbm_shared_ChoroplethRegionBorder")?i.get("_sap_ui_vbm_shared_ChoroplethRegionBorder"):"rgb(255,255,255)";s.DefaultRegionSelectColor="RHLSA(0;1;1;1)";s.DefaultHotDeltaColor="RHLSA(0;1;1;1.0)";s.AltBorderColor=i&&i.get("_sap_ui_vbm_shared_ChartDataPointBorderHoverSelectedColor")?i.get("_sap_ui_vbm_shared_ChartDataPointBorderHoverSelectedColor"):"#676767";var l=i&&i.get("_sap_ui_vbm_shared_ChartDataPointNotSelectedBackgroundOpacity")?i.get("_sap_ui_vbm_shared_ChartDataPointNotSelectedBackgroundOpacity"):"0.6";s.DefaultRegionNonSelectColor="RHLSA(0;1;1;"+l+")";s.prototype.exit=function(){e.prototype.exit.apply(this,arguments);this.detachEvent("submit",s.prototype.onAnalyticsSubmit,this)};s.prototype.onAfterRendering=function(){sap.ui.vbm.VBI.prototype.onAfterRendering.apply(this,arguments)};s.prototype.destroyRegions=function(){this.mbRegionsDirty=true;this.destroyAggregation("regions")};s.prototype.addRegion=function(e){this.mbRegionsDirty=true;this.addAggregation("regions",e)};s.prototype.removeRegion=function(e){this.mbRegionsDirty=true;this.removeAggregation("regions",e)};s.prototype.insertRegion=function(e,t){this.mbRegionsDirty=true;this.insertAggregation("regions",e,t)};s.prototype.removeAllRegions=function(){this.mbRegionsDirty=true;this.removeAllAggregation("regions")};s.prototype.destroyLegend=function(){this.mbLegendDirty=true;this.destroyAggregation("legend")};s.prototype.setLegend=function(e){this.mbLegendDirty=true;this.setAggregation("legend",e)};s.prototype.onAnalyticsSubmit=function(e){var t=JSON.parse(e.mParameters.data);var i,o,r;switch(t.Action.name){case"RGN_CONTEXTMENU":i=t.Action.instance.split(".")[1];r={code:i};if(o=this.findRegionInAggregation(i)){o.fireContextMenu(r)}this.fireRegionContextMenu(r);break;case"RGN_CLICK":i=t.Action.instance.split(".")[1];r={code:i};if(o=this.findRegionInAggregation(i)){o.fireClick(r)}this.fireRegionClick(r);if(t.Data&&t.Data.Merge){this.setSelectionPropFireSelect(t.Data.Merge)}break;default:break}};s.prototype.init=function(){this.mProperties.scaleVisible=false;e.prototype.init.apply(this,arguments);this.mbRegionsDirty=false;this.mbLegendDirty=false;this.mbThemingDirty=true;this.attachEvent("submit",s.prototype.onAnalyticsSubmit,this);this.createRegions()};s.prototype.createRegions=function(){var e=this.mColC=s.DefaultRegionColor;var t=this.mColCB=s.DefaultRegionColorBorder;function i(e,t,i,o,r,n,a){var l={};l.K=e;l.P=[];l.T=n;l.C=o;l.CB=r;l.HDC=s.DefaultHotDeltaColor;l.ACB=l.CB;l.G=a;l.S="false";var g,p,u;for(var h=0,f=t.length;h<f;++h){p=t[h];u=[];for(var c=0,d=p.length;c<d;++c){g="";for(var m=0,C=p[c].length;m<C;++m){if(m){g+=";"}g+=p[c][m]}u.push(g)}l.P.push(u)}return l}var n=null,a=[],l,g="";a[0]=s.GeoJSONURL;var p=window.URI(s.DefaultABAPGeoJSONURL);p.addQuery("sap-language",sap.ui.getCore().getConfiguration().getLanguage());a[1]=p.toString();a[2]=sap.ui.resource("sap.ui.vbm",s.DefaultGeoJSONURL);for(var u=0;u<3;++u){g=a[u];if(!n&&g){l=o.sap.syncGetJSON(g);if(l.statusCode===200&&l.data&&!l.error){n=l.data;break}}}if(!n){r.error("The GeoJSON file is invalid or could not be parsed.\r\nPlease contact your Administrator.",g,"sap.ui.vbm.AnalyticMap");return}var h=[];this.mRegionApplicationTable=h;this.mRegionBox=[];this.mNames=[];this.mRegionProps=[];var f,c,d,m;var C=n.features,y="",R;var v;var b;var B;for(var L=0,A=C.length;L<A;++L){R=[];b=[];B=[];v=[];var _=C[L];if(_.id2==="AQ"){continue}if(!_.id2){_.id2=_.id}if(_.properties&&_.properties.name){y=_.properties.name}else if(_.properties&&_.properties.NAME){y=_.properties.NAME}else{y=""}this.mNames[_.id2]=y;this.mRegionProps[_.id2]=_.properties;var S=_.geometry.coordinates;var D,T,N,M,P;var E,V;switch(_.geometry.type){case"Polygon":d=Number.MAX_VALUE;m=-Number.MAX_VALUE;f=Number.MAX_VALUE;c=-Number.MAX_VALUE;P=S.length;for(E=0;E<P;++E){D=S[E];R=[];for(V=0;V<D.length;++V){M=D[V];if(!E){if((T=M[0])<f){f=T}if(T>c){c=T}if((N=M[1])<d){d=N}if(N>m){m=N}}R.push(M[0],M[1],"0")}B.push(R)}b.push(B);v.push([f,c,d,m]);break;case"MultiPolygon":for(var I=0,x=S.length;I<x;++I){d=Number.MAX_VALUE;m=-Number.MAX_VALUE;f=Number.MAX_VALUE;c=-Number.MAX_VALUE;B=[];P=S[I].length;for(E=0;E<P;++E){D=S[I][E];R=[];for(V=0;V<D.length;++V){M=D[V];if(!E){if((T=M[0])<f){f=T}if(T>c){c=T}if((N=M[1])<d){d=N}if(N>m){m=N}}R.push(M[0],M[1],"0")}B.push(R)}v.push([f,c,d,m]);b.push(B)}break;default:continue}h.push(i(_.id2,b,_.geometry.type,e,t,y,_.id2));this.mRegionBox[_.id2]=window.VBI.MathLib.GetSurroundingBox(v)}};s.prototype.getRegionsTemplateObject=function(){return{id:"Region",type:"{00100000-2012-0004-B001-F311DE491C77}","entity.bind":"Regions.Entity",datasource:"Regions","posarraymulti.bind":"Regions.PosList","color.bind":"Regions.Color",selectColor:s.DefaultRegionSelectColor,nonSelectColor:s.DefaultRegionNonSelectColor,"colorBorder.bind":"Regions.BorderColor","tooltip.bind":"Regions.ToolTip","hotDeltaColor.bind":"Regions.HotDeltaColor","altBorderDeltaColor.bind":"Regions.AltBorderColor","select.bind":"Regions.VB:s","labelText.bind":"Regions.LT","labelPos.bind":"Regions.LP","labelBgColor.bind":"Regions.LBC","labelBorderColor.bind":"Regions.LBBC","labelArrow.bind":"Regions.AR","labelType.bind":"Regions.LabelType"}};s.prototype.getRegionsTypeObject=function(){var e=[{name:"Key",alias:"K",type:"string"},{name:"PosList",alias:"P",type:"vectorarraymulti"},{name:"ToolTip",alias:"T",type:"string"},{name:"Color",alias:"C",type:"color"},{name:"BorderColor",alias:"CB",type:"color"},{name:"HotDeltaColor",alias:"HDC",type:"string"},{name:"AltBorderColor",alias:"ACB",type:"color"},{name:"Entity",alias:"G",type:"string"},{name:"VB:s",alias:"S",type:"boolean"},{name:"LT",alias:"LT",type:"string"},{name:"LP",alias:"LP",type:"string"},{name:"LBC",alias:"LBC",type:"color"},{name:"LBBC",alias:"LBBC",type:"color"},{name:"AR",alias:"AR",type:"boolean"},{name:"LabelType",alias:"LabelType",type:"string"}];return{name:"Regions",minSel:"0",maxSel:"-1",key:"Key",A:e}};s.prototype.getRegionsDataObjects=function(){var e=[];var i=[];var r=[];var n=[];o.extend(true,e,this.mRegionApplicationTable);if(!e.length){return null}var a=this.getRegionMap();for(var l=0,g=e.length,p,u,h;l<g;++l){u=e[l];if(p=a[u.K]){u.HDC="RHLSA(0;1.0;1.0;0.4)";u.ACB=s.AltBorderColor;if(h=p.getColor()){u.C=this.getPlugin()?window.VBI.Utilities.String2VBColor(h):h}if(h=p.getTooltip()){u.T=h}u.LT=p.getLabelText();u.S=p.getSelect();u.LP="0";u.LBC=p.getLabelBgColor();u.LBBC=p.getLabelBorderColor();u.AR=p.getLabelArrow();var f=p.getLabelType();var c=t.prototype.getLabelProps(f);if(c&&u.LT){if(c.LBC){u.LBC=c.LBC}if(c.LBBC){u.LBBC=c.LBBC}if(c.LIC){u.LIC=c.LIC}if(c.LICC){u.LICC=c.LICC}if(c.LICTC){u.LICTC=c.LICTC}}if(!u.LBC){u.LBC="rgba(255,255,255,1.0)"}if(u.LBBC==""){u.LBBC=u.LBC}i.push(u)}else{r.push(u)}}n=r.concat(i);return{name:"Regions",type:"N",E:n}};s.prototype.addRegionsActions=function(e){e.push({id:"AMap1",name:"RGN_CLICK",refScene:"MainScene",refVO:"Region",refEvent:"Click"});e.push({id:"AMap2",name:"RGN_CONTEXTMENU",refScene:"MainScene",refVO:"Region",refEvent:"ContextMenu"});return e};s.prototype.findSelected=function(e,t){var i=this.getRegions();if(!i){return null}var r=[];if(o.type(t)=="object"){if(t.S==(e?"true":"false")){for(var n=0;n<i.length;++n){if(i[n].sId==t.K){r.push(i[n])}}}}else if(o.type(t)=="array"){for(var a=0;a<t.length;++a){if(t[a].S==(e?"true":"false")){for(var s=0;s<i.length;++s){if(i[s].mProperties.code===t[a].K){r.push(i[s])}}}}}return r};s.prototype.setSelectionPropFireSelect=function(t){var i={};i.N=[];var o=t.N;for(var r=0;r<o.length;++r){var n=o[r];var a=n.E;var s,l;var g=false;if(n.name=="Regions"){s=[];l=[];var p=this.getRegionMap();for(var u=0;u<a.length;++u){var h=a[u];var f=h.S=="true"?true:false;var c=p[h.K];if(c){var d=c.getSelect();if(f!=d){c.setProperty("select",f,true);if(f&&this.mEventRegistry["regionSelect"]){s.push(c)}else if(!f&&this.mEventRegistry["regionDeselect"]){l.push(c)}}}else{g=true}}if(l.length){this.fireRegionDeselect({deselected:l})}if(s.length){this.fireRegionSelect({selected:s})}if(g){this.invalidate();this.mbForceDataUpdate=true}}else{i.N.push(n)}}if(i.N.length){e.prototype.setSelectionPropFireSelect.call(this,i)}};s.prototype.getSelectedItems=function(e){var t=[];if(!e){return null}for(var i=0;i<e.length;++i){if(e[i].name==="Regions"){var o=this.findSelected(true,e[i].E);if(o&&o.length){t=t.concat(o)}}else{var r=this.getAggregatorContainer(e[i].name);var n=r.findSelected(true,e[i].E);if(n&&n.length){t=t.concat(n)}}}return t};s.prototype.findRegionInAggregation=function(e){var t=this.getRegions();if(t){for(var i=0,o=t.length;i<o;++i){if(t[i].mProperties.code===e){return t[i]}}}return null};s.prototype.updateVOData=function(t,i,o,r,n){if(this.mbThemingDirty){this.applyTheming(this.mRegionApplicationTable)}t.push(this.getRegionsTemplateObject());r.push(this.getRegionsTypeObject());o.push({name:"Regions",type:"N"});i.push(this.getRegionsDataObjects());e.prototype.updateVOData.apply(this,arguments);this.addRegionsActions(n)};s.prototype.resetDirtyStates=function(){e.prototype.resetDirtyStates.apply(this,arguments);this.mbRegionsDirty=false};s.prototype.minimizeApp=function(t){e.prototype.minimizeApp.apply(this,arguments);var i,o;if(!this.getMapConfiguration()){(i=t)&&(i=i.SAPVB)&&(i=i.Scenes)&&((o=i.Set)||(o=i.Merge))&&(i=o.SceneGeo)&&i.refMapLayerStack&&(i.refMapLayerStack="")}return t};s.prototype.invalidate=function(t){if(t instanceof sap.ui.vbm.Region){this.mbRegionsDirty=true}e.prototype.invalidate.apply(this,arguments)};s.prototype.getRegionMap=function(){var e={};var t=this.getRegions();for(var i=0,o=t?t.length:0,r;i<o;++i){r=t[i];e[r.getCode()]=r}return e};s.prototype.zoomToRegions=function(e,t){if(t==undefined){t=.9999}var i=[];for(var o=0,r=e.length;o<r;++o){var n=this.mRegionBox[e[o]];if(n!=undefined){i.push(n)}}if(!i.length){return}var a=null;if(a=this.mVBIContext.GetMainScene()){a.ZoomToAreas(i,t)}};s.prototype.getRegionsInfo=function(e){var t=[];for(var i=0,o=e.length,r;i<o;++i){r=e[i];t[r]={};t[r].BBox=this.mRegionBox[r];t[r].Midpoint=[(this.mRegionBox[r][0]+this.mRegionBox[r][1])/2,(this.mRegionBox[r][2]+this.mRegionBox[r][3])/2];t[r].Name=this.mNames[r];t[r].Properties=this.mRegionProps[r]}return t};s.prototype.onThemeChanged=function(e){this.mbThemingDirty=true;this.invalidate()};s.prototype.applyTheming=function(e){if(sap.ui.core.theming&&i){var t=s.DefaultRegionColor;if(i.get("_sap_ui_vbm_shared_ChoroplethRegionBG")!=undefined){t=s.DefaultRegionColor=i.get("_sap_ui_vbm_shared_ChoroplethRegionBG")}var o=s.DefaultRegionColorBorder;if(i.get("_sap_ui_vbm_shared_ChoroplethRegionBorder")!=undefined){o=s.DefaultRegionColorBorder=i.get("_sap_ui_vbm_shared_ChoroplethRegionBorder")}if(this.getPlugin()){t=window.VBI.Utilities.String2VBColor(t);o=window.VBI.Utilities.String2VBColor(o)}if(t!=this.mColC||o!=this.mColCB){for(var r=0;r<e.length;++r){if(e[r].C===this.mColC){e[r].C=t}if(e[r].CB===this.mColCB){e[r].CB=o}}this.mColC=t;this.mColCB=o}this.mbThemingDirty=false}};s.prototype.isRegionSubscribed=function(e,t){if(t){var i=this.findRegionInAggregation(t);return i&&i.hasListeners(e)}return false};return s});