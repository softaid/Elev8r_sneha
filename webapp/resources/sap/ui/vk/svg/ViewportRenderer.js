/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Element","../abgrToColor"],function(e,t){"use strict";var o={apiVersion:2};o.render=function(o,r){o.openStart("div",r);o.class("sapVizKitViewport");o.attr("tabindex",0);o.attr("aria-label","Image");o.attr("role","figure");o.style("width",r.getWidth());o.style("height",r.getHeight());o.style("background-image","linear-gradient("+r.getBackgroundColorTop()+","+r.getBackgroundColorBottom()+")");o.openEnd();o.openStart("canvas");o.style("display","none");o.openEnd();o.close("canvas");o.openStart("svg");o.attr("id",r.getId()+"-svg");o.attr("width","100%");o.attr("height","100%");o.attr("viewBox",r._getViewBox().join(" "));o.style("position","absolute");o.openEnd();var a=r.getScene();if(a){var n=r._getViewStateManagerSVG();var i=new Map;var s=t(n._highlightColorABGR);var l=t(r.getHotspotColorABGR());i.set(e._hotspotEffectName(s),s);i.set(e._hotspotEffectName(l),l);var d=a.getDefaultNodeHierarchy();d.getHotspotNodeIds().forEach(function(e){var t=e.getHotspotEffectDef();i.set(t.name,t.color)});i.forEach(function(e,t){o.openStart("filter");o.attr("id",t);o.openEnd();o.openStart("feColorMatrix");o.attr("in","SourceGraphic");o.attr("type","matrix");o.attr("values","0 0 0 0 "+e.red/255+", 0 0 0 0 "+e.green/255+", 0 0 0 0 "+e.blue/255+", 0 0 0 "+e.alpha+" 0");o.openEnd();o.close("feColorMatrix");o.close("filter")});a.getRootElement().render(o,n?n._mask:-1|0,r)}r._selectionRect.render(o,0|0);if(r._styles.size>0){o.openStart("defs");o.openEnd();o.openStart("style");o.openEnd();r._styles.forEach(function(e,t){o.text("."+t+"{\n");for(var r=0;r<e.length;r+=2){o.text(e[r]+":"+e[r+1]+";\n")}o.text("}\n")});o.close("style");o.close("defs")}o.close("svg");r.renderTools(o);r.renderContent(o);o.close("div")};return o},true);