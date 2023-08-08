/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer","sap/ui/core/ValueStateSupport","sap/ui/core/library","sap/ui/Device"],function(e,t,a,r){"use strict";var i=a.ValueState;var s=a.Design;var d=a.ImeMode;var l={};l.render=function(e,a){var i=a.getWidth();var n=t.enrichTooltip(a,a.getTooltip_AsString());var o=a._getRenderOuter();if(o){e.write("<div");e.writeControlData(a);e.addClass("sapUiTfBack");this.renderStyles(e,a);if(n){e.writeAttributeEscaped("title",n)}var f;if(i&&i!=""){f="width: "+i+";"}if(this.renderOuterAttributes){this.renderOuterAttributes(e,a)}if(f){e.writeAttribute("style",f)}e.writeStyles();e.writeClasses();e.write(">");if(this.renderOuterContentBefore){this.renderOuterContentBefore(e,a)}}if(this.getInnerTagName){e.write("<"+this.getInnerTagName())}else{e.write("<input")}e.addClass("sapUiTf");if(!o){e.writeControlData(a);e.addClass("sapUiTfBack");this.renderStyles(e,a);if(i&&i!=""){e.addStyle("width",i)}}else{e.writeAttribute("id",a.getId()+"-input");e.addClass("sapUiTfInner");e.addStyle("width","100%")}if(n){e.writeAttributeEscaped("title",n)}if(a.getName()){e.writeAttributeEscaped("name",a.getName())}if(!a.getEditable()&&a.getEnabled()){e.writeAttribute("readonly","readonly")}if(this.renderTextFieldEnabled){this.renderTextFieldEnabled(e,a)}else if(!a.getEnabled()){e.writeAttribute("disabled","disabled");e.writeAttribute("tabindex","-1")}else if(!a.getEditable()){e.writeAttribute("tabindex","0")}else{e.writeAttribute("tabindex","0")}var u=a.getTextDirection();if(u){e.addStyle("direction",u.toLowerCase())}var c=l.getTextAlign(a.getTextAlign(),u);if(c){e.addStyle("text-align",c)}switch(a.getImeMode()){case d.Inactive:e.addStyle("ime-mode","inactive");break;case d.Active:e.addStyle("ime-mode","active");break;case d.Disabled:e.addStyle("ime-mode","disabled");break}if(a.getDesign()==s.Monospace){e.addClass("sapUiTfMono")}if(a.getMaxLength()){e.writeAttribute("maxlength",a.getMaxLength())}if(this.renderInnerAttributes){this.renderInnerAttributes(e,a)}if(this.renderARIAInfo){this.renderARIAInfo(e,a)}var p=a.getPlaceholder();if(p){if(this.convertPlaceholder){p=this.convertPlaceholder(a)}if(r.support.input.placeholder){e.writeAttributeEscaped("placeholder",p)}}e.writeStyles();e.writeClasses();if(this.getInnerTagName){e.write(">")}else{e.write(' value="');if(!r.support.input.placeholder&&p&&!a.getValue()){e.writeEscaped(p)}else{e.writeEscaped(a.getValue())}e.write('"');e.write(">")}if(this.getInnerTagName){if(this.renderInnerContent){this.renderInnerContent(e,a)}e.write("</"+this.getInnerTagName()+">")}if(o){if(this.renderOuterContent){this.renderOuterContent(e,a)}e.write("</div>")}};l.renderStyles=function(e,t){e.addClass("sapUiTfBrd");if(t.getEnabled()){if(!t.getEditable()){e.addClass("sapUiTfRo")}else{e.addClass("sapUiTfStd")}}else{e.addClass("sapUiTfDsbl")}switch(t.getValueState()){case i.Error:e.addClass("sapUiTfErr");break;case i.Success:e.addClass("sapUiTfSucc");break;case i.Warning:e.addClass("sapUiTfWarn");break}if(t.getRequired()){e.addClass("sapUiTfReq")}if(t.getPlaceholder()&&!r.support.input.placeholder){e.addClass("sapUiTfPlace")}};l.onfocus=function(e){var t=e.$();var a;t.addClass("sapUiTfFoc");if(!r.support.input.placeholder&&!e.getValue()&&e.getPlaceholder()){if(e._getRenderOuter()){a=e.$("input")}else{a=t}t.removeClass("sapUiTfPlace");a.val("")}};l.onblur=function(e){var t=e.$();var a;t.removeClass("sapUiTfFoc");var i=e.getPlaceholder();if(!r.support.input.placeholder){if(e._getRenderOuter()){a=e.$("input")}else{a=t}if(!a.val()&&i){t.addClass("sapUiTfPlace");if(this.convertPlaceholder){i=this.convertPlaceholder(e)}a.val(i)}}};l.setValueState=function(e,a,r){var s=e.$();var d;var l=e._getRenderOuter();if(l){d=e.$("input")}else{d=s}switch(a){case i.Error:s.removeClass("sapUiTfErr");d.removeAttr("aria-invalid");break;case i.Success:s.removeClass("sapUiTfSucc");break;case i.Warning:s.removeClass("sapUiTfWarn");break}switch(r){case i.Error:s.addClass("sapUiTfErr");d.attr("aria-invalid",true);break;case i.Success:s.addClass("sapUiTfSucc");break;case i.Warning:s.addClass("sapUiTfWarn");break}var n=t.enrichTooltip(e,e.getTooltip_AsString());if(n){s.attr("title",n);if(l){e.$("input").attr("title",n)}}else{s.removeAttr("title");if(l){e.$("input").removeAttr("title")}}};l.setEditable=function(e,t){if(!e.getEnabled()){return}var a=e.$();var r;if(e._getRenderOuter()){r=e.$("input")}else{r=a}if(t){a.removeClass("sapUiTfRo").addClass("sapUiTfStd");r.removeAttr("readonly");r.removeAttr("aria-readonly")}else{a.removeClass("sapUiTfStd").addClass("sapUiTfRo");r.attr("readonly","readonly");r.attr("aria-readonly",true)}};l.setEnabled=function(e,t){var a=e.$();var r;if(e._getRenderOuter()){r=e.$("input")}else{r=a}if(t){if(e.getEditable()){a.removeClass("sapUiTfDsbl").addClass("sapUiTfStd").removeAttr("aria-disabled");r.removeAttr("disabled").removeAttr("aria-disabled").attr("tabindex","0")}else{a.removeClass("sapUiTfDsbl").addClass("sapUiTfRo").removeAttr("aria-disabled");r.removeAttr("disabled").removeAttr("aria-disabled").attr("tabindex","0").attr("readonly","readonly").attr("aria-readonly",true)}}else{if(e.getEditable()){a.removeClass("sapUiTfStd").addClass("sapUiTfDsbl").attr("aria-disabled","true");r.attr("disabled","disabled").attr("aria-disabled","true").attr("tabindex","-1")}else{a.removeClass("sapUiTfRo").addClass("sapUiTfDsbl").attr("aria-disabled","true");r.removeAttr("readonly").removeAttr("aria-readonly").attr("disabled","disabled").attr("aria-disabled","true").attr("tabindex","-1")}}};l.removeValidVisualization=function(e){var t=e.$();if(t){t.removeClass("sapUiTfSucc")}else{setTimeout(function(){l.removeValidVisualization(e)},1e3)}};l.setDesign=function(e,t){e.$().toggleClass("sapUiTfMono",t==s.Monospace)};l.setRequired=function(e,t){var a;if(e._getRenderOuter()){a=e.$("input")}else{a=e.$()}e.$().toggleClass("sapUiTfReq",t);if(t){a.attr("aria-required",true)}else{a.removeAttr("aria-required")}};l.renderARIAInfo=function(e,t){var a={role:t.getAccessibleRole().toLowerCase(),multiline:false,autocomplete:"none"};if(t.getValueState()==i.Error){a["invalid"]=true}e.writeAccessibilityState(t,a)};l.getTextAlign=e.getTextAlign;return l},true);