/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Element"],function(e){"use strict";var t=e.extend("sap.ui.mdc.field.FieldValueHelpContentWrapperBase",{metadata:{library:"sap.ui.mdc",properties:{selectedItems:{type:"object[]",defaultValue:[]}},defaultProperty:"selectedItems",events:{navigate:{parameters:{key:{type:"any"},description:{type:"string"},leave:{type:"boolean"},disableFocus:{type:"boolean"},itemId:{type:"string"}}},selectionChange:{parameters:{selectedItems:{type:"object[]"},itemPress:{type:"boolean"}}},dataUpdate:{parameters:{contentChange:{type:"boolean"}}}}}});t.prototype.init=function(){};t.prototype.exit=function(){this.dispose()};t.prototype.initialize=function(e){return this};t.prototype.dispose=function(e){};t.prototype.setSelectedItems=function(e){this.setProperty("selectedItems",e,true);return this};t.prototype.getDialogContent=function(){return undefined};t.prototype.getSuggestionContent=function(){return undefined};t.prototype.fieldHelpOpen=function(e){this._bSuggestion=e;return this};t.prototype.fieldHelpClose=function(){delete this._bSuggestion;return this};t.prototype.removeFocus=function(){return this};t.prototype.getFilterEnabled=function(){return true};t.prototype.navigate=function(e){};t.prototype.getTextForKey=function(e,t,n,r,o){return""};t.prototype.getKeyForText=function(e,t,n,r){return undefined};t.prototype.getKeyAndText=function(e,t,n,r,o){return undefined};t.prototype.getListBinding=function(){return undefined};t.prototype.getAsyncKeyText=function(){return false};t.prototype.applyFilters=function(e,t){};t.prototype.isSuspended=function(){return false};t.prototype.enableShowAllItems=function(){return false};t.prototype.getAllItemsShown=function(){return false};t.prototype._getFieldHelp=function(){var e=this.getParent();if(!e||!e.isA("sap.ui.mdc.field.FieldValueHelp")){throw new Error(this.getId()+" must be assigned to a sap.ui.mdc.field.FieldValueHelp")}return e};t.prototype._getKeyPath=function(){var e=this._getFieldHelp();return e._getKeyPath()};t.prototype._getDescriptionPath=function(){var e=this._getFieldHelp();return e.getDescriptionPath()};t.prototype._getInParameters=function(){var e=this._getFieldHelp();var t=[];if(e){t=n(e.getInParameters())}return t};t.prototype._getOutParameters=function(){var e=this._getFieldHelp();var t=[];if(e){t=n(e.getOutParameters())}return t};function n(e){var t=[];for(var n=0;n<e.length;n++){var r=e[n];var o=r.getHelpPath();if(o){t.push(o)}}return t}t.prototype._getMaxConditions=function(){var e=this._getFieldHelp();return e.getMaxConditions()};t.prototype._getDelegate=function(){var e=this._getFieldHelp();return{delegate:e.getControlDelegate(),payload:e.getPayload()}};t.prototype.getScrollDelegate=function(){var e=this._getFieldHelp();return e.getScrollDelegate&&e.getScrollDelegate()};return t});