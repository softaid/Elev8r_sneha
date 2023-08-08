/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./ListItemBaseRenderer","sap/ui/core/Renderer","sap/ui/core/library","sap/ui/Device"],function(t,e,i,s){"use strict";var r=i.TextDirection;var n=e.extend(t);n.apiVersion=2;n.renderAttributeStatus=function(t,e,i,s){if(!i&&!s||i&&i._isEmpty()&&s&&s._isEmpty()){return}t.openStart("div");t.class("sapMObjLAttrRow");t.openEnd();if(i&&!i._isEmpty()){t.openStart("div");t.class("sapMObjLAttrDiv");if(s&&!s._isEmpty()){if(s instanceof Array){t.class("sapMObjAttrWithMarker")}}if(!s||s._isEmpty()){t.style("width","100%")}t.openEnd();t.renderControl(i);t.close("div")}if(s&&!s._isEmpty()){t.openStart("div");t.class("sapMObjLStatusDiv");if(s instanceof Array&&s.length>0){t.class("sapMObjStatusMarker")}if(!i||i._isEmpty()){t.style("width","100%")}t.openEnd();if(s instanceof Array){while(s.length>0){t.renderControl(s.shift())}}else{t.renderControl(s)}t.close("div")}t.close("div")};n.renderLIAttributes=function(t,e){t.class("sapMObjLItem");t.class("sapMObjLListModeDiv")};n.renderLIContent=function(t,e){var i=e.getAggregation("_objectNumber"),s=e.getTitleTextDirection(),n=e.getIntroTextDirection();if(e.getIntro()){t.openStart("div",e.getId()+"-intro");t.class("sapMObjLIntro");t.openEnd();t.openStart("span");if(n!==r.Inherit){t.attr("dir",n.toLowerCase())}t.openEnd();t.text(e.getIntro());t.close("span");t.close("div")}t.openStart("div");t.class("sapMObjLTopRow");t.openEnd();if(e.getIcon()){t.openStart("div");t.class("sapMObjLIconDiv");t.openEnd();t.renderControl(e._getImageControl());t.close("div")}t.openStart("div");t.class("sapMObjLNumberDiv");t.openEnd();if(i&&i.getNumber()){i.setTextDirection(e.getNumberTextDirection());t.renderControl(i)}t.close("div");t.openStart("div");t.style("display","flex");t.style("overflow","hidden");t.openEnd();var o=e._getTitleText();if(o){o.setTextDirection(s);o.setText(e.getTitle());o.addStyleClass("sapMObjLTitle");t.renderControl(o)}t.close("div");t.close("div");t.openStart("div");t.style("clear","both");t.openEnd();t.close("div");if(e._hasBottomContent()){t.openStart("div");t.class("sapMObjLBottomRow");t.openEnd();var a=e._getVisibleAttributes();var d=[];var p=e._getVisibleMarkers();p._isEmpty=function(){return!p.length};if(!p._isEmpty()){d.push(p)}d.push(e.getFirstStatus());d.push(e.getSecondStatus());while(a.length>0){this.renderAttributeStatus(t,e,a.shift(),d.shift())}while(d.length>0){this.renderAttributeStatus(t,e,null,d.shift())}t.close("div")}};n.getAriaLabelledBy=function(t){var e=[],i=t.getFirstStatus(),s=t.getSecondStatus();if(t.getIntro()){e.push(t.getId()+"-intro")}if(t.getTitle()){e.push(t.getId()+"-titleText")}if(t.getNumber()){e.push(t.getId()+"-ObjectNumber")}if(t.getAttributes()){t.getAttributes().forEach(function(t){if(!t._isEmpty()){e.push(t.getId())}})}if(i&&!i._isEmpty()){e.push(i.getId())}if(s&&!s._isEmpty()){e.push(s.getId())}if(t.getMarkers()){t.getMarkers().forEach(function(t){e.push(t.getId()+"-text")})}return e.join(" ")};return n},true);