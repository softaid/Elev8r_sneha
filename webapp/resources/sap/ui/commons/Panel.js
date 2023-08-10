/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/base/assert","./library","sap/ui/core/Control","./PanelRenderer","sap/ui/core/ResizeHandler","sap/ui/core/Title","sap/ui/core/Configuration","sap/ui/dom/jquery/scrollLeftRTL"],function(t,e,i,o,s,r,l,n){"use strict";var h=i.enums.BorderDesign;var a=i.enums.AreaDesign;var f=o.extend("sap.ui.commons.Panel",{metadata:{library:"sap.ui.commons",deprecated:true,properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},enabled:{type:"boolean",group:"Behavior",defaultValue:true},scrollLeft:{type:"int",group:"Behavior",defaultValue:0},scrollTop:{type:"int",group:"Behavior",defaultValue:0},applyContentPadding:{type:"boolean",group:"Appearance",defaultValue:true},collapsed:{type:"boolean",group:"Behavior",defaultValue:false},areaDesign:{type:"sap.ui.commons.enums.AreaDesign",group:"Appearance",defaultValue:a.Fill},borderDesign:{type:"sap.ui.commons.enums.BorderDesign",group:"Appearance",defaultValue:h.Box},showCollapseIcon:{type:"boolean",group:"Behavior",defaultValue:true},text:{type:"string",group:"Misc",defaultValue:null}},defaultAggregation:"content",aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"},title:{type:"sap.ui.core.Title",multiple:false},buttons:{type:"sap.ui.commons.Button",multiple:true,singularName:"button"}}}});f.prototype.init=function(){this._oScrollDomRef=null;this._iMaxTbBtnWidth=-1;this._iTbMarginsAndBorders=0;this._iMinTitleWidth=30;this._iOptTitleWidth=30;this._iTitleMargin=0;this._bFocusCollapseIcon=false;this._resizeDelayTimer=null;this._rb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.commons");this.data("sap-ui-fastnavgroup","true",true)};f.prototype.exit=function(){this._rb=undefined};f.prototype.onThemeChanged=function(){if(this.getDomRef()&&this._oTitleDomRef){this.getDomRef().style.minWidth="auto";if(this._oToolbarDomRef){this._oToolbarDomRef.style.width="auto"}this._oTitleDomRef.style.width="auto";this._initializeSizes()}};f.prototype.onBeforeRendering=function(){if(this.sResizeListenerId){r.deregister(this.sResizeListenerId);this.sResizeListenerId=null}};f.prototype.onAfterRendering=function(){this._oScrollDomRef=this.getDomRef("cont");if(!this._oScrollDomRef){return}this._oHeaderDomRef=this.getDomRef("hdr");this._oTitleDomRef=this.getDomRef("title");this._oToolbarDomRef=this.getDomRef("tb");if(this._bFocusCollapseIcon){this._bFocusCollapseIcon=false;var e=this.$("collArrow");if(e.is(":visible")&&(e.css("visibility")=="visible"||e.css("visibility")=="inherit")){e.trigger("focus")}else{var i=this.$("collIco");if(i.is(":visible")&&(i.css("visibility")=="visible"||i.css("visibility")=="inherit")){i.trigger("focus")}}}this._initializeSizes();if(f._isSizeSet(this.getHeight())&&(this._hasIcon()||this.getButtons().length>0)){this._handleResizeNow();this.sResizeListenerId=r.register(this.getDomRef(),t.proxy(this._handleResizeSoon,this))}};f.prototype.getFocusInfo=function(){var t=null;var e=this.getId();if(this._bFocusCollapseIcon){var i=this.$("collArrow");if(i.is(":visible")&&(i.css("visibility")=="visible"||i.css("visibility")=="inherit")){t=i[0].id}else{var o=this.$("collIco");if(o.is(":visible")&&(o.css("visibility")=="visible"||o.css("visibility")=="inherit")){t=o[0].id}}}return{id:t?t:e}};f.prototype.applyFocusInfo=function(e){var i;if(e&&e.id&&(i=t(document.getElementById(e.id)))&&i.length>0){i.trigger("focus")}else{this.focus()}return this};f.prototype._initializeSizes=function(){var e=n.getRTL();var i=this.getButtons();if(i&&i.length>0){var o=0;t(this._oToolbarDomRef).children().each(function(){var t=this.offsetWidth;if(t>o){o=t}});this._iMaxTbBtnWidth=o;if(this._oToolbarDomRef){this._oToolbarDomRef.style.minWidth=o+"px";var s=t(this._oToolbarDomRef);this._iTbMarginsAndBorders=s.outerWidth(true)-s.width()}}var r=this._oTitleDomRef.offsetLeft;var l=this.getDomRef().offsetWidth;if(e){r=l-(r+this._oTitleDomRef.offsetWidth)}var h=t(this._oTitleDomRef);this._iOptTitleWidth=h.width()+1;this._iTitleMargin=h.outerWidth(true)-h.outerWidth();var a=1e4;t(this._oHeaderDomRef).children(".sapUiPanelHdrRightItem").each(function(){var t=this.offsetLeft;if(e){t=l-(t+this.offsetWidth)}if(t<a&&t>0){a=t}});var f=r;f+=this._iMinTitleWidth;f+=this._iMaxTbBtnWidth+1;f+=a==1e4?10:l-a;this.getDomRef().style.minWidth=f+10+"px";if(this._oScrollDomRef){var p=this.getProperty("scrollTop");if(p>0){this._oScrollDomRef.scrollTop=p}var u=this.getProperty("scrollLeft");if(u>0){this._oScrollDomRef.scrollLeft=u}}};f.prototype._fixContentHeight=function(){if(f._isSizeSet(this.getHeight())&&(this._hasIcon()||this.getButtons().length>0)){this._iContTop=this._oHeaderDomRef.offsetHeight;if(this._oScrollDomRef){this._oScrollDomRef.style.top=this._iContTop+"px"}}};f.prototype._handleResizeSoon=function(){if(this._resizeDelayTimer){clearTimeout(this._resizeDelayTimer)}this._resizeDelayTimer=setTimeout(function(){this._handleResizeNow();this._resizeDelayTimer=null}.bind(this),200)};f.prototype._handleResizeNow=function(){this._fixContentHeight()};f.prototype._hasIcon=function(){return this.getTitle()&&this.getTitle().getIcon()};f.prototype.setEnabled=function(e){this.setProperty("enabled",e,true);t(this.getDomRef()).toggleClass("sapUiPanelDis",!e);return this};f.prototype.setApplyContentPadding=function(e){this.setProperty("applyContentPadding",e,true);t(this.getDomRef()).toggleClass("sapUiPanelWithPadding",e);return this};f.prototype.setCollapsed=function(t){this.setProperty("collapsed",t,true);this._setCollapsedState(t);return this};f.prototype._setCollapsedState=function(e){var i=this.getDomRef();if(i){var o=n.getAccessibility();if(e){if(!this.getWidth()){i.style.width=this.getDomRef().offsetWidth+"px"}t(i).addClass("sapUiPanelColl");if(o){i.setAttribute("aria-expanded","false")}if(this.getHeight()){i.style.height="auto"}var s=this._rb.getText("PANEL_EXPAND");this.$("collArrow").attr("title",s);this.$("collIco").attr("title",s)}else{if(!this.getDomRef("cont")){this._bFocusCollapseIcon=true;this.rerender()}else{t(i).removeClass("sapUiPanelColl");if(o){i.setAttribute("aria-expanded","true")}if(!this.getWidth()){i.style.width="auto"}if(this.getHeight()){i.style.height=this.getHeight()}var r=this._rb.getText("PANEL_COLLAPSE");this.$("collArrow").attr("title",r);this.$("collIco").attr("title",r)}}}};f._isSizeSet=function(t){return t&&!(t=="auto")&&!(t=="inherit")};f.prototype.setTitle=function(t){var e=this.getTitle();this.setAggregation("title",t);if(e&&e!==t&&e.getId()===this.getId()+"-tit"){e.destroy()}return this};f.prototype.setText=function(t){if(!this.getTitle()){this.setTitle(new l(this.getId()+"-tit",{text:t}))}else{this.getTitle().setText(t)}return this};f.prototype.getText=function(){if(!this.getTitle()){return""}else{return this.getTitle().getText()}};f.prototype.getScrollLeft=function(){var i=0;if(this._oScrollDomRef){if(n.getRTL()){i=t(this._oScrollDomRef).scrollLeftRTL()}else{i=t(this._oScrollDomRef).scrollLeft()}e(typeof i=="number","scrollLeft read from DOM should be a number");this.setProperty("scrollLeft",i,true)}return i};f.prototype.setScrollLeft=function(e){this.setProperty("scrollLeft",e,true);if(this._oScrollDomRef){if(n.getRTL()){t(this._oScrollDomRef).scrollLeftRTL(e)}else{t(this._oScrollDomRef).scrollLeft(e)}}return this};f.prototype.getScrollTop=function(){var t=0;if(this._oScrollDomRef){t=Math.ceil(this._oScrollDomRef.scrollTop);this.setProperty("scrollTop",t,true)}return t};f.prototype.setScrollTop=function(t){this.setProperty("scrollTop",t,true);if(this._oScrollDomRef){this._oScrollDomRef.scrollTop=t}return this};f.prototype.setDimensions=function(t,i){e(typeof t=="string"&&typeof i=="string","sWidth and sHeight must be strings");this.setWidth(t);this.setHeight(i);return this};f.prototype.setWidth=function(t){this.setProperty("width",t,true);var e=this.getDomRef();if(e){e.style.width=t}return this};f.prototype.setHeight=function(t){this.setProperty("height",t,true);var e=this.getDomRef();if(e){e.style.height=t}return this};f.prototype.onclick=function(t){this._handleTrigger(t)};f.prototype.onsapspace=function(t){this._handleTrigger(t)};f.prototype._handleTrigger=function(t){var e=this.getId();if(t.target.id===e+"-collArrow"||t.target.id===e+"-collIco"||t.target.id===e&&t.type==="sapspace"&&this.getShowCollapseIcon()){this.setCollapsed(!this.getProperty("collapsed"));t.preventDefault();t.stopPropagation();this.fireEvent("collapsedToggled")}};return f});