/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/Core","./ObjectPageSectionBase","./ObjectPageLazyLoader","./BlockBase","sap/m/Button","sap/ui/core/StashedControlSupport","sap/ui/base/ManagedObjectObserver","sap/m/TitlePropagationSupport","./library","sap/m/library","./ObjectPageSubSectionRenderer","sap/base/Log","sap/ui/base/DataType","sap/ui/events/KeyCodes","sap/ui/dom/jquery/Focusable"],function(t,e,o,i,r,s,n,a,u,g,l,c,p,h,f){"use strict";var d=l.ButtonType;var y=g.ObjectPageSubSectionMode;var _=g.ObjectPageSubSectionLayout;var b=o.extend("sap.uxap.ObjectPageSubSection",{metadata:{library:"sap.uxap",properties:{showTitle:{type:"boolean",group:"Appearance",defaultValue:true},_columnSpan:{type:"string",group:"Appearance",defaultValue:"all",visibility:"hidden"},mode:{type:"sap.uxap.ObjectPageSubSectionMode",group:"Appearance",defaultValue:y.Collapsed},titleUppercase:{type:"boolean",group:"Appearance",defaultValue:false}},defaultAggregation:"blocks",aggregations:{blocks:{type:"sap.ui.core.Control",multiple:true,singularName:"block"},moreBlocks:{type:"sap.ui.core.Control",multiple:true,singularName:"moreBlock"},actions:{type:"sap.ui.core.Control",multiple:true,singularName:"action"}},designtime:"sap/uxap/designtime/ObjectPageSubSection.designtime"},renderer:c});u.call(b.prototype,"blocks",function(){return this._getTitleDomId()});b.FIT_CONTAINER_CLASS="sapUxAPObjectPageSubSectionFitContainer";b.COLUMN_SPAN={all:"all",auto:"auto"};b._getLibraryResourceBundle=function(){return e.getLibraryResourceBundle("sap.uxap")};b.prototype.init=function(){o.prototype.init.call(this);this._aStashedControls=[];this._bRenderedFirstTime=false;this._aAggregationProxy={blocks:[],moreBlocks:[]};this._$spacer=[];this._sContainerSelector=".sapUxAPBlockContainer";this._sMoreContainerSelector=".sapUxAPSubSectionSeeMoreContainer";this._oObserver=new a(b.prototype._observeChanges.bind(this));this._oObserver.observe(this,{aggregations:["actions"]});this._oBlocksObserver=new a(this._onBlocksChange.bind(this));this._switchSubSectionMode(this.getMode());this._initTitlePropagationSupport();this._sBorrowedTitleDomId=false;this._height=""};b.prototype.getParent=function(){var t=o.prototype.getParent.apply(this,arguments);if(t&&t.isA("sap.ui.layout.Grid")){t=t.getParent()}return t};b.prototype._getColumnSpan=function(){return this.getProperty("_columnSpan")};b.prototype._setColumnSpan=function(t){var e=this.getProperty("_columnSpan"),o;if(e===t){return}this.setProperty("_columnSpan",t);o=this.getParent();o&&o.invalidate();return this};b.prototype._getHeight=function(){return this._height};b.prototype._setHeight=function(t){var e,o;if(this._height===t){return}e=h.getType("sap.ui.core.CSSSize");if(!e.isValid(t)){throw new Error('"'+t+'" is of type '+typeof t+", expected "+e.getName()+' for property "_height" of '+this)}this._height=t;o=this.getDomRef();if(o){o.style.height=t}};b.prototype.getSectionText=function(t){return b._getLibraryResourceBundle().getText("SUBSECTION_CONTROL_NAME")};b.prototype._getTitleDomId=function(){if(this._sBorrowedTitleDomId){return this._sBorrowedTitleDomId}if(!this.getTitle().trim()){return false}if(this._getInternalTitleVisible()){return this.getId()+"-headerTitle"}return false};b.prototype._setBorrowedTitleDomId=function(t){this._sBorrowedTitleDomId=t};b.prototype._toggleMultiLineSectionContent=function(t){this.toggleStyleClass("sapUxAPObjectPageSectionMultilineContent",t);this._bMultiLine=t};b.prototype._expandSection=function(){o.prototype._expandSection.call(this);var t=this.getParent();t&&typeof t._expandSection==="function"&&t._expandSection();return this};b.prototype._hasVisibleActions=function(){var t=this.getActions()||[];if(t.length===0){return false}return t.filter(function(t){return t.getVisible()}).length>0};b.prototype._observeChanges=function(t){var e=t.object,o=t.name,i=t.mutation,r=t.child,s;if(e===this){if(o==="actions"){if(i==="insert"){this._observeAction(r)}else if(i==="remove"){this._unobserveAction(r)}}}else if(o==="visible"){s=this._getInternalTitleVisible()&&this.getTitle().trim()!=="";if(!s){this.$("header").toggleClass("sapUiHidden",!this._hasVisibleActions())}}};b.prototype._onBlocksChange=function(){var t=this._getObjectPageLayout();if(!this._bRenderedFirstTime){return}this._applyLayout(t)};b.prototype._observeAction=function(t){this._oObserver.observe(t,{properties:["visible"]})};b.prototype._unobserveAction=function(t){this._oObserver.unobserve(t,{properties:["visible"]})};["addStyleClass","toggleStyleClass","removeStyleClass"].forEach(function(t){b.prototype[t]=function(e,i){if(e===b.FIT_CONTAINER_CLASS){this._notifyObjectPageLayout()}return o.prototype[t].apply(this,arguments)}});b.prototype._unStashControls=function(){var t;this._aStashedControls.forEach(function(o){o.control.unstash();t=e.byId(o.control.getId());this.addAggregation(o.aggregationName,t,true)}.bind(this));this._aStashedControls=[]};b.prototype.connectToModels=function(){var t=this.getBlocks()||[],e=this.getMoreBlocks()||[],o=this.getMode();this._unStashControls();t.forEach(function(t){if(t instanceof r){if(!t.getMode()){t.setMode(o)}t.connectToModels()}});if(e.length>0&&o===y.Expanded){e.forEach(function(t){if(t instanceof r){if(!t.getMode()){t.setMode(o)}t.connectToModels()}})}};b.prototype._allowPropagationToLoadedViews=function(t){var e=this.getBlocks()||[],o=this.getMoreBlocks()||[];e.forEach(function(e){if(e instanceof r){e._allowPropagationToLoadedViews(t)}});o.forEach(function(e){if(e instanceof r){e._allowPropagationToLoadedViews(t)}})};b.prototype.clone=function(){Object.keys(this._aAggregationProxy).forEach(function(t){var e=this.mAggregations[t];if(!e||e.length===0){this.mAggregations[t]=this._aAggregationProxy[t]}},this);return o.prototype.clone.apply(this,arguments)};b.prototype._cleanProxiedAggregations=function(){var t=this._aAggregationProxy;Object.keys(t).forEach(function(e){t[e].forEach(function(t){t.destroy()})})};b.prototype._unobserveBlocks=function(){var t=this.getBlocks().concat(this.getMoreBlocks());t.forEach(function(t){t&&this._oBlocksObserver.unobserve(t,{properties:["visible"]})},this)};b.prototype.exit=function(){if(this._oSeeMoreButton){this._oSeeMoreButton.destroy();this._oSeeMoreButton=null}if(this._oSeeLessButton){this._oSeeLessButton.destroy();this._oSeeLessButton=null}this._unobserveBlocks();this._oCurrentlyVisibleSeeMoreLessButton=null;this._cleanProxiedAggregations();if(o.prototype.exit){o.prototype.exit.call(this)}};b.prototype.onAfterRendering=function(){var t=this._getObjectPageLayout();if(o.prototype.onAfterRendering){o.prototype.onAfterRendering.call(this)}if(!t){return}this._$spacer=t.$("spacer");if(this._bShouldFocusSeeMoreLessButton&&document.activeElement===document.body){this._oCurrentlyVisibleSeeMoreLessButton.focus()}this._bShouldFocusSeeMoreLessButton=false};b.prototype.onBeforeRendering=function(){var t=this._getObjectPageLayout();if(!t){return}if(o.prototype.onBeforeRendering){o.prototype.onBeforeRendering.call(this)}this._setAggregationProxy();this._getGrid().removeAllContent();this._applyLayout(t);this.refreshSeeMoreVisibility()};b.prototype._applyLayout=function(t){var e,o=this._getGrid(),i=o.getAggregation("content"),r=this.getMode(),s=t.getSubSectionLayout(),n=this._calculateLayoutConfiguration(s,t),a=this.getBlocks(),u=a.concat(this.getMoreBlocks());this._oLayoutConfig=n;this._resetLayoutData(u);if(r===y.Expanded){e=u}else{e=a}this._assignLayoutData(e,n);try{e.forEach(function(t){this._setBlockMode(t,r);if(!i||i&&i.indexOf(t)<0){o.addAggregation("content",t,true)}},this)}catch(t){p.error("ObjectPageSubSection :: error while building layout "+s+": "+t)}return this};b.prototype._calculateLayoutConfiguration=function(t,e){var o={M:2,L:3,XL:4},i=o.L,r=o.XL,s=t===_.TitleOnLeft,n=e.getUseTwoColumnsForLargeScreen();if(s){i-=1;r-=1}if(n){i-=1}o.L=i;o.XL=r;return o};b.prototype.refreshSeeMoreVisibility=function(){var t=this._getSeeMoreButton(),e=this._getSeeLessButton();this._bBlockHasMore=!!this.getMoreBlocks().length;if(!this._bBlockHasMore){this._bBlockHasMore=this.getBlocks().some(function(t){if(t instanceof r&&t.getVisible()&&t.getShowSubSectionMore()){return true}})}this.toggleStyleClass("sapUxAPObjectPageSubSectionWithSeeMore",this._bBlockHasMore);t.toggleStyleClass("sapUxAPSubSectionSeeMoreButtonVisible",this._bBlockHasMore);e.toggleStyleClass("sapUxAPSubSectionSeeMoreButtonVisible",this._bBlockHasMore);return this._bBlockHasMore};b.prototype.setMode=function(t){if(this.getMode()!==t){this._switchSubSectionMode(t);if(this._bRenderedFirstTime){this.rerender()}}return this};b.prototype.onkeydown=function(t){if(t.keyCode===f.SPACE&&t.srcControl.isA("sap.uxap.ObjectPageSubSection")){t.preventDefault()}if(t.keyCode===f.F7){t.stopPropagation();var o=e.byId(t.target.id);if(o instanceof b){this._handleSubSectionF7()}else{this._handleInteractiveElF7();this._oLastFocusedControlF7=o}}};b.prototype._handleInteractiveElF7=function(){if(this.getParent().getSubSections().length>1){this.$().trigger("focus")}else{this.getParent().$().trigger("focus")}};b.prototype._handleSubSectionF7=function(t){if(this._oLastFocusedControlF7){this._oLastFocusedControlF7.$().trigger("focus")}else{this.$().firstFocusableDomRef().focus()}};b.prototype._getMinRequiredColspan=function(){var t=this._getColumnSpan(),e,o,i;if(t===b.COLUMN_SPAN.auto){e=this.getBlocks().concat(this.getMoreBlocks());o=e.filter(function(t){return t.getVisible&&t.getVisible()});return o.reduce(function(t,e){return t+this._getMinRequiredColspanForChild(e)}.bind(this),0)}i=parseInt(t);if(i>0&&i<=4){return i}return 4};b.prototype._getMinRequiredColspanForChild=function(t){var e=1;if(!t){e=0}else if(t instanceof r&&t.getColumnLayout()!="auto"){e=parseInt(t.getColumnLayout())}return e};b.prototype._allowAutoextendColspanForChild=function(t){return this._hasAutoLayout(t)};b.prototype._hasAutoLayout=function(t){return!(t instanceof r)||t.getColumnLayout()=="auto"};b.prototype._setAggregationProxy=function(){var e;if(this._bRenderedFirstTime){return}t.each(this._aAggregationProxy,t.proxy(function(t,o){e=this.removeAllAggregation(t,true);e.forEach(this._onAddBlock,this);this._setAggregation(t,e,true)},this));this._bRenderedFirstTime=true};b.prototype.hasProxy=function(t){return this._bRenderedFirstTime&&this._aAggregationProxy.hasOwnProperty(t)};b.prototype._getAggregation=function(t){return this._aAggregationProxy[t]};b.prototype._setAggregation=function(t,e,o){this._aAggregationProxy[t]=e;if(o!==true){this._notifyObjectPageLayout();this.invalidate()}return this._aAggregationProxy[t]};b.prototype.addAggregation=function(t,e,s){var n;if(e instanceof i){if(e.isStashed()){this._aStashedControls.push({aggregationName:t,control:e})}else{e.getContent().forEach(function(e){this.addAggregation(t,e)},this);e.removeAllContent();e.destroy();this.invalidate()}}else if(this.hasProxy(t)){n=this._getAggregation(t);n.push(e);this._onAddBlock(e);this._setAggregation(t,n,s);if(e instanceof r||e instanceof i){e.setParent(this)}}else{o.prototype.addAggregation.apply(this,arguments)}return this};b.prototype.insertBlock=function(t,e){p.warning("ObjectPageSubSection :: usage of insertBlock is not supported - addBlock is performed instead.");return this.addAggregation("blocks",t)};b.prototype._onAddBlock=function(t){t&&this._oBlocksObserver.observe(t,{properties:["visible"]})};b.prototype._onRemoveBlock=function(t){t&&this._oBlocksObserver.unobserve(t,{properties:["visible"]})};b.prototype.insertMoreBlock=function(t,e){p.warning("ObjectPageSubSection :: usage of insertMoreBlock is not supported - addMoreBlock is performed instead.");return this.addAggregation("moreBlocks",t)};b.prototype.removeAllAggregation=function(t,e){var i;if(this.hasProxy(t)){i=this._getAggregation(t);this._unobserveBlocks();this._setAggregation(t,[],e);return i.slice()}return o.prototype.removeAllAggregation.apply(this,arguments)};b.prototype.removeAggregation=function(t,e){var i=false,r;if(this.hasProxy(t)){r=this._getAggregation(t);r.forEach(function(o,s){if(o.getId()===e.getId()){r.splice(s,1);this._onRemoveBlock(e);this._setAggregation(t,r);i=true}return!i},this);return i?e:null}return o.prototype.removeAggregation.apply(this,arguments)};b.prototype.indexOfAggregation=function(t,e){var i=-1;if(this.hasProxy(t)){this._getAggregation(t).some(function(t,o){if(t.getId()===e.getId()){i=o;return true}},this);return i}return o.prototype.indexOfAggregation.apply(this,arguments)};b.prototype.getAggregation=function(t){if(this.hasProxy(t)){return this._getAggregation(t)}return o.prototype.getAggregation.apply(this,arguments)};b.prototype.destroyAggregation=function(t){if(this.hasProxy(t)){this._getAggregation(t).forEach(function(t){t.destroy()});this._setAggregation(t,[]);return this}return o.prototype.destroyAggregation.apply(this,arguments)};b.prototype.destroy=function(){this._aStashedControls.forEach(function(t){t.control.destroy()});o.prototype.destroy.apply(this,arguments)};b.prototype._getSeeMoreButton=function(){if(!this._oSeeMoreButton){this._oSeeMoreButton=new s(this.getId()+"--seeMore",{type:d.Transparent,iconFirst:false,text:b._getLibraryResourceBundle().getText("SHOW_MORE")}).addStyleClass("sapUxAPSubSectionSeeMoreButton").attachPress(this._seeMoreLessControlPressHandler,this)}return this._oSeeMoreButton};b.prototype._getSeeLessButton=function(){if(!this._oSeeLessButton){this._oSeeLessButton=new s(this.getId()+"--seeLess",{type:d.Transparent,iconFirst:false,text:b._getLibraryResourceBundle().getText("SHOW_LESS")}).addStyleClass("sapUxAPSubSectionSeeMoreButton").attachPress(this._seeMoreLessControlPressHandler,this)}return this._oSeeLessButton};b.prototype._seeMoreLessControlPressHandler=function(t){var e=this.getMode(),o,i=this.getMoreBlocks()||[];if(e===y.Expanded){o=y.Collapsed}else{o=y.Expanded;i.forEach(function(t){if(t instanceof r){t.setMode(e);t.connectToModels()}},this)}this._switchSubSectionMode(o);this._bShouldFocusSeeMoreLessButton=true};b.prototype._switchSubSectionMode=function(t){t=this.validateProperty("mode",t);if(t===y.Collapsed){this.setProperty("mode",y.Collapsed);this._oCurrentlyVisibleSeeMoreLessButton=this._getSeeMoreButton().setVisible(true);this._getSeeLessButton().setVisible(false)}else{this.setProperty("mode",y.Expanded);this._getSeeMoreButton().setVisible(false);this._oCurrentlyVisibleSeeMoreLessButton=this._getSeeLessButton().setVisible(true)}};b.prototype._setBlockMode=function(t,e){if(t instanceof r){t.setMode(e)}else{p.debug("ObjectPageSubSection :: cannot propagate mode "+e+" to "+t.getMetadata().getName())}};b.prototype._setToFocusable=function(t){var e="0",o="-1",i="tabindex";if(t){this.$().attr(i,e)}else{this.$().attr(i,o)}return this};b.prototype._getUseTitleOnTheLeft=function(){var t=this._getObjectPageLayout();return t&&t.getSubSectionLayout()===_.TitleOnLeft};b.prototype._updateShowHideState=function(t){if(this._getIsHidden()===t){return this}this.$().children(this._sMoreContainerSelector).toggle(!t);return o.prototype._updateShowHideState.call(this,t)};b.prototype.getVisibleBlocksCount=function(){var t=this._aStashedControls.length;(this.getBlocks()||[]).forEach(function(e){if(e.getVisible&&!e.getVisible()){return true}t++});(this.getMoreBlocks()||[]).forEach(function(e){if(e.getVisible&&!e.getVisible()){return true}t++});return t};return b});