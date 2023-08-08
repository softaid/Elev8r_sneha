/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(function(){"use strict";var t={};t.render=function(t,e){var i=e.getTooltip_AsString();t.write("<div");t.writeControlData(e);if(i){t.writeAttributeEscaped("title",i)}t.addClass("sapSuiteTc");t.writeClasses();t.addStyle("width",e.getWidth());t.addStyle("height",e.getHeight());if(e.getMinWidth()){t.addStyle("min-width",e.getMinWidth())}if(e.getMinHeight()){t.addStyle("min-height",e.getMinHeight())}t.writeStyles();t.write(">");t.renderControl(e._oRemoveButton);t.write("<nav");t.writeAttribute("id",e.getId()+"-nav-prev");t.addClass("sapSuiteTcNavPrev");t.writeClasses();t.write(">");t.write("</nav>");t.write("<div");t.writeAttribute("id",e.getId()+"-container");t.writeAttribute("tabindex","0");t.writeAccessibilityState(e,{role:"list",live:"assertive",disabled:false});t.addClass("sapSuiteTcContainer");t.writeClasses();t.write(">");t.write("<div");t.writeAttribute("id",e.getId()+"-first");t.writeAttribute("aria-hidden","true");t.addClass("sapSuiteTcPrev");t.writeClasses();t.write(">");t.write("</div>");t.write("<div");t.writeAttribute("id",e.getId()+"-second");t.writeAttribute("aria-hidden","false");t.addClass("sapSuiteTcCenter");t.writeClasses();t.write(">");if(e._oCenterControl){t.renderControl(e._oCenterControl)}t.write("</div>");t.write("<div");t.writeAttribute("id",e.getId()+"-third");t.writeAttribute("aria-hidden","true");t.addClass("sapSuiteTcNext");t.writeClasses();t.write(">");t.write("</div>");t.write("</div>");t.write("<nav");t.writeAttribute("id",e.getId()+"-nav-next");t.addClass("sapSuiteTcNavNext");t.writeClasses();t.write(">");t.write("</nav>");t.write("</div>")};return t},true);