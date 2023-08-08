// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/services/_Personalization/constants.private","sap/ushell/services/_Personalization/utils","sap/ushell/services/_Personalization/VariantSet"],function(t,n,e){"use strict";function r(t){this._oContextContainer=t}r.prototype.save=function(){return this._oContextContainer.save()};r.prototype.getVariantSetKeys=function(){var n=this._oContextContainer._getInternalKeys(),e=[];e=n.map(function(n){return n.replace(t.S_VARIANT_PREFIX,"","")});return e};r.prototype.containsVariantSet=function(t){return this.getVariantSetKeys().indexOf(t)>=0};r.prototype.getVariantSet=function(n){var r=this._oContextContainer._getItemValueInternal(t.S_VARIANT_PREFIX,n);if(!r){return undefined}return new e(n,this._oContextContainer)};r.prototype.addVariantSet=function(r){var a={},i={};if(this.containsVariantSet(r)){throw new n.Error("Container already contains a variant set with key '"+r+"': sap.ushell.services.Personalization"," ")}a={currentVariant:null,variants:{}};this._oContextContainer._setItemValueInternal(t.S_VARIANT_PREFIX,r,a);i=new e(r,this._oContextContainer);return i};r.prototype.delVariantSet=function(n){this._oContextContainer._delItemInternal(t.S_VARIANT_PREFIX,n)};return r});