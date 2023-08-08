/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./BaseHeader","./NumericIndicators","sap/m/Text","sap/f/cards/NumericHeaderRenderer"],function(t,e,i,s){"use strict";var a=t.extend("sap.f.cards.NumericHeader",{metadata:{library:"sap.f",interfaces:["sap.f.cards.IHeader"],properties:{title:{type:"string",group:"Appearance"},titleMaxLines:{type:"int",defaultValue:3},subtitle:{type:"string",group:"Appearance"},subtitleMaxLines:{type:"int",defaultValue:2},statusText:{type:"string",defaultValue:""},unitOfMeasurement:{type:"string",group:"Data"},number:{type:"string",group:"Data"},numberVisible:{type:"boolean",defaultValue:true},scale:{type:"string",group:"Data"},trend:{type:"sap.m.DeviationIndicator",group:"Appearance",defaultValue:"None"},state:{type:"sap.m.ValueColor",group:"Appearance",defaultValue:"Neutral"},details:{type:"string",group:"Appearance"},detailsMaxLines:{type:"int",defaultValue:1},sideIndicatorsAlignment:{type:"sap.f.cards.NumericHeaderSideIndicatorsAlignment",group:"Appearance",defaultValue:"Begin"}},aggregations:{sideIndicators:{type:"sap.f.cards.NumericSideIndicator",multiple:true,forwarding:{getter:"_getNumericIndicators",aggregation:"sideIndicators"}},_title:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_subtitle:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_unitOfMeasurement:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_details:{type:"sap.m.Text",multiple:false,visibility:"hidden"},_numericIndicators:{type:"sap.f.cards.NumericIndicators",multiple:false,visibility:"hidden"}},events:{press:{}}},renderer:s});a.prototype.init=function(){t.prototype.init.apply(this,arguments);this.data("sap-ui-fastnavgroup","true",true)};a.prototype.exit=function(){t.prototype.exit.apply(this,arguments)};a.prototype.onBeforeRendering=function(){t.prototype.onBeforeRendering.apply(this,arguments);this._getTitle().setText(this.getTitle()).setMaxLines(this.getTitleMaxLines());this._getSubtitle().setText(this.getSubtitle()).setMaxLines(this.getSubtitleMaxLines());this._getUnitOfMeasurement().setText(this.getUnitOfMeasurement());this._getDetails().setText(this.getDetails()).setMaxLines(this.getDetailsMaxLines());this._getNumericIndicators().setNumber(this.getNumber()).setScale(this.getScale()).setTrend(this.getTrend()).setState(this.getState()).setSideIndicatorsAlignment(this.getSideIndicatorsAlignment()).setNumberVisible(this.getNumberVisible())};a.prototype.enhanceAccessibilityState=function(t,e){if(t===this.getAggregation("_title")){e.role=this.getTitleAriaRole();e.level=this.getAriaHeadingLevel()}};a.prototype._getTitle=function(){var t=this.getAggregation("_title");if(!t){t=new i({id:this.getId()+"-title",wrapping:true,maxLines:this.getTitleMaxLines()});this.setAggregation("_title",t)}return t};a.prototype._getSubtitle=function(){var t=this.getAggregation("_subtitle");if(!t){t=new i({id:this.getId()+"-subtitle",wrapping:true,maxLines:this.getSubtitleMaxLines()});this.setAggregation("_subtitle",t)}return t};a.prototype._getUnitOfMeasurement=function(){var t=this.getAggregation("_unitOfMeasurement");if(!t){t=new i({id:this.getId()+"-unitOfMeasurement",wrapping:false});this.setAggregation("_unitOfMeasurement",t)}return t};a.prototype._getDetails=function(){var t=this.getAggregation("_details");if(!t){t=new i({id:this.getId()+"-details"});this.setAggregation("_details",t)}return t};a.prototype._getNumericIndicators=function(){var t=this.getAggregation("_numericIndicators");if(!t){t=new e;this.setAggregation("_numericIndicators",t)}return t};a.prototype._getAriaLabelledBy=function(){var t="",e="",i="",s="",a=this._getUnitOfMeasurement().getId(),r="",n=this._getSideIndicatorIds(),g="",p;if(this.getParent()&&this.getParent()._ariaText){t=this.getParent()._ariaText.getId()}if(this.getTitle()){e=this._getTitle().getId()}if(this.getSubtitle()){i=this._getSubtitle().getId()}if(this.getStatusText()){s=this.getId()+"-status"}if(this.getDetails()){g=this._getDetails().getId()}if(this.getNumber()||this.getScale()){r=this._getNumericIndicators()._getMainIndicator().getId()}p=t+" "+e+" "+i+" "+s+" "+a+" "+r+" "+n+" "+g;return p.replace(/ {2,}/g," ").trim()};a.prototype._getSideIndicatorIds=function(){return this.getSideIndicators().map(function(t){return t.getId()}).join(" ")};a.prototype.isLoading=function(){return false};a.prototype.attachPress=function(){var e=Array.prototype.slice.apply(arguments);e.unshift("press");t.prototype.attachEvent.apply(this,e);this.invalidate();return this};a.prototype.detachPress=function(){var e=Array.prototype.slice.apply(arguments);e.unshift("press");t.prototype.detachEvent.apply(this,e);this.invalidate();return this};return a});