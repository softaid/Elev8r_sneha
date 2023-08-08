/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Configuration"],function(t){"use strict";var e={};e.render=function(e,i){var r=t.getAccessibility();var a=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");e.write('<span id="'+i.getId()+'-Descr" style="visibility: hidden; display: none; outline: none;">');e.writeEscaped(a.getText("IMAGEMAP_DSC"));e.write("</span>");e.write("<map tabindex='-1'");e.writeControlData(i);e.writeAttributeEscaped("name",i.getName());if(i.getTooltip_AsString()){e.writeAttributeEscaped("title",i.getTooltip_AsString())}e.write(">");var s=i.getAreas();for(var n=0,o=s.length;n<o;n++){e.write("<area ");e.writeElementData(s[n]);e.write(' style="display: inline;"');if(r){e.writeAttribute("aria-describedby",i.getId()+"-Descr")}var d=s[n].getShape();var p=s[n].getCoords();var u=s[n].getHref();var l=s[n].getAlt();var c=s[n].getTooltip_AsString();if(d==="rect"||d==="circle"||d==="poly"){e.writeAttribute("shape",d)}else{e.writeAttribute("shape","default")}if(p){e.writeAttributeEscaped("coords",p)}if(u){e.writeAttributeEscaped("href",u)}if(l){e.writeAttributeEscaped("alt",l)}if(c){e.writeAttributeEscaped("title",c)}e.writeAttribute("tabindex",0);e.write(">")}e.write("</map>")};return e},true);