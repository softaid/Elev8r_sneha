/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/ValueStateSupport","sap/ui/core/library"],function(e,t){"use strict";var i=t.TextDirection;var a=t.ValueState;var r=t.AccessibleRole;var s={};s.render=function(t,i){t.addClass("sapUiCb");t.write("<span");t.writeControlData(i);t.writeAccessibilityState(i,{role:r.Checkbox.toLowerCase()});t.writeAttributeEscaped("aria-labelledby",i.getId()+"-label");var s=i.getEnabled()!=null&&i.getEnabled();var d=i.getEditable()!=null&&i.getEditable();var l=false;var b=false;if(i.getValueState()!=null){l=a.Error==i.getValueState();b=a.Warning==i.getValueState()}if(i.getChecked()){t.addClass("sapUiCbChk")}var n=0;if(!d){t.addClass("sapUiCbRo");n=0}if(!s){t.addClass("sapUiCbDis");n=-1}if(l){t.addClass("sapUiCbErr");t.writeAttribute("aria-invalid","true")}else if(b){t.addClass("sapUiCbWarn")}if(s&&d&&!l&&!b){t.addClass("sapUiCbStd")}if(s&&d){t.addClass("sapUiCbInteractive")}t.writeClasses();if(i.getWidth()&&i.getWidth()!=""){t.writeAttribute("style","width:"+i.getWidth()+";")}t.writeAttribute("tabindex",n);t.write(">");t.write("<input type='CheckBox' tabindex='-1' id='");t.write(i.getId());t.write("-CB'");if(i.getName()){t.writeAttributeEscaped("name",i.getName())}if(i.getChecked()){t.write(" checked='checked'")}if(!s){t.write(" disabled='disabled'")}var w=e.enrichTooltip(i,i.getTooltip_AsString());if(w){t.writeAttributeEscaped("title",w)}if(!d){t.write(" disabled='disabled'")}t.write(">");t.write("<label");t.writeAttributeEscaped("id",i.getId()+"-label");if(w){t.writeAttributeEscaped("title",w)}t.writeAttribute("for",i.getId()+"-CB");if(!i.getText()){t.write(" class='sapUiCbNoText'")}t.write(">");if(i.getText()){this.renderText(t,i.getText(),i.getTextDirection())}t.write("</label>");t.write("</span>")};s.renderText=function(e,t,a){if(!a||a==i.Inherit){e.writeEscaped(t)}else{e.write('<span style="direction:'+a.toLowerCase()+';">');e.writeEscaped(t);e.write("</span>")}};return s},true);