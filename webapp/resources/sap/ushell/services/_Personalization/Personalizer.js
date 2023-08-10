// Copyright (c) 2009-2022 SAP SE, All Rights Reserved
sap.ui.define(["sap/ushell/utils","sap/ui/thirdparty/jquery","sap/base/Log"],function(e,t,n){"use strict";function r(t,n,r,i,o){this._sPersContainer="";this._sPersItem="";this._sPersVariant=null;this._oAdapter=n;this._oService=t;this._oScope=i;this._oComponent=o;if(!r||!r.container||!r.item||typeof r.container!=="string"||typeof r.item!=="string"){throw new e.Error("Invalid input for oPersId: sap.ushell.services.Personalization"," ")}this._sPersContainer=r.container;this._sPersItem=r.item}r.prototype._getContainer=function(e){if(!this._oGetContainerPromise){this._oGetContainerPromise=this._oService.getContainer(e,this._oScope,this._oComponent)}return this._oGetContainerPromise};r.prototype.getPersData=function(){var e={},r=this;e=new t.Deferred;this._getContainer(this._sPersContainer).fail(function(){e.reject()}).done(function(t){e.resolve(t.getItemValue(r._sPersItem))});e.fail(function(){n.error("Fail to get Personalization data for Personalizer container: "+r._sPersContainer)});return e.promise()};r.prototype.setPersData=function(e){var r={},i=this;r=new t.Deferred;this._getContainer(this._sPersContainer).fail(function(){r.reject()}).done(function(t){t.setItemValue(i._sPersItem,e);t.save().fail(function(){r.reject()}).done(function(){r.resolve()})});r.fail(function(){n.error("Fail to set Personalization data for Personalizer container: "+i._sPersContainer)});return r.promise()};r.prototype.delPersData=function(){var e={},r=this,i;e=new t.Deferred;this._getContainer(this._sPersContainer).fail(function(){e.reject()}).done(function(t){t.delItem(r._sPersItem);t.save().fail(function(){e.reject()}).done(function(){e.resolve()})});i=e.promise();i.fail(function(){n.error("Fail to delete Personalization data for Personalizer container: "+this._sPersContainer)});return i};return r});