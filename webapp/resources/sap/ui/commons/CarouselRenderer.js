/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Configuration"],function(t){"use strict";var e={};e.render=function(e,i){var r=t.getRTL();e.write("<div");e.addClass("sapUiCrsl");if(i.getWidth()!=""){e.addStyle("width",i.getWidth())}if(i.getHeight()!=""){e.addStyle("height",i.getHeight())}e.writeStyles();e.writeClasses();e.writeControlData(i);e.write(">");var s=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");e.write("<div");e.writeAttribute("id",i.getId()+"-prevbutton");e.writeAttribute("title",s.getText("CAROUSEL_SHOW_PREV"));e.addClass("sapUiCrslPrevBtn");e.writeClasses();if(i.getHandleSize()!=22){if(i.getOrientation()=="vertical"){e.addStyle("height",i.getHandleSize()+"px")}else{e.addStyle("width",i.getHandleSize()+"px")}e.writeStyles()}e.write(">");if(i.getOrientation()=="vertical"){e.write("&#9650")}else{if(r){e.write("&#9658")}else{e.write("&#9668")}}e.write("</div>");e.write("<div");e.writeAttribute("id",i.getId()+"-nextbutton");e.writeAttribute("title",s.getText("CAROUSEL_SHOW_NEXT"));e.addClass("sapUiCrslNextBtn");e.writeClasses();if(i.getHandleSize()!=22){if(i.getOrientation()=="vertical"){e.addStyle("height",i.getHandleSize()+"px")}else{e.addStyle("width",i.getHandleSize()+"px")}e.writeStyles()}e.write(">");if(i.getOrientation()=="vertical"){e.write("&#9660")}else{if(r){e.write("&#9668")}else{e.write("&#9658")}}e.write("</div>");e.write("<div");e.writeAttribute("id",i.getId()+"-contentarea");e.addClass("sapUiCrslCnt");e.writeClasses();e.write(">");var a=i.getContent();e.write("<ul");e.writeAttribute("id",i.getId()+"-scrolllist");e.writeAttribute("role","listbox");e.writeAttribute("aria-describedby",i.getId()+"-navigate");e.addClass("sapUiCrslScl");e.writeClasses();e.write(">");for(var d=0;d<a.length;d++){var l=a[d];e.write("<li");e.writeAttribute("id",i.getId()+"-item-"+l.getId());e.writeAccessibilityState(i,{role:"option",posinset:d+1,setsize:a.length,labelledby:i.getId()+"-toggleaction"});e.writeAttribute("tabindex","-1");e.addClass("sapUiCrslItm");e.writeClasses();e.write(">");e.renderControl(l);e.write("</li>")}e.write("</ul>");e.write("</div>");e.write("<div");e.writeAttribute("tabindex","0");e.addClass("sapUiCrslBefore");e.writeClasses();e.write("></div>");e.write("<div");e.writeAttribute("tabindex","0");e.addClass("sapUiCrslAfter");e.writeClasses();e.write("></div>");e.write("<span");e.writeAttribute("id",i.getId()+"-toggleaction");e.addStyle("position","absolute");e.addStyle("top","-20000px");e.writeStyles();e.write(">");e.write(s.getText("CAROUSEL_ACTION_MODE"));e.write("</span>");e.write("<span");e.writeAttribute("id",i.getId()+"-navigate");e.addStyle("position","absolute");e.addStyle("top","-20000px");e.writeStyles();e.write(">");e.write(s.getText("CAROUSEL_NAV"));e.write("</span>");e.write("</div>")};return e},true);